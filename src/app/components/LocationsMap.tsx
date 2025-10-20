'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import { loadGoogleMapsAPI } from '@/lib/googleMapsLoader';

// Define the container style
const containerStyle = {
  width: '100%',
  height: '300px'
};

// Sri Lanka center coordinates
const defaultCenter = {
  lat: 7.8731,
  lng: 80.7718
};

// Popular Sri Lanka cities for fallback
const sriLankaCities = [
  { name: 'Colombo', lat: 6.9271, lng: 79.8612 },
  { name: 'Kandy', lat: 7.2906, lng: 80.6337 },
  { name: 'Galle', lat: 6.0535, lng: 80.2210 },
  { name: 'Jaffna', lat: 9.6615, lng: 80.0255 },
  { name: 'Negombo', lat: 7.2095, lng: 79.8416 }
];

// Well-known schools in Sri Lanka with their coordinates
const knownSchools: Record<string, google.maps.LatLngLiteral> = {
  // Colombo
  'Nalanda College': { lat: 6.921657, lng: 79.880134 },
  'Royal College': { lat: 6.909736, lng: 79.863019 },
  'Ananda College': { lat: 6.928822, lng: 79.868544 },
  'Visakha Vidyalaya': { lat: 6.906702, lng: 79.865652 },
  'Devi Balika Vidyalaya': { lat: 6.885971, lng: 79.878095 },
  'D.S. Senanayake College': { lat: 6.904911, lng: 79.874246 },
  'St. Joseph\'s College': { lat: 6.932337, lng: 79.867180 },
  'St. Bridget\'s Convent': { lat: 6.908669, lng: 79.865293 },
  'St. Thomas\' College': { lat: 6.938801, lng: 79.865104 },
  'Ladies College': { lat: 6.912454, lng: 79.862659 },
  // Kandy
  'Trinity College': { lat: 7.291660, lng: 80.635520 },
  'Mahamaya Girls\' College': { lat: 7.289639, lng: 80.635246 },
  // Galle
  'Richmond College': { lat: 6.058696, lng: 80.215738 },
  'Southlands College': { lat: 6.034101, lng: 80.216821 },
  // Jaffna
  'Jaffna Central College': { lat: 9.667207, lng: 80.011787 },
  'Jaffna Hindu College': { lat: 9.672767, lng: 80.023394 }
};

interface LocationsMapProps {
  pickupLocation?: string;
  schoolLocation?: string;
}

// Function to manually parse Plus Codes (enhanced approach)
const parsePlusCode = (plusCode: string): google.maps.LatLngLiteral | null => {
  // Hardcoded coordinates for common plus codes in Sri Lanka
  const knownPlusCodes: Record<string, google.maps.LatLngLiteral> = {
    'MWFJ+7X4': { lat: 6.586039, lng: 79.973867 }, // MWFJ+7X4, Wadduwa
    'MWFJ+7X': { lat: 6.586039, lng: 79.973867 },  // Shorter version
    'MWHG+W4': { lat: 6.603991, lng: 79.953545 },  // Near Kalutara
    '7GCJ+MM': { lat: 6.913889, lng: 79.864444 },  // Colombo central
    '6GXR+9F': { lat: 6.872982, lng: 79.862542 },  // Mount Lavinia area
    'WPCQ+9C': { lat: 7.290278, lng: 80.633333 },  // Kandy area
    
    // Add more plus codes that are causing issues
    'MWFJ+7X4, Weragama Rd': { lat: 6.586039, lng: 79.973867 }, // Wadduwa with road
    'MWFJ+7X4, Weragama Rd, Wadduwa': { lat: 6.586039, lng: 79.973867 }, // Full address
    'MWFJ+7X4, Wadduwa': { lat: 6.586039, lng: 79.973867 }, // Simplified version
    'MWFJ': { lat: 6.586039, lng: 79.973867 }, // Just the area code
  };
  
  // Check if we know this plus code
  const plusCodeKey = plusCode.split(',')[0].trim();
  if (knownPlusCodes[plusCodeKey]) {
    console.log(`Found hardcoded coordinates for plus code ${plusCodeKey}`, knownPlusCodes[plusCodeKey]);
    return knownPlusCodes[plusCodeKey];
  }
  
  // If it's not in our database but it matches the pattern, make a best guess by
  // looking at the first four characters (which indicate the area in Sri Lanka)
  const plusCodePattern = /^([A-Z0-9]{4})\+/;
  const match = plusCodeKey.match(plusCodePattern);
  if (match) {
    const areaCode = match[1];
    // Look for similar codes we know
    for (const [knownCode, coords] of Object.entries(knownPlusCodes)) {
      if (knownCode.startsWith(areaCode)) {
        console.log(`Using coordinates from similar plus code area ${areaCode}`, coords);
        return coords;
      }
    }
  }
  
  return null;
};

const LocationsMap: React.FC<LocationsMapProps> = ({ 
  pickupLocation, 
  schoolLocation 
}) => {
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [pickupCoords, setPickupCoords] = useState<google.maps.LatLngLiteral | null>(null);
  const [schoolCoords, setSchoolCoords] = useState<google.maps.LatLngLiteral | null>(null);
  const [mapCenter] = useState(defaultCenter);
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(null);
  const [showCityMarkers, setShowCityMarkers] = useState(false);
  const [routeDistance, setRouteDistance] = useState<string | null>(null);
  
  // Function to directly handle Plus Codes
  const tryDirectPlusCode = async (plusCode: string): Promise<google.maps.LatLngLiteral> => {
    console.log("Processing plus code:", plusCode);
    
    // First try our manual mapping
    const manualCoords = parsePlusCode(plusCode);
    if (manualCoords) {
      console.log("Found manual coordinates for plus code:", plusCode, manualCoords);
      return manualCoords;
    }
    
    // Try appending "Sri Lanka" to the plus code
    const enhancedPlusCode = `${plusCode}, Sri Lanka`;
    console.log("Enhanced plus code with country:", enhancedPlusCode);
    
    // Check if the Places API is available
    console.log("Checking Google Places API availability:", {
      googleAvailable: typeof window.google !== 'undefined',
      mapsAvailable: typeof window.google?.maps !== 'undefined',
      placesAvailable: typeof window.google?.maps?.places !== 'undefined',
      placesServiceAvailable: typeof window.google?.maps?.places?.PlacesService !== 'undefined'
    });
    
    // Otherwise use the Plus Code library if available
    if (window.google?.maps?.places?.PlacesService) {
      return new Promise((resolve, reject) => {
        // Create a dummy element for the PlacesService
        const dummyElement = document.createElement('div');
        const service = new google.maps.places.PlacesService(dummyElement);
        
        console.log("Sending Places API request for plus code:", enhancedPlusCode);
        
        service.findPlaceFromQuery({
          query: enhancedPlusCode,
          fields: ['geometry', 'name']
        }, (results, status) => {
          console.log("Places API response:", {
            status,
            resultsCount: results?.length || 0,
            results: results ? results.map(r => ({
              name: r.name,
              hasGeometry: !!r.geometry,
              location: r.geometry?.location ? 
                { lat: r.geometry.location.lat(), lng: r.geometry.location.lng() } : 'No location'
            })) : 'No results'
          });
          
          if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]?.geometry?.location) {
            const location = results[0].geometry.location;
            const coords = { lat: location.lat(), lng: location.lng() };
            console.log("Successfully found coordinates via Places API:", coords);
            resolve(coords);
          } else {
            console.error("Places API lookup failed:", {
              status,
              plusCode,
              enhancedPlusCode
            });
            reject(new Error(`Plus code lookup failed: ${status}`));
          }
        });
      });
    } else {
      // If Places API not available, throw error
      console.error("Google Places API not available for Plus Code lookup");
      throw new Error('Google Places API not available for Plus Code lookup');
    }
  };
  
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

  // Fallback straight-line distance calculation
  const calculateStraightLineDistance = useCallback(() => {
    if (!pickupCoords || !schoolCoords) return;
    
    const R = 6371; // Earth's radius in km
    const dLat = (schoolCoords.lat - pickupCoords.lat) * Math.PI / 180;
    const dLon = (schoolCoords.lng - pickupCoords.lng) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pickupCoords.lat * Math.PI / 180) * Math.cos(schoolCoords.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Use a function updater to avoid potential dependency on previous state
    setRouteDistance(() => `${distance.toFixed(1)} km (straight line)`);
  }, [pickupCoords, schoolCoords]);

  // Calculate distance between two points
  const calculateDistance = useCallback(() => {
    if (!pickupCoords || !schoolCoords || !isGoogleMapsLoaded) return;
    
    // Create local copies to avoid closures referencing changing state
    const pickupCoordsRef = { ...pickupCoords };
    const schoolCoordsRef = { ...schoolCoords };
    
    console.log("Calculating distance between:", pickupCoordsRef, schoolCoordsRef);
    
    // Use the Distance Matrix Service to calculate the driving distance
    const distanceMatrixService = new google.maps.DistanceMatrixService();
    distanceMatrixService.getDistanceMatrix(
      {
        origins: [pickupCoordsRef],
        destinations: [schoolCoordsRef],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status === google.maps.DistanceMatrixStatus.OK && response) {
          const distanceResult = response.rows[0]?.elements[0];
          if (distanceResult?.status === 'OK') {
            const distance = distanceResult.distance.text;
            const duration = distanceResult.duration.text;
            // Use function updater to avoid dependency on previous state
            setRouteDistance(() => `${distance} (about ${duration} driving)`);
          } else {
            // Fallback to straight-line distance calculation
            calculateStraightLineDistance();
          }
        } else {
          // Fallback to straight-line distance calculation
          calculateStraightLineDistance();
        }
      }
    );
  }, [pickupCoords, schoolCoords, isGoogleMapsLoaded, calculateStraightLineDistance]);

  // Use refs to track what we've already geocoded to prevent infinite loops
  const processedPickupRef = React.useRef<string | null>(null);
  const processedSchoolRef = React.useRef<string | null>(null);
  const geocodeInProgressRef = React.useRef<boolean>(false);
  
  // Geocode addresses to get coordinates
  useEffect(() => {
    if (!isGoogleMapsLoaded) return;
    
    // Prevent running multiple geocodes at once
    if (geocodeInProgressRef.current) {
      console.log("Geocoding already in progress, skipping...");
      return;
    }

    // Skip if we've already processed these exact addresses to avoid loops
    if (pickupLocation === processedPickupRef.current && 
        schoolLocation === processedSchoolRef.current) {
      console.log("Addresses haven't changed, skipping geocoding");
      return;
    }
    
    // Set flag to indicate geocoding is starting
    geocodeInProgressRef.current = true;
    
    // Update refs with current addresses
    processedPickupRef.current = pickupLocation || null;
    processedSchoolRef.current = schoolLocation || null;
    
    // Reset coordinates only when addresses change
    setPickupCoords(null);
    setSchoolCoords(null);
    setRouteDistance(null);
    
    console.log("Starting fresh geocoding for new addresses");
    const geocoder = new google.maps.Geocoder();
    const bounds = new google.maps.LatLngBounds();
    let locationsFound = 0;
    
    // Function to handle geocoding with fallback
    const geocodeAddress = async (address: string, isPickup: boolean) => {
      if (!address) return;
      
      console.log(`Geocoding ${isPickup ? 'pickup' : 'school'} address:`, address);
      
      try {
        // Enhanced debugging for address format
        console.log(`Analyzing address format for ${isPickup ? 'pickup' : 'school'}:`, {
          original: address,
          parts: address.split(',').map(part => part.trim()),
          firstPart: address.split(',')[0].trim()
        });
        
        // Check if address is a Plus Code (like MWFJ+7X4)
        const isPlusCode = /^[A-Z0-9]+\+[A-Z0-9]+/.test(address.split(',')[0].trim());
        
        // Handle Plus Code differently
        if (isPlusCode && isPickup) {
          try {
            // Extract the plus code part
            const plusCodePart = address.split(',')[0].trim();
            console.log("Detected Plus Code:", plusCodePart);
            
            // Try direct geocoding with the plus code
            console.log("Attempting to geocode plus code directly:", plusCodePart);
            const coords = await tryDirectPlusCode(plusCodePart);
            
            if (coords) {
              console.log("Successfully geocoded plus code:", plusCodePart, coords);
              setPickupCoords(coords);
              bounds.extend(new google.maps.LatLng(coords.lat, coords.lng));
              locationsFound++;
              
              if (locationsFound > 0) {
                setMapBounds(bounds);
              }
              return;
            }
          } catch (plusCodeError) {
            console.warn("Failed to geocode plus code directly, falling back to regular geocoding", {
              plusCode: address.split(',')[0].trim(),
              error: plusCodeError
            });
            // Will continue to standard geocoding below
          }
        }
        
        // Check if this is a school address and matches a known school
        if (!isPickup) {
          for (const [schoolName, coordinates] of Object.entries(knownSchools)) {
            if (address.toLowerCase().includes(schoolName.toLowerCase())) {
              console.log('Found known school:', schoolName);
              setSchoolCoords(coordinates);
              bounds.extend(new google.maps.LatLng(coordinates.lat, coordinates.lng));
              locationsFound++;
              
              if (locationsFound > 0) {
                setMapBounds(bounds);
              }
              return;
            }
          }
        }
        
        // For school names, append "School" or "College" if not already included
        let enhancedAddress = address;
        if (!isPickup && 
            !address.toLowerCase().includes('school') && 
            !address.toLowerCase().includes('college') &&
            address.includes('College')) {
          enhancedAddress = `${address}, School`;
          console.log("Enhanced school name for geocoding:", enhancedAddress);
        }
        
        // Add Sri Lanka as a region bias if not already included
        const addressWithRegion = enhancedAddress.toLowerCase().includes('sri lanka') ? 
          enhancedAddress : `${enhancedAddress}, Sri Lanka`;
          
        // Use promises for cleaner async handling
        const geocodePromise = new Promise<google.maps.LatLngLiteral>((resolve, reject) => {
          geocoder.geocode({ 
            address: addressWithRegion,
            region: 'lk' // Sri Lanka country code
          }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
              const location = results[0].geometry.location;
              resolve({ lat: location.lat(), lng: location.lng() });
            } else {
              console.warn(`Geocoding failed for ${addressWithRegion} with status:`, status);
              reject(new Error(`Geocoding failed: ${status}`));
            }
          });
        });
        
        try {
          const coords = await geocodePromise;
          console.log(`Found coordinates for ${isPickup ? 'pickup' : 'school'}:`, coords);
          
          if (isPickup) {
            setPickupCoords(coords);
          } else {
            setSchoolCoords(coords);
          }
          
          bounds.extend(new google.maps.LatLng(coords.lat, coords.lng));
          locationsFound++;
          
          if (locationsFound > 0) {
            console.log("Setting map bounds with", locationsFound, "locations");
            setMapBounds(bounds);
          }
        } catch (geocodeError) {
          console.error(`Error in geocoding ${isPickup ? 'pickup' : 'school'}:`, geocodeError);
          
          // Try fallback for cities in address
          for (const city of sriLankaCities) {
            if (addressWithRegion.toLowerCase().includes(city.name.toLowerCase())) {
              console.log(`Using city coordinates for ${city.name}:`, city);
              const cityCoords = { lat: city.lat, lng: city.lng };
              
              if (isPickup) {
                setPickupCoords(cityCoords);
              } else {
                setSchoolCoords(cityCoords);
              }
              
              bounds.extend(new google.maps.LatLng(cityCoords.lat, cityCoords.lng));
              locationsFound++;
              
              if (locationsFound > 0) {
                setMapBounds(bounds);
              }
              return;
            }
          }
          
          // If all fails, use default center for Sri Lanka
          if (!pickupCoords && !schoolCoords) {
            if (isPickup) {
              setPickupCoords(defaultCenter);
            } else {
              setSchoolCoords(defaultCenter);
            }
            bounds.extend(new google.maps.LatLng(defaultCenter.lat, defaultCenter.lng));
            setMapBounds(bounds);
          }
        }
      } catch (error) {
        console.error(`Error geocoding ${isPickup ? 'pickup' : 'school'} address:`, error);
        
        // If both geocoding attempts fail, use default Sri Lanka center
        if (!pickupCoords && !schoolCoords) {
          if (isPickup) {
            setPickupCoords(defaultCenter);
          } else {
            setSchoolCoords(defaultCenter);
          }
          bounds.extend(new google.maps.LatLng(defaultCenter.lat, defaultCenter.lng));
          setMapBounds(bounds);
        }
      }
    };

    // Reset previous coords
    setPickupCoords(null);
    setSchoolCoords(null);
    setRouteDistance(null);
    
    // Define a function to handle geocoding completion
    const completeGeocoding = () => {
      // Reset the in-progress flag
      console.log("Geocoding completed");
      geocodeInProgressRef.current = false;
    };
    
    // Wrap geocoding operations in async function to properly handle completion
    const runGeocoding = async () => {
      try {
        const tasks = [];
        
        // Geocode both addresses
        if (pickupLocation) {
          tasks.push(geocodeAddress(pickupLocation, true));
        }
        
        if (schoolLocation) {
          tasks.push(geocodeAddress(schoolLocation, false));
        }
        
        // If no addresses provided at all, use default center
        if (!pickupLocation && !schoolLocation) {
          setPickupCoords(defaultCenter);
          bounds.extend(new google.maps.LatLng(defaultCenter.lat, defaultCenter.lng));
          setMapBounds(bounds);
          setShowCityMarkers(true);
        } else {
          setShowCityMarkers(false);
        }
        
        // Wait for all geocoding tasks to complete
        await Promise.all(tasks);
      } catch (error) {
        console.error("Error during geocoding:", error);
      } finally {
        completeGeocoding();
      }
    };
    
    // Start the geocoding process
    runGeocoding();
    
    // Cleanup function
    return () => {
      // Make sure we reset the flag if component unmounts during geocoding
      geocodeInProgressRef.current = false;
    };
    
  // Only depend on things that should actually trigger a re-geocode
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGoogleMapsLoaded, pickupLocation, schoolLocation]);

  // Use refs to track coordinates and avoid unnecessary recalculations
  const lastCalculatedPickupRef = React.useRef<google.maps.LatLngLiteral | null>(null);
  const lastCalculatedSchoolRef = React.useRef<google.maps.LatLngLiteral | null>(null);
  
  // Call calculate distance when coordinates are available
  useEffect(() => {
    // Skip if maps not loaded or missing coordinates
    if (!isGoogleMapsLoaded || !pickupCoords || !schoolCoords) return;
    
    // Skip if we've already calculated for these exact coordinates
    if (
      lastCalculatedPickupRef.current && 
      lastCalculatedSchoolRef.current && 
      lastCalculatedPickupRef.current.lat === pickupCoords.lat &&
      lastCalculatedPickupRef.current.lng === pickupCoords.lng &&
      lastCalculatedSchoolRef.current.lat === schoolCoords.lat &&
      lastCalculatedSchoolRef.current.lng === schoolCoords.lng
    ) {
      console.log("Distance already calculated for these coordinates, skipping");
      return;
    }
    
    // Store current coordinates in ref
    lastCalculatedPickupRef.current = { ...pickupCoords };
    lastCalculatedSchoolRef.current = { ...schoolCoords };
    
    // Now calculate the distance
    console.log("Calculating distance for new coordinates");
    calculateDistance();
    
  }, [isGoogleMapsLoaded, calculateDistance, pickupCoords, schoolCoords]);

  // Adjust map to fit all markers
  const onMapLoad = useCallback((map: google.maps.Map) => {
    if (mapBounds && !mapBounds.isEmpty()) {
      map.fitBounds(mapBounds);
      map.panToBounds(mapBounds);
      
      // Add some padding
      google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        const zoom = map.getZoom();
        if (zoom !== undefined && zoom > 15) {
          map.setZoom(15);
        }
      });
    }
  }, [mapBounds]);

  if (!isGoogleMapsLoaded) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }
  
  // If no coordinates but addresses were provided, show loading state
  if (!pickupCoords && !schoolCoords && (pickupLocation || schoolLocation)) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Locating addresses...</p>
        </div>
      </div>
    );
  }
  
  // If no addresses provided at all, show empty state
  if (!pickupCoords && !schoolCoords && !pickupLocation && !schoolLocation) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 mb-2">No location data available</p>
        <p className="text-xs text-gray-400 text-center max-w-xs">
          Neither pickup location nor school information is available for this student request.
        </p>
      </div>
    );
  }
  
  // If we have addresses but couldn't geocode them
  if (!pickupCoords && !schoolCoords && (pickupLocation || schoolLocation)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400 mb-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p className="text-gray-700 font-medium mb-1">Could not display map</p>
        <p className="text-xs text-gray-500 text-center max-w-xs px-4">
          We couldn&apos;t locate {!pickupCoords && pickupLocation ? 'the pickup address' : ''} 
          {!pickupCoords && pickupLocation && !schoolCoords && schoolLocation ? ' and ' : ''}
          {!schoolCoords && schoolLocation ? 'the school location' : ''} 
          on the map.
        </p>
        
        <div className="mt-3 text-xs text-left px-4 w-full">
          {pickupLocation && (
            <p className="mb-1">
              <span className="font-semibold">Pickup:</span> {pickupLocation}
            </p>
          )}
          {schoolLocation && (
            <p>
              <span className="font-semibold">School:</span> {schoolLocation}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      {/* Add distance information if available */}
      {routeDistance && (
        <div className="bg-blue-50 px-3 py-1 text-sm text-blue-700 border-b border-blue-100 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          Distance: {routeDistance}
        </div>
      )}
      
      {/* Add helper text for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 px-3 py-1 text-xs text-gray-600">
          {pickupCoords && `Pickup: ${pickupCoords.lat.toFixed(4)}, ${pickupCoords.lng.toFixed(4)}`}
          {pickupCoords && schoolCoords && ' | '}
          {schoolCoords && `School: ${schoolCoords.lat.toFixed(4)}, ${schoolCoords.lng.toFixed(4)}`}
        </div>
      )}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={10}
        onLoad={onMapLoad}
        mapTypeId="roadmap"
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {pickupCoords && (
          <Marker 
            position={pickupCoords} 
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              labelOrigin: new google.maps.Point(16, -10)
            }}
            label={{
              text: "Pickup",
              color: "#1F2937",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          />
        )}
        
        {schoolCoords && (
          <Marker 
            position={schoolCoords} 
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              labelOrigin: new google.maps.Point(16, -10)
            }}
            label={{
              text: "School",
              color: "#1F2937",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          />
        )}
        
        {/* Draw a line between pickup and school locations */}
        {pickupCoords && schoolCoords && (
          <Polyline
            path={[pickupCoords, schoolCoords]}
            options={{
              strokeColor: '#3B82F6',
              strokeOpacity: 0.8,
              strokeWeight: 3,
            }}
          />
        )}
        
        {/* Show the main Sri Lanka cities as reference points if requested */}
        {showCityMarkers && sriLankaCities.map((city) => (
          <Marker 
            key={city.name}
            position={{ lat: city.lat, lng: city.lng }}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
              scaledSize: new google.maps.Size(12, 12),
            }}
            title={city.name}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default LocationsMap;
