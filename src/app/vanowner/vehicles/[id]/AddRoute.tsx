'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = { lat: 6.9271, lng: 79.8612 }; // default to Colombo

type Location = {
  lat: number;
  lng: number;
};

interface AddRouteProps {
  vehicleId?: number;
  onClose?: () => void;
  isLoaded: boolean;
}

const AddRoute = ({ vehicleId, onClose, isLoaded }: AddRouteProps) => {
  const [routeStart, setRouteStart] = useState<Location | null>(null);
  const [routeEnd, setRouteEnd] = useState<Location | null>(null);
  const [path, setPath] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Refs for input fields to set values programmatically
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
      async function fetchPath() {
        setLoading(true);
        try {
          const res = await fetch(`/api/vans/${vehicleId}/path`);
          if (res.ok) {
            const data = await res.json();
            if (data) {
              setPath(data);
              console.log('Fetched path data:', data);
              
              // Set route start and end points
              if (data.routeStart) {
                setRouteStart(data.routeStart);
                if (startInputRef.current) {
                  // You'll need to reverse geocode to get the address
                  reverseGeocode(data.routeStart, startInputRef);
                }
              }
              
              if (data.routeEnd) {
                setRouteEnd(data.routeEnd);
                if (endInputRef.current) {
                  // You'll need to reverse geocode to get the address
                  reverseGeocode(data.routeEnd, endInputRef);
                }
              }
              
              // Transform WayPoint data to match waypoint interface
              if (Array.isArray(data.WayPoint) && data.WayPoint.length > 0) {
                const transformedWaypoints = data.WayPoint.map(wp => ({
                  name: wp.name,
                  placeId: wp.placeId,
                  latitude: wp.latitude,
                  longitude: wp.longitude,
                  order: wp.order,
                  isStop: wp.isStop
                }));
                
                setWaypoints(transformedWaypoints);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching path:', error);
        } finally {
          setLoading(false);
        }
      }
      
      if (vehicleId) {
        fetchPath();
      }
    }, [vehicleId]);

  type Waypoint = {
    name: string;
    placeId: string;
    latitude: number;
    longitude: number;
    order: number;
    isStop: boolean;
  };
  
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [autocompleteStart, setAutocompleteStart] = useState<google.maps.places.Autocomplete | null>(null);
  const [autocompleteEnd, setAutocompleteEnd] = useState<google.maps.places.Autocomplete | null>(null);
  const [waypointInput, setWaypointInput] = useState('');
  const [autocompleteWaypoint, setAutocompleteWaypoint] = useState<google.maps.places.Autocomplete | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddWaypoint = () => {
    if (!autocompleteWaypoint) return;

    const place = autocompleteWaypoint.getPlace();
    if (!place.geometry || !place.geometry.location || !place.name || !place.place_id) {
      setError('Please select a valid location from the dropdown');
      return;
    }

    const newWaypoint: Waypoint = {
      name: place.name,
      placeId: place.place_id,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      order: waypoints.length + 1,
      isStop: true,
    };

    setWaypoints([...waypoints, newWaypoint]);
    setWaypointInput('');
    setError(null);
  };

  const removeWaypoint = (index: number) => {
    const updatedWaypoints = waypoints.filter((_, i) => i !== index);
    // Update order for remaining waypoints
    const reorderedWaypoints = updatedWaypoints.map((wp, i) => ({
      ...wp,
      order: i + 1
    }));
    setWaypoints(reorderedWaypoints);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!routeStart || !routeEnd) {
      setError('Start and End locations are required');
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare routeGeometry as array of coordinates for LineString
      const routeGeometry = [
        [routeStart.lng, routeStart.lat], // Start point
        ...waypoints.map(wp => [wp.longitude, wp.latitude]), // Waypoints
        [routeEnd.lng, routeEnd.lat] // End point
      ];

      const body = {
        routeStart: { lat: routeStart.lat, lng: routeStart.lng },
        routeEnd: { lat: routeEnd.lat, lng: routeEnd.lng },
        routeGeometry,
        waypoints: waypoints.map((wp, index) => ({
          ...wp,
          order: index + 1
        }))
      };

      const res = await fetch(`/api/vans/${vehicleId}/path`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert('Route created successfully!');
        // Reset form
        setRouteStart(null);
        setRouteEnd(null);
        setWaypoints([]);
        // Close the modal if onClose is provided
        if (onClose) {
          onClose();
        }
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to create route');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Error creating route:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add reverse geocoding function
const reverseGeocode = async (location: { lat: number, lng: number }, inputRef: React.RefObject<HTMLInputElement>) => {
  if (!window.google) return;
  
  const geocoder = new window.google.maps.Geocoder();
  try {
    const result = await geocoder.geocode({
      location: { lat: location.lat, lng: location.lng }
    });
    
    if (result.results[0] && inputRef.current) {
      inputRef.current.value = result.results[0].formatted_address;
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
  }
};

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add a New Route</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Location *
            </label>
            <Autocomplete
              onLoad={auto => setAutocompleteStart(auto)}
              onPlaceChanged={() => {
                if (!autocompleteStart) return;
                const place = autocompleteStart.getPlace();
                if (place.geometry && place.geometry.location) {
                  setRouteStart({ 
                    lat: place.geometry.location.lat(), 
                    lng: place.geometry.location.lng() 
                  });
                  setError(null);
                }
              }}
            >
              <input 
                type="text" 
                placeholder="Search start location" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                ref={startInputRef}
                defaultValue={
                  waypoints.length > 0
                    ? waypoints[0].name || ''
                    : ''
                }
              />
            </Autocomplete>
            {routeStart && (
              <p className="text-sm text-green-600 mt-1">
                Start location selected: {routeStart.lat.toFixed(5)}, {routeStart.lng.toFixed(5)}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Location *
            </label>
            <Autocomplete
              onLoad={auto => setAutocompleteEnd(auto)}
              onPlaceChanged={() => {
                if (!autocompleteEnd) return;
                const place = autocompleteEnd.getPlace();
                if (place.geometry && place.geometry.location) {
                  setRouteEnd({ 
                    lat: place.geometry.location.lat(), 
                    lng: place.geometry.location.lng() 
                  });
                  setError(null);
                }
              }}
            >
              <input 
                type="text" 
                placeholder="Search end location" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                ref={endInputRef}
                defaultValue={
                  waypoints.length > 0
                    ? waypoints[waypoints.length - 1].name || ''
                    : ''
                }
              />
            </Autocomplete>
            {routeEnd && (
              <p className="text-sm text-green-600 mt-1">
                End location selected: {routeEnd.lat.toFixed(5)}, {routeEnd.lng.toFixed(5)}
              </p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Waypoints (Optional)
          </label>
          <div className="flex gap-2">
            <Autocomplete
              onLoad={auto => setAutocompleteWaypoint(auto)}
              onPlaceChanged={() => {
                if (!autocompleteWaypoint) return;
                const place = autocompleteWaypoint.getPlace();
                if (place.geometry && place.name) {
                  setWaypointInput(place.name);
                  setError(null);
                }
              }}
            >
              <input
                type="text"
                value={waypointInput}
                onChange={(e) => setWaypointInput(e.target.value)}
                placeholder="Add waypoint"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Autocomplete>
            <button 
              type="button" 
              onClick={handleAddWaypoint}
              className="btn btn-secondary pt-2 pb-2"
            >
              Add Waypoint
            </button>
          </div>
          {waypoints.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Added Waypoints:</h4>
              <ul className="space-y-2">
                {waypoints.map((wp, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                    <div>
                      <span className="font-medium">{wp.order}. {wp.name}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({wp.latitude.toFixed(5)}, {wp.longitude.toFixed(5)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeWaypoint(idx)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting || !routeStart || !routeEnd}
          className=" focus:outline-none btn btn-primary mt-8 focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating Route...' : 'Create Route'}
        </button>
      </form>
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Route Preview</h3>
        <GoogleMap mapContainerStyle={containerStyle} center={routeStart || center} zoom={10}>
          {/* Always show start and end markers if available */}
          {routeStart && <Marker position={routeStart} label="S" title="Start Location" icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }} />}
          {routeEnd && <Marker position={routeEnd} label="E" title="End Location" icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' }} />}
          {/* Show all waypoints as numbered markers */}
          {waypoints.map((wp, idx) => (
            <Marker 
              key={idx} 
              position={{ lat: wp.latitude, lng: wp.longitude }} 
              label={`${wp.order}`}
              title={wp.name}
              icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};

export default AddRoute;

