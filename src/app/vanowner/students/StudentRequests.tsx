import { useState } from 'react';
import StudentEnrollmentCard from "./StudentEnrollmentCard";
import { FaSearch, FaChevronDown, FaTimes, FaMapMarkerAlt, FaSchool, FaCar, FaCalendar, FaUser, FaStickyNote } from 'react-icons/fa';
import TablePagination from '@/app/components/TablePagination';
import Image from 'next/image';

interface StudentRequest {
  id: number;
  student: {
    name: string;
    profilePic: string;
    grade: string;
  };
  van: {
    name: string;
    plateNumber: string;
  };
  pickupLocation: string;
  school: string;
  specialNotes: string;
  requestDate: string;
  status: string;
}

const StudentRequests = () => {
  const [selectedRequest, setSelectedRequest] = useState<StudentRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sampleRequests = [
    {
      id: 1,
      student: {
        name: "Emily Johnson",
        profilePic: "/Images/male_pro_pic_placeholder.png",
        grade: "Grade 8"
      },
      van: {
        name: "Toyota HiAce Spec 10",
        plateNumber: "ABC-1234"
      },
      pickupLocation: "123 Maple Street, Colombo 07",
      school: "Royal College Colombo",
      specialNotes: "Please ensure Emily sits near the front as she gets motion sickness. Also, she has a nut allergy - please keep snacks away from her.",
      requestDate: "2025-06-25",
      status: "pending"
    },
    {
      id: 2,
      student: {
        name: "Michael Chen",
        profilePic: "/Images/male_pro_pic_placeholder.png",
        grade: "Grade 10"
      },
      van: {
        name: "Toyota HiAce Spec 10",
        plateNumber: "ABC-1234"
      },
      pickupLocation: "456 Oak Avenue, Colombo 05",
      school: "St. Thomas' College",
      specialNotes: "Michael needs to be picked up by 7:30 AM sharp as he has early morning classes.",
      requestDate: "2025-06-24",
      status: "accepted"
    },
    {
      id: 3,
      student: {
        name: "Sarah Williams",
        profilePic: "/Images/male_pro_pic_placeholder.png",
        grade: "Grade 6"
      },
      van: {
        name: "Toyota HiAce Spec 10",
        plateNumber: "ABC-1234"
      },
      pickupLocation: "789 Pine Road, Colombo 03",
      school: "Holy Family Convent",
      specialNotes: "",
      requestDate: "2025-06-23",
      status: "rejected"
    }
  ];

  const handleAccept = (requestId: number) => {
    console.log('Accepting request:', requestId);
    // Handle accept logic here
  };

  const handleReject = (requestId: number) => {
    console.log('Rejecting request:', requestId);
    // Handle reject logic here
  };

  const handleViewDetails = (requestId: number) => {
    const request = sampleRequests.find(req => req.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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
          />
        </div>
        <div className="relative w-full md:w-48">
          <select
            className="w-full px-4 py-3 bg-search-bar-bg rounded-md text-sm cursor-pointer appearance-none"
            defaultValue="Van 1"
          >
            <option disabled>Select Van</option>
            <option>Van 1</option>
            <option>Van 2</option>
            <option>Van 3</option>
          </select>
          <FaChevronDown className="ml-2 absolute top-3.5 left-40 cursor-pointer" />
        </div>
        <div className="relative w-full md:w-48">
          <select
            className="w-full px-4 py-3 bg-search-bar-bg rounded-md text-sm cursor-pointer appearance-none"
            defaultValue="Van 1"
          >
            <option disabled>Student Status</option>
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <FaChevronDown className="ml-2 absolute top-3.5 left-40 cursor-pointer" />
        </div>
        <TablePagination totalPages={5} />
      </div>

      <div className="flex grid-cols-3 gap-2.5">
        {sampleRequests.map((request) => (
          <StudentEnrollmentCard
            key={request.id}
            request={request}
            onAccept={handleAccept}
            onReject={handleReject}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Student Details</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes className="text-gray-500 text-xl" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Student Profile Section */}
              <div className="flex items-center space-x-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <div className="relative">
                  <Image
                    src={selectedRequest.student.profilePic}
                    alt={selectedRequest.student.name}
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-white shadow-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {selectedRequest.student.name}
                  </h3>
                  <p className="text-lg text-gray-600 flex items-center">
                    <FaUser className="mr-2" />
                    {selectedRequest.student.grade}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full border text-sm font-semibold capitalize ${getStatusColor(selectedRequest.status)}`}>
                  {selectedRequest.status}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* School Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-blue-600 mb-3">
                    <FaSchool className="text-xl mr-2" />
                    <h4 className="text-lg font-semibold">School Information</h4>
                  </div>
                  <p className="text-gray-700 font-medium">{selectedRequest.school}</p>
                </div>

                {/* Pickup Location */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-green-600 mb-3">
                    <FaMapMarkerAlt className="text-xl mr-2" />
                    <h4 className="text-lg font-semibold">Pickup Location</h4>
                  </div>
                  <p className="text-gray-700">{selectedRequest.pickupLocation}</p>
                </div>

                {/* Van Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-purple-600 mb-3">
                    <FaCar className="text-xl mr-2" />
                    <h4 className="text-lg font-semibold">Assigned Van</h4>
                  </div>
                  <p className="text-gray-700 font-medium">{selectedRequest.van.name}</p>
                  <p className="text-gray-600 text-sm">Plate: {selectedRequest.van.plateNumber}</p>
                </div>

                {/* Request Date */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-orange-600 mb-3">
                    <FaCalendar className="text-xl mr-2" />
                    <h4 className="text-lg font-semibold">Request Date</h4>
                  </div>
                  <p className="text-gray-700">{formatDate(selectedRequest.requestDate)}</p>
                </div>
              </div>

              {/* Special Notes Section */}
              {selectedRequest.specialNotes && (
                <div className="mt-6 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex items-center text-yellow-700 mb-3">
                    <FaStickyNote className="text-xl mr-2" />
                    <h4 className="text-lg font-semibold">Special Notes</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{selectedRequest.specialNotes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                {selectedRequest.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleReject(selectedRequest.id);
                        closeModal();
                      }}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() => {
                        handleAccept(selectedRequest.id);
                        closeModal();
                      }}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                      Accept Request
                    </button>
                  </>
                )}
                 <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium">
                  Close
                </button>
               
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default StudentRequests;