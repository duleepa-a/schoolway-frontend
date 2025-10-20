'use client';

import React from 'react';
import { X, Car, Users, Calendar, Wrench } from 'lucide-react';

interface Van {
  id: number;
  makeAndModel: string;
  licensePlateNumber: string;
  registrationNumber: string;
  seatingCapacity: number;
  status: number;
  photoUrl: string;
  assignedDriverId: string | null;
  assignedDriver: {
    id: string;
    name: string;
    mobile: string;
  } | null;
}

interface VansViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  vans: Van[];
  serviceName: string;
}

const VansViewModal: React.FC<VansViewModalProps> = ({
  isOpen,
  onClose,
  vans,
  serviceName
}) => {
  if (!isOpen) return null;

  const getStatusText = (status: number) => {
    switch (status) {
      case 1:
        return 'Active';
      case 2:
        return 'Pending';
      case 3:
        return 'Inactive';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1:
        return 'bg-green-100 text-green-800 border-green-200';
      case 2:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 3:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4" style={{ background: 'linear-gradient(90deg, #0099cc 0%, #00bcd4 60%, #00d4aa 100%)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Vans of {serviceName}</h2>
              <p className="text-white/80 mt-1">{vans.length} van{vans.length !== 1 ? 's' : ''} registered</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {vans.length === 0 ? (
            <div className="text-center py-12">
              <Car size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Vans Found</h3>
              <p className="text-gray-500">This van service doesn't have any vans registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vans.map((van) => (
                <div key={van.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  {/* Van Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Car size={20} className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{van.makeAndModel}</h3>
                        <p className="text-sm text-gray-600">Van #{van.id}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(van.status)}`}>
                      {getStatusText(van.status)}
                    </span>
                  </div>

                  {/* Van Image */}
                  <div className="mb-4">
                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={van.photoUrl || '/Images/vehicle_placeholder.png'} 
                        alt={`${van.makeAndModel} - Van #${van.id}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/Images/vehicle_placeholder.png';
                        }}
                      />
                    </div>
                  </div>

                  {/* Van Details */}
                  <div className="space-y-4">
                    {/* Basic Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Wrench size={16} className="text-gray-600" />
                        <span className="font-medium text-gray-700">Vehicle Information</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">License Plate</p>
                          <p className="text-sm font-medium text-gray-900">{van.licensePlateNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Registration</p>
                          <p className="text-sm font-medium text-gray-900">{van.registrationNumber}</p>
                        </div>
                      </div>
                    </div>

                    {/* Capacity Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Users size={16} className="text-gray-600" />
                        <span className="font-medium text-gray-700">Capacity Information</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users size={14} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{van.seatingCapacity} seats</p>
                          <p className="text-xs text-gray-600">Maximum passenger capacity</p>
                        </div>
                      </div>
                    </div>

                    {/* Assigned Driver Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Users size={16} className="text-gray-600" />
                        <span className="font-medium text-gray-700">Assigned Driver</span>
                      </div>
                      {van.assignedDriver ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users size={14} className="text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{van.assignedDriver.name}</p>
                            <p className="text-xs text-gray-600">{van.assignedDriver.mobile || 'No contact info'}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Users size={14} className="text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">No driver assigned</p>
                            <p className="text-xs text-gray-400">This van is currently unassigned</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar size={16} className="text-gray-600" />
                        <span className="font-medium text-gray-700">Service Status</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          van.status === 1 ? 'bg-green-500' :
                          van.status === 2 ? 'bg-yellow-500' :
                          van.status === 3 ? 'bg-red-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="text-sm text-gray-700">{getStatusText(van.status)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VansViewModal;
