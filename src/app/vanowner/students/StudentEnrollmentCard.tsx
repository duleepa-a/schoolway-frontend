import React from 'react';
import { MapPin, School, User, MessageSquare, Car, Calendar } from 'lucide-react';

type EnrollmentRequest = {
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
};

type StudentEnrollmentCardProps = {
  request?: EnrollmentRequest;
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  onViewDetails?: (id: number) => void;
};


const StudentEnrollmentCard = ({ 
  request = {
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
  onAccept,
  onReject,
  onViewDetails
}: StudentEnrollmentCardProps) => {
  const getStatusColor = (status:string) => {
    switch (status) {
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

  const formatDate = (dateString :string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-full h-full">
      {/* Header with Status */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-600">
              Request Date: {formatDate(request.requestDate)}
            </span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="p-2.5">
        {/* Student Info Section */}
        <div className="justify-between mb-6 grid grid-cols-2">
          <div className="flex p-2">
            <div className='p-1'>
              <img
                src={request.student.profilePic}
                alt={request.student.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
            <div className="p-1">
                <div className='text-center ml-1'>
                  <h3 className="text-xs font-semibold text-gray-900 mb-1">
                    {request.student.name}
                  </h3>
                </div>
                <div className="flex items-center  text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="text-xs">{request.student.grade}</span>
                </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex items-center mb-1">
              <Car className="w-5 h-5 text-blue-600" />
              <h4 className="text-xs text-gray-900 ml-1">Requested Van</h4>
            </div>
            <p className="text-xs text-gray-700 font-medium">{request.van.name}</p>
          </div>
        </div>
        
        {/* Location Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Pickup Location */}
          <div className="space-y-1">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-xs font-medium text-gray-700">Pickup Location</span>
            </div>
            <p className="text-xs text-gray-600 pl-6">{request.pickupLocation}</p>
          </div>

          {/* School */}
          <div className="space-y-1">
            <div className="flex items-center">
              <School className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-xs font-medium text-gray-700">School</span>
            </div>
            <p className="text-xs text-gray-600 pl-6">{request.school}</p>
          </div>
        </div>
        {/* Action Buttons */}
        {request.status === 'pending' && (
          <div className="flex space-x-1">
            <button
              onClick={() => onAccept?.(request.id)}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors duration-200 cursor-pointer"
            >
              Accept Request
            </button>
            <button
              onClick={() => onReject?.(request.id)}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-xs font-medium hover:bg-red-700 transition-colors duration-200 cursor-pointer"
            >
              Reject Request
            </button>
            <button
              onClick={() => onViewDetails?.(request.id)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors duration-200  cursor-pointer"
            >
              Details
            </button>
          </div>
        )}

        {request.status !== 'pending' && (
          <button
            onClick={() => onViewDetails?.(request.id)}
            className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 text-xs  cursor-pointer"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentEnrollmentCard;