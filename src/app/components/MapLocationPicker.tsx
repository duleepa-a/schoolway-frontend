'use client';

import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// Define the container style
const containerStyle = {
  width: '100%',
  height: '400px'
};

// Sri Lanka center coordinates
const defaultCenter = {
  lat: 7.8731,
  lng: 80.7718
};

interface MapLocationPickerProps {
  onLocationSelect: (location: { lat: number, lng: number }) => void;
  initialLocation?: { lat: number, lng: number } | null;
}

const MapLocationPicker: React.FC<MapLocationPickerProps> = ({ 
  onLocationSelect, 
  initialLocation = null 
}) => {
  // Use initial location or default to Sri Lanka center
  const [markerPosition, setMarkerPosition] = useState(initialLocation || defaultCenter);
  const [mapCenter, setMapCenter] = useState(initialLocation || defaultCenter);
  const [searchAddress, setSearchAddress] = useState('');
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  // Initialize map and set up services
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    geocoderRef.current = new google.maps.Geocoder();
    
    // Create a dummy div for PlacesService (required by API)
    const dummyElement = document.createElement('div');
    placesServiceRef.current = new google.maps.places.PlacesService(map);
  }, []);

  // Handle map click to place marker
  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      setMarkerPosition(newPosition);
      onLocationSelect(newPosition);

      // Reverse geocode to get address (optional)
      if (geocoderRef.current) {
        geocoderRef.current.geocode({ location: newPosition }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            setSearchAddress(results[0].formatted_address);
          }
        });
      }
    }
  }, [onLocationSelect]);

  // Handle search by term or address
  const handleAddressSearch = useCallback(() => {
    if (!searchAddress) return;
    
    // Try Places API first for search terms like "Hilton Hotel Colombo"
    if (placesServiceRef.current) {
      // Search for places matching the term
      placesServiceRef.current.textSearch({
        query: searchAddress,
        // You can add bounds to limit to Sri Lanka if needed
        // bounds: new google.maps.LatLngBounds(
        //   { lat: 5.9, lng: 79.5 },  // SW corner of Sri Lanka
        //   { lat: 9.9, lng: 82.0 }   // NE corner of Sri Lanka
        // )
      }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          // Get location of first result
          const location = results[0].geometry?.location;
          if (location) {
            const newPosition = {
              lat: location.lat(),
              lng: location.lng()
            };
            setMarkerPosition(newPosition);
            setMapCenter(newPosition);
            onLocationSelect(newPosition);
            
            // Update search field with the place name for clarity
            setSearchAddress(results[0].name || searchAddress);
          }
        } else {
          // Fall back to geocoder for address search
          if (geocoderRef.current) {
            geocoderRef.current.geocode({ address: searchAddress }, (results, status) => {
              if (status === 'OK' && results?.[0]?.geometry?.location) {
                const newPosition = {
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng()
                };
                setMarkerPosition(newPosition);
                setMapCenter(newPosition);
                onLocationSelect(newPosition);
              } else {
                alert('Could not find location for the search term provided.');
              }
            });
          }
        }
      });
    } else if (geocoderRef.current) {
      // Fall back to geocoder if Places service not available
      geocoderRef.current.geocode({ address: searchAddress }, (results, status) => {
        if (status === 'OK' && results?.[0]?.geometry?.location) {
          const newPosition = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          setMarkerPosition(newPosition);
          setMapCenter(newPosition);
          onLocationSelect(newPosition);
        } else {
          alert('Could not find location for the search term provided.');
        }
      });
    }
  }, [searchAddress, onLocationSelect]);

  return (
    <div className="space-y-4">
      {/* Search address input and button */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          placeholder="Search for places (e.g., Hilton Hotel Colombo)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddressSearch();
            }
          }}
        />
        <button
          onClick={handleAddressSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Google Map */}
      <LoadScript 
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
        libraries={['places']}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={10}
          onClick={handleMapClick}
          onLoad={onMapLoad}
        >
          {/* Marker at selected position */}
          <Marker position={markerPosition} />
        </GoogleMap>
      </LoadScript>

      {/* Display selected coordinates */}
      <div className="text-sm text-gray-600">
        Selected location: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
      </div>
    </div>
  );
};

export default MapLocationPicker;
