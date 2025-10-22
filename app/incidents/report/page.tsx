"use client";
import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import dynamic from 'next/dynamic';
import Link from "next/link";
import supabase from "../../../utils/supabase";
import { validateIncidentReport } from "../../../utils/incidentValidation";

const LocationPicker = dynamic(() => import("../../components/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  ),
});

const INCIDENT_TYPES = [
  'ICE Activity',
  'Border Patrol Activity',
  'Checkpoint',
  'Raid in Progress',
  'Suspicious Vehicle',
  'Other Activity'
];

const INCIDENT_DESCRIPTIONS = {
  'ICE Activity': [
    { label: 'Number of officers', type: 'text' },
    { label: 'Vehicle descriptions', type: 'text' },
    { label: 'Badge numbers (if visible)', type: 'text' },
    { label: 'Actions being taken', type: 'text' },
    { label: 'Witnesses present', type: 'text' }
  ],
  'Border Patrol Activity': [
    { label: 'Number of agents', type: 'text' },
    { label: 'Vehicle descriptions', type: 'text' },
    { label: 'Actions being taken', type: 'text' },
    { label: 'Checkpoint or mobile unit', type: 'text' }
  ],
  'Checkpoint': [
    { label: 'Checkpoint location', type: 'text' },
    { label: 'Type of checkpoint', type: 'text' },
    { label: 'Number of officers', type: 'text' },
    { label: 'Vehicle descriptions', type: 'text' },
    { label: 'Specific activities observed', type: 'text' }
  ],
  'Raid in Progress': [
    { label: 'Location of raid', type: 'text' },
    { label: 'Number of officers', type: 'text' },
    { label: 'Vehicle descriptions', type: 'text' },
    { label: 'Type of location (business/residence)', type: 'text' },
    { label: 'Actions being taken', type: 'text' }
  ],
  'Suspicious Vehicle': [
    { label: 'Vehicle description', type: 'text' },
    { label: 'License plate (if visible)', type: 'text' },
    { label: 'Number of occupants', type: 'text' },
    { label: 'Observed behavior', type: 'text' },
    { label: 'Direction of travel', type: 'text' }
  ],
  'Other Activity': [
    { label: 'Please describe the activity in detail', type: 'text' },
    { label: 'Location', type: 'text' },
    { label: 'Personnel involved', type: 'text' },
    { label: 'Vehicles present', type: 'text' },
    { label: 'Actions observed', type: 'text' }
  ]
} as const;

export default function ReportIncidentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState<{id: string, email: string, name: string} | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    description: {} as Record<string, string>,
    location: {
      lat: 0,
      lng: 0,
      address: ""
    },
    status: "active",
    attachment: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [monthlyIncidentCount, setMonthlyIncidentCount] = useState(0);

  // Get user's current location
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationPermissionGranted(true);
      },
      (error) => {
        console.log('Error getting location:', error);
        setLocationPermissionGranted(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, []);

  // Get monthly incident count for current user
  const getMonthlyIncidentCount = async (userId: string) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const { data: incidents, error } = await supabase
        .from('incidents')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString());

      if (error) {
        console.error('Error fetching monthly incidents:', error);
        return 0;
      }

      return incidents?.length || 0;
    } catch (error) {
      console.error('Error getting monthly incident count:', error);
      return 0;
    }
  };

  // Get current user on component mount
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser({
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.full_name || user.email || 'Anonymous User'
          });
          // Get user's location after user is set
          getUserLocation();
          // Get monthly incident count
          const count = await getMonthlyIncidentCount(user.id);
          setMonthlyIncidentCount(count);
        }
      } catch (error) {
        console.error('Error getting user:', error);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email || 'Anonymous User'
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [getUserLocation]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentStep !== 3) {
      return;
    }
    
    setIsSubmitting(true);
    setValidationError("");
    
    try {
      const lat = parseFloat(formData.location.lat.toString()) || 0;
      const lng = parseFloat(formData.location.lng.toString()) || 0;

      if (isNaN(lat) || isNaN(lng)) {
        setValidationError("Invalid coordinates. Please select a valid location.");
        setIsSubmitting(false);
        return;
      }

      // Check if user is logged in
      if (!user) {
        setValidationError("You must be logged in to report incidents.");
        setIsSubmitting(false);
        return;
      }

      // Debug: Log coordinates for troubleshooting
      console.log('Debug - Incident coordinates:', { lat, lng });
      console.log('Debug - User GPS coordinates:', userLocation);
      console.log('Debug - Selected location address:', formData.location.address);

      // Calculate distance for debugging
      if (userLocation) {
        const distance = Math.sqrt(
          Math.pow(lat - userLocation.lat, 2) + Math.pow(lng - userLocation.lng, 2)
        ) * 111; // Rough conversion to km
        console.log('Debug - Simple distance calculation:', distance, 'km');
      }

      // Comprehensive validation using new system
      const validation = await validateIncidentReport(
        user.id,
        lat,
        lng,
        userLocation?.lat,
        userLocation?.lng
      );
      
      if (!validation.isValid) {
        console.log('Debug - Validation failed:', validation);
        
        // Check if this is a monthly limit error - don't bypass this
        if (validation.message.includes('monthly limit')) {
          setValidationError(validation.message);
          setIsSubmitting(false);
          return;
        }
        
        // Check if coordinates are very close (within ~11km) - likely same location with minor GPS differences
        // Only bypass location distance validation, not other validations like monthly limit
        if (user && userLocation && validation.message.includes('distance')) {
          const latDiff = Math.abs(lat - userLocation.lat);
          const lngDiff = Math.abs(lng - userLocation.lng);
          const roughDistance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Rough km conversion
          
          if (roughDistance < 11) { // Within ~11km, likely same location
            console.log('Debug - Coordinates are very close, likely same location. Bypassing distance validation only.');
            console.log('Debug - Rough distance:', roughDistance, 'km');
          } else {
            setValidationError(validation.message);
            setIsSubmitting(false);
            return;
          }
        } else {
          setValidationError(validation.message);
          setIsSubmitting(false);
          return;
        }
      }

      const formattedDescription = Object.entries(formData.description)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

      const dataToInsert = {
        type: formData.type,
        description: formattedDescription,
        latitude: lat,
        longitude: lng,
        address: formData.location.address || "No address provided",
        created_at: new Date().toISOString(),
        status: 'active',
        // Include user information if available
        ...(user && {
          user_id: user.id,
          user_name: user.name,
          user_email: user.email
        })
      };

      let insertResult = await supabase
        .from("incidents")
        .insert([dataToInsert])
        .select();

      if (insertResult.error) {
        console.error("Error inserting data:", insertResult.error);
        
        // Check if it's a duplicate prevention error from database
        if (insertResult.error.message && insertResult.error.message.includes("Many reports already in this area")) {
          setValidationError(insertResult.error.message);
          setIsSubmitting(false);
          return;
        }
        
        const simplifiedData = {
          type: formData.type,
          description: formattedDescription,
          latitude: lat,
          longitude: lng,
          address: formData.location.address || "No address provided",
          created_at: new Date().toISOString(),
          status: 'active',
          // Include user information if available
          ...(user && {
            user_id: user.id,
            user_name: user.name,
            user_email: user.email
          })
        };

        insertResult = await supabase
          .from("incidents")
          .insert([simplifiedData])
          .select();

        if (insertResult.error) {
          console.error("Fallback error:", insertResult.error);
          
          // Check if fallback also has duplicate prevention error
          if (insertResult.error.message && insertResult.error.message.includes("Many reports already in this area")) {
            setValidationError(insertResult.error.message);
          } else {
            setValidationError("Failed to submit report. Please try again.");
          }
          setIsSubmitting(false);
          return;
        }
      }

      if (formData.attachment && insertResult.data?.[0]?.id) {
        const fileExt = formData.attachment.name.split('.').pop();
        const fileName = `${insertResult.data[0].id}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('incident-attachments')
          .upload(fileName, formData.attachment);

        if (uploadError) {
          console.error("Error uploading file:", uploadError);
        }
      }

      setFormData({
        type: "",
        description: {},
        location: {
          lat: 0,
          lng: 0,
          address: ""
        },
        status: "active",
        attachment: null
      });

      alert("Report submitted successfully!");
      window.location.href = "/incidents";
    } catch (error) {
      console.error("Unexpected error:", error);
      setValidationError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDetailChange = (label: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      description: {
        ...prev.description,
        [label]: value
      }
    }));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        attachment: e.target.files![0]
      }));
    }
  };

  const handleLocationSelect = useCallback((location: { lat: number; lng: number; address: string }) => {
    setFormData(prev => ({
      ...prev,
      location
    }));
  }, []);

  const nextStep = () => {
    if (currentStep === 1 && !formData.type) {
      alert("Please select an incident type");
      return;
    }
    if (currentStep === 2 && Object.keys(formData.description).length === 0) {
      alert("Please fill in the incident details");
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="relative py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/incidents"
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Incidents
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Report an Incident
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Help keep our community informed and safe by reporting incidents in your area.
            </p>
          </motion.div>

          {/* Incident Reporting Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Incident Reporting Requirements
                </h3>
                <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>
                      <strong>Account Required:</strong> {user ? '✓ You are logged in' : '✗ You must be logged in'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${locationPermissionGranted ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span>
                      <strong>Location Access:</strong> {locationPermissionGranted ? '✓ Location detected' : '⚠ Location permission needed for distance validation'}
                    </span>
                  </div>
                  {userLocation && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>
                        <strong>Your GPS Location:</strong> {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                      </span>
                    </div>
                  )}
                  {formData.location.lat !== 0 && formData.location.lng !== 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <span>
                        <strong>Selected Location:</strong> {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>
                      <strong>Distance Limit:</strong> You can only report incidents near your current location
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${monthlyIncidentCount >= 3 ? 'bg-red-500' : monthlyIncidentCount >= 2 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    <span>
                      <strong>Monthly Limit:</strong> {monthlyIncidentCount}/3 incident reports used this month
                    </span>
                  </div>
                </div>
                {monthlyIncidentCount >= 3 && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      <strong>Monthly Limit Reached:</strong> You have already submitted 3 incident reports this month. You can report again next month.
                    </p>
                  </div>
                )}
                {monthlyIncidentCount === 2 && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Monthly Limit Warning:</strong> You have submitted 2 incident reports this month. You can submit 1 more report this month.
                    </p>
                  </div>
                )}
                {user && !locationPermissionGranted && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Location Permission:</strong> Allow location access to validate incident distance from your current location.
                      </p>
                      <button
                        onClick={getUserLocation}
                        className="ml-4 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded-md transition-colors"
                      >
                        Allow Location
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-8 relative">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2" />
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-blue-600 dark:bg-blue-500 -translate-y-1/2 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />
            {[1, 2, 3].map((step) => (
              <motion.div
                key={step}
                initial={{ scale: 0.8 }}
                animate={{
                  scale: currentStep >= step ? 1 : 0.8,
                  backgroundColor: currentStep >= step ? "rgb(37, 99, 235)" : "rgb(229, 231, 235)"
                }}
                className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold transition-colors`}
              >
                {step}
              </motion.div>
            ))}
          </div>

          {/* Form Container */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Incident Type */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-lg font-medium text-gray-900 dark:text-white mb-4">
                      What type of incident would you like to report?
                    </label>
                    <div className="grid gap-4 md:grid-cols-2">
                      {INCIDENT_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, type }))}
                          className={`p-4 rounded-lg border-2 text-left transition-colors ${
                            formData.type === type
                              ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500"
                              : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                          }`}
                        >
                          <div className="font-medium text-gray-900 dark:text-white">
                            {type}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Incident Details */}
              {currentStep === 2 && formData.type && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Please provide details about the {formData.type.toLowerCase()}
                    </h3>
                    <div className="space-y-4">
                      {INCIDENT_DESCRIPTIONS[formData.type as keyof typeof INCIDENT_DESCRIPTIONS].map(({ label }) => (
                        <div key={label}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {label}
                          </label>
                          <input
                            type="text"
                            value={formData.description[label] || ""}
                            onChange={(e) => handleDetailChange(label, e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Location and Media */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Where did this incident occur?
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Click on the map to select the incident location, or use the 📍 button to center on your current location.
                    </p>
                    <LocationPicker onLocationSelect={handleLocationSelect} userLocation={userLocation} />
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-900 dark:text-white mt-16 mb-2">
                      Add supporting media (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleVideoChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </motion.div>
              )}

              {/* Validation Error Message */}
              {validationError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                >
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        Unable to Submit Report
                      </h3>
                      <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                        {validationError}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Previous
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.location.lat || !formData.location.lng || monthlyIncidentCount >= 3}
                    className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : monthlyIncidentCount >= 3 ? "Monthly Limit Reached" : "Submit Report"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
} 