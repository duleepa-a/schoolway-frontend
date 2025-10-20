'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { loadGoogleMapsAPI } from '@/lib/googleMapsLoader';

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
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  
  // Load Google Maps API
  useEffect(() => {
    const loadMaps = async () => {
      try {
        await loadGoogleMapsAPI();
        setIsGoogleMapsLoaded(true);
      } catch (error) {
        console.error('Failed to load Google Maps API:', error);
      }
    };
    
    loadMaps();
  }, []);
  
  // Initialize map and set up Autocomplete
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    // If the input reference exists, set up Autocomplete
    if (inputRef.current) {
      // Create autocomplete instead of SearchBox for better UX
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        fields: ['geometry', 'name', 'formatted_address'],
        // Optional: Restrict to country
        // componentRestrictions: { country: 'lk' } // Sri Lanka
      });
      autocompleteRef.current = autocomplete;
      
      // Bias the Autocomplete results towards current map's viewport
      map.addListener("bounds_changed", () => {
        if (autocompleteRef.current && mapRef.current) {
          autocompleteRef.current.setBounds(mapRef.current.getBounds() as google.maps.LatLngBounds);
        }
      });
      
      // Listen for the event fired when the user selects a prediction
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        
        if (!place || !place.geometry || !place.geometry.location) {
          console.log("No place selected or returned place contains no geometry");
          return;
        }
        
        // Clear out the old markers
        markersRef.current.forEach(marker => {
          marker.setMap(null);
        });
        markersRef.current = [];
        
        // Use default marker or custom icon
        const icon = {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };
        
        // Create a marker for the place
        const marker = new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        });
        
        markersRef.current.push(marker);
        const newPosition = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        
        // Set this as the selected position
        setMarkerPosition(newPosition);
        setMapCenter(newPosition);
        onLocationSelect(newPosition);
        
        // Adjust map view
        if (place.geometry.viewport) {
          // Only geocodes have viewport
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }
        
        // Update the input value if we have an address
        if (place.formatted_address) {
          inputRef.current!.value = place.formatted_address;
        }
      });
    }
  }, [onLocationSelect]);

  // Handle map click to place marker
  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      setMarkerPosition(newPosition);
      setMapCenter(newPosition);
      onLocationSelect(newPosition);
    }
  }, [onLocationSelect]);

  if (!isGoogleMapsLoaded) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Google Map */}
      <div className="relative">
        {/* Search box positioned above the map */}
        <input
          ref={inputRef}
          id="pac-input"
          type="text"
          placeholder="Search for locations or addresses"
          className="absolute z-10 px-3 py-2 border border-gray-300 rounded-md shadow-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{
            top: "10px",
            left: "10px",
            width: "calc(100% - 100px)",
            maxWidth: "400px",
            backgroundColor: "white"
          }}
        />
        
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={10}
          onClick={handleMapClick}
          onLoad={onMapLoad}
          mapTypeId="roadmap"
        >
          {/* Main selected marker */}
          <Marker position={markerPosition} />
        </GoogleMap>
      </div>

      {/* Display selected coordinates */}
      <div className="text-sm text-gray-600">
        Selected location: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
      </div>
    </div>
  );
};

export default MapLocationPicker;
