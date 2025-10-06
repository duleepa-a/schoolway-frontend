// components/StudentRequests.tsx
'use client';
import { useEffect, useState } from 'react';
import StudentEnrollmentCard from "./StudentEnrollmentCard";
import { FaSearch, FaChevronDown, FaTimes, FaMapMarkerAlt, FaSchool, FaCar, FaCalendar, FaUser, FaStickyNote } from 'react-icons/fa';
import TablePagination from '@/app/components/TablePagination';
import Image from 'next/image';

type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

interface StudentRequest {
  id: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt?: string;
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
        const res = await fetch('/api/vanowner/student-requests', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || 'Failed to fetch');
        }

        const data: StudentRequest[] = await res.json();
        setRequests(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const openDetails = (id: string) => {
    const r = requests.find((x) => x.id === id) ?? null;
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
        <div className="relative w-full md:w-48">
          <select className="w-full px-4 py-3 bg-search-bar-bg rounded-md text-sm cursor-pointer appearance-none" defaultValue="Van 1">
            <option disabled>Select Van</option>
            <option>Van 1</option>
          </select>
          <FaChevronDown className="ml-2 absolute top-3.5 left-40 cursor-pointer" />
        </div>
        <div className="relative w-full md:w-48">
          <select className="w-full px-4 py-3 bg-search-bar-bg rounded-md text-sm cursor-pointer appearance-none" defaultValue="Van 1">
            <option disabled>Student Status</option>
            <option>All</option>
            <option>Active</option>
          </select>
          <FaChevronDown className="ml-2 absolute top-3.5 left-40 cursor-pointer" />
        </div>
        <TablePagination totalPages={5} currentPage={1} onPageChange={(page) => console.log('page', page)} />
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
                <div className="relative">
                  <Image src={selectedRequest.child.profilePicture ?? '/Images/male_pro_pic_placeholder.png'} alt={selectedRequest.child.name} width={80} height={80} className="rounded-full border-4 border-white shadow-lg" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{selectedRequest.child.name}</h3>
                  <p className="text-lg text-gray-600 flex items-center"><FaUser className="mr-2" />{`Grade ${selectedRequest.child.grade}`}</p>
                </div>
                <div className={`px-4 py-2 rounded-full border text-sm font-semibold capitalize ${selectedRequest.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : selectedRequest.status === 'ACCEPTED' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                  {selectedRequest.status.toLowerCase()}
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
