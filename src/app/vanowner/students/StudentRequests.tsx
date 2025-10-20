// components/StudentRequests.tsx
'use client';
import React, { useEffect, useState, Suspense } from 'react';
import StudentEnrollmentCard from "./StudentEnrollmentCard";
import { FaSearch, FaChevronDown, FaTimes, FaMapMarkerAlt, FaSchool, FaCar, FaCalendar, FaUser, FaStickyNote, FaMapMarked } from 'react-icons/fa';
import TablePagination from '@/app/components/TablePagination';
import Image from 'next/image';
import LocationsMap from '@/app/components/LocationsMap';

type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

interface StudentRequest {
  id: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt?: string;
  estimatedFare: number;
  child: {
    id: number;
    name: string;
    profilePicture: string;
    grade: number | string;
    pickupAddress?: string;
    specialNotes?: string | null;
    school?: { id: number; name: string } | null;
    parent?: { id: string; email?: string; firstname?: string } | null;
  };
  van: {
    id: number;
    makeAndModel?: string | null;
    licensePlateNumber?: string | null;
    registrationNumber?: string | null;
  };
}

const StudentRequests = () => {
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<StudentRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching student requests...');
        const res = await fetch('/api/vanowner/student-requests', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        console.log('Response status:', res.status);
        
        // Try to get the response body regardless of status code
        let body;
        try {
          body = await res.json();
          console.log('Response body:', body);
        } catch (parseError) {
          console.error('Failed to parse response:', parseError);
          body = {};
        }

        if (!res.ok) {
          const errorMessage = body?.error || body?.message || `Error ${res.status}: ${res.statusText}`;
          console.error('Request failed with status', res.status, errorMessage);
          throw new Error(errorMessage);
        }

        if (!Array.isArray(body)) {
          console.error('Expected array response, got:', typeof body);
          throw new Error('Invalid response format');
        }

        const data: StudentRequest[] = body;
        console.log('Successfully fetched', data.length, 'student requests');
        setRequests(data);
      } catch (err) {
        console.error('Error fetching student requests:', err);
        const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const openDetails = (id: string) => {
    const r = requests.find((x) => x.id === id) ?? null;
    
    // Debug logging for the selected request
    console.log('Selected Request Details:', {
      id: r?.id,
      student: r?.child.name,
      pickupLocation: r?.child.pickupAddress,
      school: r?.child.school?.name,
      fullRequest: r
    });
    
    setSelectedRequest(r);
    setIsModalOpen(!!r);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const performAction = async (id: string, action: 'accept' | 'reject') => {
    try {
      const res = await fetch(`/api/vanowner/student-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) throw new Error('Failed to update request');

      const body = await res.json();

      // Simply refetch updated data
      setRequests((prev) => prev.map(r => r.id === id ? { ...r, status: body.status } : r));
    } catch (err) {
      setError((err as Error).message || 'Action failed');
    } finally {
      closeModal();
    }
  };


  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between lg:justify-start mb-4 gap-4">
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search students"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-search-bar-bg"
            // optionally add filtering logic
          />
        </div>
      </div>

      {loading && <div className="p-4">Loading requests...</div>}
      {error && <div className="p-4 text-red-600">Error: {error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {requests.map((request) => (
          <StudentEnrollmentCard
            key={request.id}
            request={{
              id: request.id,
              student: {
                name: request.child.name,
                profilePic: request.child.profilePicture ?? '/Images/male_pro_pic_placeholder.png',
                grade: typeof request.child.grade === 'number' ? `Grade ${request.child.grade}` : `${request.child.grade}`,
              },
              van: {
                name: request.van.makeAndModel ?? 'Van',
                plateNumber: request.van.licensePlateNumber ?? '',
              },
              pickupLocation: request.child.pickupAddress ?? '',
              school: request.child.school?.name ?? '',
              specialNotes: request.child.specialNotes ?? '',
              requestDate: request.createdAt,
              status: request.status.toLowerCase(),
              estimatedFare: request.estimatedFare,
            }}
            onAccept={() => performAction(request.id, 'accept')}
            onReject={() => performAction(request.id, 'reject')}
            onViewDetails={() => openDetails(request.id)}
          />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Student Details</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FaTimes className="text-gray-500 text-xl" />
              </button>
            </div>

            <div className="p-6">
            <div className="flex items-center space-x-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <div className="relative w-20 h-20"> {/* enforce 80x80 size */}
                <Image
                  src={selectedRequest.child.profilePicture ?? '/Images/male_pro_pic_placeholder.png'}
                  alt={selectedRequest.child.name}
                  fill
                  className="rounded-full border-4 border-white shadow-lg object-cover object-center"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {selectedRequest.child.name}
                </h3>
                <p className="text-lg text-gray-600 flex items-center">
                  <FaUser className="mr-2" />{`Grade ${selectedRequest.child.grade}`}
                </p>
              </div>
              <div
                className={`px-4 py-2 rounded-full border text-sm font-semibold capitalize ${
                  selectedRequest.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    : selectedRequest.status === 'ACCEPTED'
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-red-100 text-red-800 border-red-200'
                }`}
              >
                Rs. {selectedRequest.estimatedFare}
              </div>
            </div>


              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-blue-600 mb-3">
                    <FaSchool className="text-xl mr-2" />
                    <h4 className="text-lg font-semibold">School Information</h4>
                  </div>
                  <p className="text-gray-700 font-medium">{selectedRequest.child.school?.name ?? 'N/A'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-green-600 mb-3">
                    <FaMapMarkerAlt className="text-xl mr-2" />
                    <h4 className="text-lg font-semibold">Pickup Location</h4>
                  </div>
                  <p className="text-gray-700">{selectedRequest.child.pickupAddress ?? 'Not specified'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-purple-600 mb-3">
                    <FaCar className="text-xl mr-2" />
                    <h4 className="text-lg font-semibold">Assigned Van</h4>
                  </div>
                  <p className="text-gray-700 font-medium">{selectedRequest.van.makeAndModel ?? 'N/A'}</p>
                  <p className="text-gray-600 text-sm">Plate: {selectedRequest.van.licensePlateNumber ?? 'N/A'}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-orange-600 mb-3">
                    <FaCalendar className="text-xl mr-2" />
                    <h4 className="text-lg font-semibold">Request Date</h4>
                  </div>
                  <p className="text-gray-700">{formatDate(selectedRequest.createdAt)}</p>
                </div>
              </div>

              {/* Add the map to show pickup and school locations */}
              <div className="mt-6">
                <div className="flex items-center text-blue-600 mb-3">
                  <FaMapMarked className="text-xl mr-2" />
                  <h4 className="text-lg font-semibold">Route Map</h4>
                </div>
                {/* Add error boundary for the map component */}
                <div className="relative">
                  {/* If pickup address or school is missing, display a message */}
                  {(!selectedRequest.child.pickupAddress && !selectedRequest.child.school?.name) ? (
                    <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-600">
                      <p>No location information available</p>
                    </div>
                  ) : (
                    <Suspense fallback={
                      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <p className="text-gray-600">Loading map...</p>
                        </div>
                      </div>
                    }>
                      <LocationsMap 
                        key={`map-${selectedRequest.id}`} // Add key to force remount
                        pickupLocation={selectedRequest.child.pickupAddress}
                        schoolLocation={selectedRequest.child.school?.name}
                      />
                    </Suspense>
                  )}
                </div>
              </div>

              {selectedRequest.child.specialNotes && (
                <div className="mt-6 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-center text-yellow-700 mb-3">
                    <FaStickyNote className="text-xl mr-2" />
                    <h4 className="text-lg font-semibold">Special Notes</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{selectedRequest.child.specialNotes}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                {selectedRequest.status === 'PENDING' && (
                  <>
                    <button onClick={() => performAction(selectedRequest.id, 'reject')} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">Reject Request</button>
                    <button onClick={() => performAction(selectedRequest.id, 'accept')} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium">Accept Request</button>
                  </>
                )}
                <button onClick={closeModal} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRequests;
