'use client';

import React from 'react';
import { X, MapPin, School, Car, User } from 'lucide-react';

interface Child {
  id: number;
  name: string;
  age: number;
  grade: number;
  schoolStartTime: string;
  schoolEndTime: string;
  pickupAddress: string;
  status: string;
  school: {
    name: string;
    address: string;
  } | null;
  van: {
    makeAndModel: string;
    licensePlate: string;
    registrationNumber: string;
    assignedDriverId: string | null;
    assignedDriver: {
      id: string;
      name: string;
      mobile: string;
    } | null;
  } | null;
  gate: {
    name: string;
    address: string;
  } | null;
}

interface ChildrenViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: Child[];
  parentName: string;
}

const ChildrenViewModal: React.FC<ChildrenViewModalProps> = ({
  isOpen,
  onClose,
  children,
  parentName
}) => {
  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOT_ASSIGNED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'AT_HOME':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'AT_SCHOOL':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ON_VAN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
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
              <h2 className="text-2xl font-bold text-white">Children of {parentName}</h2>
              <p className="text-white/80 mt-1">{children.length} child{children.length !== 1 ? 'ren' : ''} registered</p>
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
          {children.length === 0 ? (
            <div className="text-center py-12">
              <User size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Children Found</h3>
              <p className="text-gray-500">This parent doesn't have any children registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {children.map((child) => (
                <div key={child.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  {/* Child Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">{child.grade}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{child.name}</h3>
                        <p className="text-sm text-gray-600">Age {child.age} • Grade {child.grade}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(child.status)}`}>
                      {child.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Child Details */}
                  <div className="space-y-4">
                    {/* School Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <School size={16} className="text-gray-600" />
                        <span className="font-medium text-gray-700">School Information</span>
                      </div>
                      {child.school ? (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">{child.school.name}</p>
                          <p className="text-xs text-gray-600">{child.school.address}</p>
                          <div className="flex gap-4 text-xs text-gray-500 mt-2">
                            <span>Start: {child.schoolStartTime}</span>
                            <span>End: {child.schoolEndTime}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No school assigned</p>
                      )}
                    </div>

                    {/* Van Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Car size={16} className="text-gray-600" />
                        <span className="font-medium text-gray-700">Transport Information</span>
                      </div>
                      {child.van ? (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900">{child.van.makeAndModel}</p>
                          <div className="flex gap-4 text-xs text-gray-600">
                            <span>Plate: {child.van.licensePlate}</span>
                            <span>Reg: {child.van.registrationNumber}</span>
                          </div>
                          {child.van.assignedDriver ? (
                            <div className="text-xs text-gray-600">
                              <span className="font-medium">Driver:</span> {child.van.assignedDriver.name}
                              {child.van.assignedDriver.mobile && (
                                <span className="ml-2">({child.van.assignedDriver.mobile})</span>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">Driver:</span> No driver assigned
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No van assigned</p>
                      )}
                    </div>

                    {/* Pickup Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={16} className="text-gray-600" />
                        <span className="font-medium text-gray-700">Pickup Information</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900">{child.pickupAddress}</p>
                        {child.gate && (
                          <div className="text-xs text-gray-600">
                            <span className="font-medium">Gate:</span> {child.gate.name}
                            {child.gate.address && <span className="ml-2">({child.gate.address})</span>}
                          </div>
                        )}
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

export default ChildrenViewModal;
