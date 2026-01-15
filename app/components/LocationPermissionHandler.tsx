"use client";
import { useEffect, useState, ReactNode, useRef } from 'react';

interface LocationPermissionHandlerProps {
  children: ReactNode;
  onLocationGranted: (position: GeolocationPosition) => void;
  onLocationDenied: () => void;
  onLocationError: (error: GeolocationPositionError) => void;
}

export default function LocationPermissionHandler({
  children,
  onLocationGranted,
  onLocationDenied,
  onLocationError
}: LocationPermissionHandlerProps) {
  const [permissionChecked, setPermissionChecked] = useState(false);
  const hasRequestedLocation = useRef(false);

  useEffect(() => {
    // Only run once when component mounts
    if (hasRequestedLocation.current) return;
    hasRequestedLocation.current = true;
    
    const checkPermission = () => {
      if (!navigator.geolocation) {
        onLocationDenied();
        setPermissionChecked(true);
        return;
      }

      // Request location with longer timeout and background retry
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationGranted(position);
          setPermissionChecked(true);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            onLocationDenied();
          } else {
            onLocationError(error);
          }
          setPermissionChecked(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000, // Increased to 30 seconds
          maximumAge: 300000 // Cache for 5 minutes
        }
      );
    };

    // Start the permission check
    checkPermission();

    // Background retry mechanism - retry every 30 seconds if not checked
    const retryInterval = setInterval(() => {
      if (!permissionChecked) {
        checkPermission();
      } else {
        clearInterval(retryInterval);
      }
    }, 30000);

    // Fallback timeout after 2 minutes
    const fallbackTimeout = setTimeout(() => {
      if (!permissionChecked) {
        onLocationDenied();
        setPermissionChecked(true);
        clearInterval(retryInterval);
      }
    }, 120000);

    return () => {
      clearInterval(retryInterval);
      clearTimeout(fallbackTimeout);
    };
  }, [onLocationGranted, onLocationDenied, onLocationError, permissionChecked]);

  return <>{children}</>;
} 
