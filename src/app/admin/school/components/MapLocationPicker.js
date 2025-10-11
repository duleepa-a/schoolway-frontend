import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Search, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { loadGoogleMapsAPI } from '@/lib/googleMapsLoader';

const MapLocationPicker = ({
                               onLocationSelect,
                               initialLocation = { lat: 7.8731, lng: 80.7718 },
                               height = "400px",
                               showSearch = true,
                               searchPlaceholder = "Search for schools, places..."
                           }) => {
    const mapRef = useRef(null);
    const searchContainerRef = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState({});

    // Simple and reliable Google Maps Places API implementation
    const getPlacePredictions = (input, location) => {
        return new Promise((resolve, reject) => {
            if (!window.google || !window.google.maps || !window.google.maps.places) {
                reject(new Error('Google Maps API not loaded'));
                return;
            }

            try {
                // Use the standard AutocompleteService (it still works despite the warning)
                const autocompleteService = new window.google.maps.places.AutocompleteService();
                
                const request = {
                    input: input,
                    componentRestrictions: { country: 'lk' } // Restrict to Sri Lanka
                };

                // Add location bias if available
                if (location) {
                    request.location = new window.google.maps.LatLng(location.lat, location.lng);
                    request.radius = 50000; // 50km radius
                }

                autocompleteService.getPlacePredictions(request, (predictions, status) => {
                    console.log('AutocompleteService response:', { status, predictionsCount: predictions?.length || 0 });
                    
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                        resolve(predictions);
                    } else {
                        console.warn('Places API status:', status);
                        resolve([]);
                    }
                });
            } catch (error) {
                console.error('Error in getPlacePredictions:', error);
                reject(error);
            }
        });
    };

    const getPlaceDetails = (placeId) => {
        return new Promise((resolve, reject) => {
            if (!window.google || !window.google.maps) {
                reject(new Error('Google Maps API not loaded'));
                return;
            }

            const geocoder = new window.google.maps.Geocoder();
            
            geocoder.geocode({ placeId: placeId }, (results, status) => {
                if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
                    const result = results[0];
                    resolve({
                        place_id: placeId,
                        formatted_address: result.formatted_address,
                        name: result.name,
                        geometry: {
                            location: {
                                lat: result.geometry.location.lat(),
                                lng: result.geometry.location.lng()
                            }
                        }
                    });
                } else {
                    reject(new Error(`Geocoder failed: ${status}`));
                }
            });
        });
    };

    // Fallback search using Geocoder API
    const searchWithGeocoder = (input) => {
        return new Promise((resolve, reject) => {
            if (!window.google || !window.google.maps) {
                reject(new Error('Google Maps API not loaded'));
                return;
            }

            const geocoder = new window.google.maps.Geocoder();
            
            geocoder.geocode({ 
                address: input + ', Sri Lanka',
                componentRestrictions: { country: 'LK' }
            }, (results, status) => {
                if (status === window.google.maps.GeocoderStatus.OK && results) {
                    const suggestions = results.slice(0, 5).map((result, index) => ({
                        place_id: result.place_id || `geocoder_${index}`,
                        description: result.formatted_address,
                        structured_formatting: {
                            main_text: result.formatted_address.split(',')[0],
                            secondary_text: result.formatted_address.split(',').slice(1).join(',').trim()
                        }
                    }));
                    resolve(suggestions);
                } else {
                    console.warn('Geocoder search failed:', status);
                    resolve([]);
                }
            });
        });
    };

    // Simple search component that uses Google Maps built-in search
    const CustomPlaceSearch = ({ onPlaceSelect }) => {
        const [isGoogleMapsReady, setIsGoogleMapsReady] = useState(false);
        const searchInputRef = useRef(null);

        useEffect(() => {
            // Check if Google Maps is ready
            const checkGoogleMaps = async () => {
                try {
                    await loadGoogleMaps();
                    if (window.google && window.google.maps && window.google.maps.places) {
                        setIsGoogleMapsReady(true);
                        console.log('Google Maps Places API is ready');
                        
                        // Initialize the search input with Google Maps Autocomplete
                        if (searchInputRef.current) {
                            const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
                                componentRestrictions: { country: 'lk' },
                                fields: ['place_id', 'formatted_address', 'name', 'geometry'],
                                types: ['establishment', 'geocode']
                            });

                            autocomplete.addListener('place_changed', () => {
                                const place = autocomplete.getPlace();
                                console.log('Place selected:', place);
                                
                                if (place.geometry && place.geometry.location) {
                                    const location = {
                                        lat: place.geometry.location.lat(),
                                        lng: place.geometry.location.lng(),
                                        placeName: place.name || place.formatted_address,
                                        address: place.formatted_address
                                    };
                                    console.log('Selected location:', location);
                                    onPlaceSelect(location);
                                }
                            });
                        }
                    }
                } catch (error) {
                    console.error('Failed to load Google Maps:', error);
                }
            };
            
            checkGoogleMaps();
        }, [onPlaceSelect]);

        return (
            <div className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder={isGoogleMapsReady ? searchPlaceholder : "Loading Google Maps..."}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading || !!error || !isGoogleMapsReady}
                    />
                </div>
            </div>
        );
    };

    // Debug environment variables and setup
    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        const debug = {
            hasApiKey: !!apiKey,
            apiKeyLength: apiKey?.length || 0,
            apiKeyStart: apiKey ? apiKey.substring(0, 8) + '...' : 'Not found',
            environment: process.env.NODE_ENV,
            windowGoogle: typeof window !== 'undefined' ? !!window.google : false
        };

        setDebugInfo(debug);
        console.log('Google Maps Debug Info:', debug);

        if (!apiKey) {
            setError('Google Maps API key is missing. Please check your .env.local file.');
            setIsLoading(false);
        }
    }, []);

    // Load Google Maps API using global loader to prevent duplicate loading
    const loadGoogleMaps = useCallback(async () => {
        try {
            await loadGoogleMapsAPI();
            return window.google;
        } catch (error) {
            throw new Error(`Failed to load Google Maps API: ${error.message}`);
        }
    }, []);

    // Initialize map with AdvancedMarkerElement
    const initializeMap = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            console.log('Initializing Google Maps...');
            const google = await loadGoogleMaps();

            if (!mapRef.current) {
                throw new Error('Map container ref is not available');
            }

            console.log('Creating map instance...');
            const mapInstance = new google.maps.Map(mapRef.current, {
                center: initialLocation,
                zoom: 15,
                mapId: 'DEMO_MAP_ID', // Required for AdvancedMarkerElement
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true,
                zoomControl: true
            });

            // Wait for the marker library to be available
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

            console.log('Creating advanced marker...');
            const markerInstance = new AdvancedMarkerElement({
                map: mapInstance,
                position: initialLocation,
                title: 'Selected Location'
            });

            // Handle marker drag (AdvancedMarkerElement uses different event handling)
            markerInstance.addListener('dragend', () => {
                const position = markerInstance.position;
                const newLocation = {
                    lat: position.lat,
                    lng: position.lng
                };
                console.log('Marker dragged to:', newLocation);
                setSelectedLocation(newLocation);
                onLocationSelect(newLocation);
            });

            // Enable dragging
            markerInstance.gmpDraggable = true;

            // Handle map click
            mapInstance.addListener('click', (event) => {
                const newLocation = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                };
                console.log('Map clicked at:', newLocation);
                markerInstance.position = newLocation;
                setSelectedLocation(newLocation);
                onLocationSelect(newLocation);
            });

            setMap(mapInstance);
            setMarker(markerInstance);

            console.log('Google Maps initialized successfully with AdvancedMarkerElement');
            setError(null);

        } catch (err) {
            console.error('Google Maps initialization error:', err);

            let errorMessage = 'Failed to load Google Maps. ';

            if (err.message.includes('API key')) {
                errorMessage += 'Please check your API key configuration.';
            } else if (err.message.includes('billing')) {
                errorMessage += 'Please set up billing in Google Cloud Console.';
            } else if (err.message.includes('RefererNotAllowed')) {
                errorMessage += 'API key restrictions are too strict for this domain.';
            } else {
                errorMessage += err.message;
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [initialLocation, onLocationSelect, loadGoogleMaps]);

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
            initializeMap();
        }
    }, [initializeMap]);

    // Update map when initialLocation changes
    useEffect(() => {
        if (map && marker && initialLocation) {
            console.log('Updating map location to:', initialLocation);
            map.setCenter(initialLocation);
            marker.position = initialLocation;
            setSelectedLocation(initialLocation);
        }
    }, [initialLocation, map, marker]);

    const handleRetry = () => {
        setError(null);
        initializeMap();
    };

    const handlePlaceSelect = (place) => {
        if (map && marker) {
            const newLocation = { lat: place.lat, lng: place.lng };
            map.setCenter(newLocation);
            map.setZoom(17);
            marker.position = newLocation;
            setSelectedLocation(newLocation);
            onLocationSelect({
                ...newLocation,
                placeName: place.placeName,
                address: place.address
            });
        }
    };

    // Error display with debugging info
    if (error) {
        return (
            <div className="border border-red-300 rounded-lg bg-red-50 p-4">
                <div className="flex items-start">
                    <AlertCircle className="text-red-600 mr-3 mt-1" size={20} />
                    <div className="flex-grow">
                        <div className="font-semibold text-red-800 mb-2">Map Loading Error</div>
                        <div className="text-sm text-red-700 mb-4">{error}</div>

                        {/* Debug information */}
                        <details className="text-xs text-red-600 mb-4">
                            <summary className="cursor-pointer font-medium">Debug Information (Click to expand)</summary>
                            <div className="mt-2 bg-red-100 p-2 rounded font-mono">
                                <div>API Key Present: {debugInfo.hasApiKey ? 'Yes' : 'No'}</div>
                                <div>API Key Length: {debugInfo.apiKeyLength}</div>
                                <div>API Key Start: {debugInfo.apiKeyStart}</div>
                                <div>Environment: {debugInfo.environment}</div>
                                <div>Window Google: {debugInfo.windowGoogle ? 'Available' : 'Not Available'}</div>
                            </div>
                        </details>

                        <button
                            onClick={handleRetry}
                            className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                        >
                            <RefreshCw size={16} className="mr-2" />
                            Retry Loading
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {showSearch && (
                <div className="mb-3">
                    <CustomPlaceSearch onPlaceSelect={handlePlaceSelect} />
                </div>
            )}

            <div className="relative">
                <div
                    ref={mapRef}
                    style={{ height }}
                    className="w-full rounded-md border border-gray-300"
                />

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-md">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                            <div className="mt-2 text-sm text-gray-600">Loading Google Maps...</div>
                            <div className="text-xs text-gray-500 mt-1">This may take a moment</div>
                        </div>
                    </div>
                )}

                {/* Coordinates display */}
                {!isLoading && !error && (
                    <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs flex items-center shadow-sm">
                        <MapPin size={12} className="mr-1 text-gray-500" />
                        <span className="text-gray-700 font-mono">
                            {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                        </span>
                    </div>
                )}
            </div>

            {!error && (
                <div className="mt-2 text-xs text-gray-500">
                    💡 Click on the map or drag the marker to set location. {showSearch && 'Use search to find specific places.'}
                </div>
            )}
        </div>
    );
};

export default MapLocationPicker;