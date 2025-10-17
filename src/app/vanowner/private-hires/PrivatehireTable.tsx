import React, { useEffect, useState } from 'react';
import { FaEllipsisV, FaChevronDown } from 'react-icons/fa';
import { GoogleMap, Marker, DirectionsService, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

function RouteMap({ pickup, destination }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  console.log('[RouteMap] Google Maps API Key (first 5 chars):', apiKey.slice(0, 5), '...');

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ['geometry']
  });

  const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px'
  };

  if (
    !pickup || !destination ||
    typeof pickup.lat !== 'number' || typeof pickup.lng !== 'number' ||
    typeof destination.lat !== 'number' || typeof destination.lng !== 'number'
  ) {
    console.warn('[RouteMap] Invalid coordinates:', { pickup, destination });
    return <div className="text-red-500 p-4">Invalid coordinates</div>;
  }

  const center = {
    lat: (pickup.lat + destination.lat) / 2,
    lng: (pickup.lng + destination.lng) / 2
  };

  const [directions, setDirections] = useState(null);

  useEffect(() => {
    setDirections(null);
    console.log('[RouteMap] Reset directions for new pickup/destination.');
  }, [pickup, destination]);

  if (loadError) {
    console.error('[RouteMap] Error loading Google Maps:', loadError);
    return <div className="text-red-500 p-4">Error loading map</div>;
  }

  if (!isLoaded) {
    console.log('[RouteMap] Map still loading...');
    return <div className="p-4">Loading map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      options={{
        mapTypeId: 'roadmap',
        streetViewControl: false,
        mapTypeControl: false
      }}
    >
      <Marker
        position={pickup}
        label="A"
        icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }}
      />
      <Marker
        position={destination}
        label="B"
        icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' }}
      />
      {!directions && (
        <DirectionsService
          options={{
            origin: pickup,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
          }}
          callback={(result, status) => {
            console.log('[DirectionsService] Result:', result);
            console.log('[DirectionsService] Status:', status);
            if (result && status === 'OK') {
              setDirections(result);
            } else {
              console.error('[DirectionsService] Failed:', status, result);
            }
          }}
        />
      )}
      {directions && (
        <DirectionsRenderer
          options={{
            directions: directions,
            suppressMarkers: true
          }}
        />
      )}
    </GoogleMap>
  );
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function TablePagination({ totalPages, currentPage, onPageChange }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
        className="px-3 py-1 rounded border disabled:opacity-50">←</button>
      <span className="text-sm">Page {currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border disabled:opacity-50">→</button>
    </div>
  );
}

export default function PrivatehireTable() {
  const [hires, setHires] = useState([]);
  const [selectedVan, setSelectedVan] = useState('All');
  const [actionMenuIndex, setActionMenuIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedHire, setSelectedHire] = useState(null);

  useEffect(() => {
    async function fetchHires() {
      setLoading(true);
      
      try {
        const res = await fetch('/api/vanowner/private-hires');
        
        if (!res.ok) {
          throw new Error(`API error ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        
        setHires(data);
      } catch (err) {
        
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    }

    fetchHires();
  }, []);

  const filteredHires = selectedVan === 'All'
    ? hires
    : hires.filter(hire => hire.vanId === selectedVan);

  const calculateFare = (hire) => {
    if (hire.Van?.privateRating && hire.pickupLat && hire.pickupLng && hire.destinationLat && hire.destinationLng) {
      const distance = calculateDistance(hire.pickupLat, hire.pickupLng, hire.destinationLat, hire.destinationLng);
      return (hire.Van.privateRating * distance).toFixed(2);
    }
    return '-';
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex flex-row items-center justify-between mb-4 gap-4">
        <div className="relative w-full md:w-48">
          <select className="w-full px-4 py-3 rounded-md text-sm cursor-pointer appearance-none focus:outline-none bg-white border border-gray-300 text-blue-900 font-medium"
            value={selectedVan} onChange={e => setSelectedVan(e.target.value)}>
            <option disabled>Select Van</option>
            <option>All</option>
            {Array.from(new Set(hires.map(h => h.vanId))).map((vanId) => (
              <option key={vanId} value={vanId}>{vanId}</option>
            ))}
          </select>
          <FaChevronDown className="absolute top-3.5 right-3 pointer-events-none text-blue-900" />
        </div>
        <TablePagination totalPages={5} currentPage={1} onPageChange={(page) => console.log('Page changed to:', page)} />
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : (
          <table className="w-full text-sm rounded-2xl overflow-hidden border-b border-gray-200">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="px-4 py-3 text-left font-semibold">Pickup Place ID</th>
                <th className="px-4 py-3 text-left font-semibold">Destination Place ID</th>
                <th className="px-4 py-3 text-left font-semibold">Departure Date</th>
                <th className="px-4 py-3 text-left font-semibold">Return Date</th>
                <th className="px-4 py-3 text-left font-semibold">Passengers</th>
                <th className="px-4 py-3 text-left font-semibold">Fare</th>
                <th className="px-4 py-3 text-left font-semibold">Notes</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredHires.map((hire, index) => (
                <tr key={index} className="transition-colors bg-white border-b border-gray-100">
                  <td className="px-4 py-3 text-gray-900">{hire.pickupPlaceId || '-'}</td>
                  <td className="px-4 py-3 text-gray-900">{hire.destinationPlaceId || '-'}</td>
                  <td className="px-4 py-3 text-gray-900">{hire.departureDate ? new Date(hire.departureDate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3 text-gray-900">{hire.returnDate ? new Date(hire.returnDate).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3 text-gray-900">{hire.noOfPassengers}</td>
                  <td className="px-4 py-3 font-semibold text-green-600">{calculateFare(hire)}</td>
                  <td className="px-4 py-3 text-gray-900">{hire.notes}</td>
                  <td className="px-4 py-3 text-gray-900">{hire.status}</td>
                  <td className="px-4 py-3 flex justify-center align-middle relative">
                    <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                      onClick={() => setActionMenuIndex(actionMenuIndex === index ? null : index)}
                      title="Actions">
                      <FaEllipsisV size={18} color="#6B7280" />
                    </button>
                    {actionMenuIndex === index && (
                      <div className="absolute z-10 right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col">
                        <button className="px-4 py-2 text-left hover:bg-gray-100 text-green-600 font-semibold"
                          onClick={() => { alert('Accepted!'); setActionMenuIndex(null); }}>Accept</button>
                        <button className="px-4 py-2 text-left hover:bg-gray-100 text-red-500 font-semibold"
                          onClick={() => { alert('Rejected!'); setActionMenuIndex(null); }}>Reject</button>
                        <button className="px-4 py-2 text-left hover:bg-gray-100 text-blue-600 font-semibold"
                          onClick={() => { setSelectedHire(hire); setShowModal(true); setActionMenuIndex(null); }}>Show Details</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && selectedHire && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
            <button className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold shadow z-10"
              onClick={() => setShowModal(false)}
              aria-label="Close">&times;</button>

            <h2 className="text-xl font-bold mb-6 text-gray-900">Hire Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="text-sm"><strong>Pickup Place ID:</strong> {selectedHire.pickupPlaceId}</div>
              <div className="text-sm"><strong>Destination Place ID:</strong> {selectedHire.destinationPlaceId}</div>
              <div className="text-sm"><strong>Departure Date:</strong> {selectedHire.departureDate}</div>
              <div className="text-sm"><strong>Return Date:</strong> {selectedHire.returnDate}</div>
              <div className="text-sm"><strong>Passengers:</strong> {selectedHire.noOfPassengers}</div>
              <div className="text-sm"><strong>Fare:</strong> {calculateFare(selectedHire)}</div>
              <div className="text-sm col-span-full"><strong>Notes:</strong> {selectedHire.notes}</div>
              <div className="text-sm"><strong>Status:</strong> {selectedHire.status}</div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Route Map</h3>
              <RouteMap
                pickup={{ lat: selectedHire.pickupLat, lng: selectedHire.pickupLng }}
                destination={{ lat: selectedHire.destinationLat, lng: selectedHire.destinationLng }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
