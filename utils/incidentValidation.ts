import supabase from './supabase';

// Configuration for incident reporting restrictions
const INCIDENT_RESTRICTIONS_CONFIG = {
  // Maximum distance in kilometers from user's current location
  MAX_DISTANCE_FROM_USER_KM: 16.09, // 10 miles
  // Maximum incidents per user per month
  MAX_INCIDENTS_PER_MONTH: 3,
  // Radius in kilometers within which to check for duplicates (reduced from time-based)
  DUPLICATE_CHECK_RADIUS_KM: 0.5, // 500 meters
  // Time window in minutes to check for recent incidents (reduced)
  DUPLICATE_CHECK_TIME_MINUTES: 15,
  // Maximum number of incidents allowed in the area within the time window
  MAX_INCIDENTS_IN_AREA: 1
};

/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
*/
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Check if user is verified and can report incidents
 * @param userId User ID to check
 * @returns Object with validation result and message
 */
export async function validateUserCanReport(
  userId: string
): Promise<{ isValid: boolean; message: string }> {
  try {
    // Check if user exists
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, username')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return {
        isValid: false,
        message: 'User not found. Please log in to report incidents.'
      };
    }

    // For now, we'll consider any user in the users table as "verified"
    // In a production system, you might want to add verification fields
    // or use Supabase Auth's email confirmation status

    return { isValid: true, message: '' };
  } catch (error) {
    console.error('Error validating user:', error);
    return {
      isValid: false,
      message: 'Unable to verify user status. Please try again.'
    };
  }
}

/**
 * Check if user has exceeded monthly incident limit
 * @param userId User ID to check
 * @returns Object with validation result and message
 */
export async function validateMonthlyLimit(
  userId: string
): Promise<{ isValid: boolean; message: string; incidentsThisMonth?: number }> {
  try {
    // Get start of current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Count incidents reported by user this month
    const { data: incidents, error } = await supabase
      .from('incidents')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString());

    if (error) {
      console.error('Error checking monthly limit:', error);
      return {
        isValid: true, // Allow if we can't check
        message: ''
      };
    }

    const incidentsThisMonth = incidents?.length || 0;

    if (incidentsThisMonth >= INCIDENT_RESTRICTIONS_CONFIG.MAX_INCIDENTS_PER_MONTH) {
      return {
        isValid: false,
        message: `You have reached your monthly limit of ${INCIDENT_RESTRICTIONS_CONFIG.MAX_INCIDENTS_PER_MONTH} incident reports. You can report again next month.`,
        incidentsThisMonth
      };
    }

    return { 
      isValid: true, 
      message: '',
      incidentsThisMonth
    };
  } catch (error) {
    console.error('Error validating monthly limit:', error);
    return {
      isValid: true, // Allow if we can't check
      message: ''
    };
  }
}

/**
 * Check if incident location is within allowed distance from user's current location
 * @param incidentLat Latitude of the incident
 * @param incidentLng Longitude of the incident
 * @param userLat User's current latitude
 * @param userLng User's current longitude
 * @returns Object with validation result and message
 */
export function validateLocationDistance(
  incidentLat: number,
  incidentLng: number,
  userLat: number,
  userLng: number
): { isValid: boolean; message: string; distance?: number } {
  try {
    const distance = calculateDistance(incidentLat, incidentLng, userLat, userLng);
    
    if (distance > INCIDENT_RESTRICTIONS_CONFIG.MAX_DISTANCE_FROM_USER_KM) {
      return {
        isValid: false,
        message: `You can only report incidents within ${INCIDENT_RESTRICTIONS_CONFIG.MAX_DISTANCE_FROM_USER_KM.toFixed(1)} km (10 miles) of your current location. This incident is ${distance.toFixed(1)} km away. Please select a location closer to your current position or use the "📍" button on the map to center it on your location.`,
        distance
      };
    }

    return { 
      isValid: true, 
      message: '',
      distance
    };
  } catch (error) {
    console.error('Error validating location distance:', error);
    return {
      isValid: false,
      message: 'Unable to validate location distance. Please try again.'
    };
  }
}

/**
 * Check if there are too many recent incidents in the area (duplicate prevention)
 * @param latitude Latitude of the new incident
 * @param longitude Longitude of the new incident
 * @returns Object with validation result and message
 */
export async function validateIncidentLocation(
  latitude: number, 
  longitude: number
): Promise<{ isValid: boolean; message: string; nearbyIncidents?: number }> {
  try {
    // Calculate time threshold
    const timeThreshold = new Date();
    timeThreshold.setMinutes(timeThreshold.getMinutes() - INCIDENT_RESTRICTIONS_CONFIG.DUPLICATE_CHECK_TIME_MINUTES);

    // Fetch recent incidents
    const { data: recentIncidents, error } = await supabase
      .from('incidents')
      .select('latitude, longitude, created_at, type')
      .gte('created_at', timeThreshold.toISOString())
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching recent incidents:', error);
      // If we can't check, allow the report to proceed
      return { isValid: true, message: '' };
    }

    if (!recentIncidents || recentIncidents.length === 0) {
      return { isValid: true, message: '' };
    }

    // Check for incidents within the radius
    const nearbyIncidents = recentIncidents.filter(incident => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        incident.latitude, 
        incident.longitude
      );
      return distance <= INCIDENT_RESTRICTIONS_CONFIG.DUPLICATE_CHECK_RADIUS_KM;
    });

    if (nearbyIncidents.length >= INCIDENT_RESTRICTIONS_CONFIG.MAX_INCIDENTS_IN_AREA) {
      return {
        isValid: false,
        message: `Unable to report your incident because there is already a recent report in this area. Please try again later or report from a different location.`,
        nearbyIncidents: nearbyIncidents.length
      };
    }

    return { 
      isValid: true, 
      message: '',
      nearbyIncidents: nearbyIncidents.length
    };

  } catch (error) {
    console.error('Error validating incident location:', error);
    // If validation fails, allow the report to proceed
    return { isValid: true, message: '' };
  }
}

/**
 * Get configuration for incident restrictions
 */
export function getIncidentRestrictionsConfig() {
  return INCIDENT_RESTRICTIONS_CONFIG;
}

/**
 * Get user's stored location from database
 * @param userId User ID
 * @returns Object with user location or null
 */
export async function getUserStoredLocation(
  userId: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('latitude, longitude')
      .eq('id', userId)
      .single();

    if (error || !user || !user.latitude || !user.longitude) {
      return null;
    }

    return {
      lat: user.latitude,
      lng: user.longitude
    };
  } catch (error) {
    console.error('Error getting user stored location:', error);
    return null;
  }
}

/**
 * Comprehensive validation for incident reporting
 * @param userId User ID
 * @param incidentLat Latitude of the incident
 * @param incidentLng Longitude of the incident
 * @param userCurrentLat User's current latitude (optional, from geolocation)
 * @param userCurrentLng User's current longitude (optional, from geolocation)
 * @returns Object with validation result and message
 */
export async function validateIncidentReport(
  userId: string,
  incidentLat: number,
  incidentLng: number,
  userCurrentLat?: number,
  userCurrentLng?: number
): Promise<{ 
  isValid: boolean; 
  message: string; 
  details?: {
    userVerified?: boolean;
    monthlyLimit?: number;
    distanceFromUser?: number;
    nearbyIncidents?: number;
    usingStoredLocation?: boolean;
  }
}> {
  try {
    // 1. Check if user is verified
    const userValidation = await validateUserCanReport(userId);
    if (!userValidation.isValid) {
      return {
        isValid: false,
        message: userValidation.message,
        details: { userVerified: false }
      };
    }

    // 2. Check monthly limit
    const monthlyValidation = await validateMonthlyLimit(userId);
    if (!monthlyValidation.isValid) {
      return {
        isValid: false,
        message: monthlyValidation.message,
        details: { 
          userVerified: true,
          monthlyLimit: monthlyValidation.incidentsThisMonth
        }
      };
    }

    // 3. Check location distance
    let userLocationToUse: { lat: number; lng: number } | null = null;
    let usingStoredLocation = false;

    // Try to use current location first, then fall back to stored location
    if (userCurrentLat !== undefined && userCurrentLng !== undefined) {
      userLocationToUse = { lat: userCurrentLat, lng: userCurrentLng };
    } else {
      // Fall back to stored location in database
      userLocationToUse = await getUserStoredLocation(userId);
      usingStoredLocation = true;
    }

    if (userLocationToUse) {
      const distanceValidation = validateLocationDistance(
        incidentLat, 
        incidentLng, 
        userLocationToUse.lat, 
        userLocationToUse.lng
      );
      if (!distanceValidation.isValid) {
        return {
          isValid: false,
          message: distanceValidation.message,
          details: { 
            userVerified: true,
            monthlyLimit: monthlyValidation.incidentsThisMonth,
            distanceFromUser: distanceValidation.distance,
            usingStoredLocation
          }
        };
      }
    } else {
      // If no location available, warn but allow
      console.warn('No user location available for distance validation');
    }

    // 4. Check for duplicate incidents in area
    const locationValidation = await validateIncidentLocation(incidentLat, incidentLng);
    if (!locationValidation.isValid) {
      return {
        isValid: false,
        message: locationValidation.message,
        details: { 
          userVerified: true,
          monthlyLimit: monthlyValidation.incidentsThisMonth,
          distanceFromUser: userLocationToUse ? 
            calculateDistance(incidentLat, incidentLng, userLocationToUse.lat, userLocationToUse.lng) : undefined,
          nearbyIncidents: locationValidation.nearbyIncidents,
          usingStoredLocation
        }
      };
    }

    return {
      isValid: true,
      message: '',
      details: {
        userVerified: true,
        monthlyLimit: monthlyValidation.incidentsThisMonth,
        distanceFromUser: userLocationToUse ? 
          calculateDistance(incidentLat, incidentLng, userLocationToUse.lat, userLocationToUse.lng) : undefined,
        nearbyIncidents: locationValidation.nearbyIncidents,
        usingStoredLocation
      }
    };

  } catch (error) {
    console.error('Error in comprehensive validation:', error);
    return {
      isValid: false,
      message: 'Unable to validate incident report. Please try again.'
    };
  }
}
