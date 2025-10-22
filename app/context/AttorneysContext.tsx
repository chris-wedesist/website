"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Attorney } from '../../types/attorney';

interface AttorneysContextType {
  attorneys: Attorney[];
  setAttorneys: (attorneys: Attorney[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  fetchAttorneys: (lat: number, lng: number) => Promise<void>;
}

const AttorneysContext = createContext<AttorneysContextType | undefined>(undefined);

export function AttorneysProvider({ children }: { children: ReactNode }) {
  const [attorneys, setAttorneys] = useState<Attorney[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttorneys = async (lat: number, lng: number) => {
    try {
      console.log('AttorneysContext: Starting to fetch attorneys...');
      setLoading(true);
      setError(null);
      
      console.log('AttorneysContext: Fetching attorneys with params:', { lat, lng, radius: 50 });
      const response = await fetch(`/api/attorneys?lat=${lat}&lng=${lng}&radius=50`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('AttorneysContext: API response data:', data);
      console.log('AttorneysContext: Received attorneys count:', data.attorneys?.length || 0);

      if (!data.attorneys || data.attorneys.length === 0) {
        console.log('AttorneysContext: No attorneys found in response');
        setAttorneys([]);
      } else {
        console.log('AttorneysContext: Setting attorneys:', data.attorneys.length);
        setAttorneys(data.attorneys);
      }
    } catch (err) {
      const errorMessage = `Error fetching attorneys: ${err instanceof Error ? err.message : 'Unknown error'}`;
      console.error('AttorneysContext:', errorMessage);
      setError(errorMessage);
      setAttorneys([]);
    } finally {
      console.log('AttorneysContext: Setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('AttorneysContext: Initializing...');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          console.log('AttorneysContext: Location obtained:', { lat, lng });
          await fetchAttorneys(lat, lng);
        },
        (error) => {
          console.error('AttorneysContext: Location error:', error);
          // Use default location (Karachi) if geolocation fails
          const defaultLat = 24.8607;
          const defaultLng = 67.0011;
          console.log('AttorneysContext: Using default location:', { defaultLat, defaultLng });
          fetchAttorneys(defaultLat, defaultLng);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.log('AttorneysContext: Geolocation not supported, using default location');
      // Use default location (Karachi) if geolocation is not supported
      const defaultLat = 24.8607;
      const defaultLng = 67.0011;
      fetchAttorneys(defaultLat, defaultLng);
    }
  }, []);

  // Add effect to log state changes
  useEffect(() => {
    console.log('AttorneysContext state updated:', {
      attorneysCount: attorneys.length,
      loading,
      error
    });
  }, [attorneys, loading, error]);

  return (
    <AttorneysContext.Provider value={{ attorneys, setAttorneys, loading, setLoading, error, setError, fetchAttorneys }}>
      {children}
    </AttorneysContext.Provider>
  );
}

export function useAttorneys() {
  const context = useContext(AttorneysContext);
  if (context === undefined) {
    throw new Error('useAttorneys must be used within an AttorneysProvider');
  }
  return context;
} 