'use client';

import React, { useEffect, useRef } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ViewApplicationProps {
  application: any;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

export default function ViewApplication({
  application,
  onApprove,
  onReject,
  onClose,
}: ViewApplicationProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative overflow-y-auto max-h-[90vh] border border-gray-200 dark:border-gray-700"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-yellow-500 text-xl"
        >
          ✖
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-500">
          Driver Application
        </h2>

        <div className="space-y-8 text-sm text-gray-700 bg-white">
          
          {/* Personal Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Personal Information</h3>

           {/* Profile Picture */}
            {application.profilePicture && (
              <div>
                <h3 className="font-semibold mb-2">Profile Picture</h3>
                <a
                  href={application.profilePicture}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={application.profilePicture}
                    alt="Profile"
                    className="h-32 w-32 object-cover rounded-md border border-gray-300 hover:scale-105 transition-transform"
                  />
                </a>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-5">
              <p><span className="font-semibold">Name:</span> {application.name}</p>
              <p><span className="font-semibold">Email:</span> {application.email}</p>
              <p><span className="font-semibold">NIC:</span> {application.nic}</p>
              <p><span className="font-semibold">Contact:</span> {application.mobile}</p>
              <p><span className="font-semibold">DOB:</span> {application.dob}</p>
              <p><span className="font-semibold">Address:</span> {application.address}</p>
              <p><span className="font-semibold">Bio:</span> {application.bio || 'N/A'}</p>
              <p><span className="font-semibold">Languages:</span> {application.languages?.join(', ') || 'N/A'}</p>
            </div>
          </div>

          {/* License Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">License Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <p><span className="font-semibold">License No:</span> {application.drivingLicense}</p>
              <p><span className="font-semibold">License Expiry:</span> {new Date(application.licenseExpiry).toLocaleDateString()}</p>
              <p><span className="font-semibold">License Types:</span> {application.licenseType?.join(', ') || 'N/A'}</p>
            </div>
          </div>

          

          {/* Documents Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Documents</h3>
            <div className="space-y-3">
              {application.policeReportDocument && (
                <div>
                  <p className="font-semibold">Police Report:</p>
                  <a
                    href={application.policeReportDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-500 underline hover:text-yellow-600"
                  >
                    View Police Report
                  </a>
                </div>
              )}

              {application.medicalReport && (
                <div>
                  <p className="font-semibold">Medical Report:</p>
                  <a
                    href={application.medicalReport}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-500 underline hover:text-yellow-600"
                  >
                    View Medical Report
                  </a>
                </div>
              )}
            <div className='grid grid-cols-2'>
              {application.licenseFront && (
                <div>
                  <p className="font-semibold">License Front:</p>
                  <a href={application.licenseFront} target="_blank" rel="noopener noreferrer">
                    <img
                      src={application.licenseFront}
                      alt="License Front"
                      className="h-32 w-32 object-cover rounded-md border border-gray-300 hover:scale-105 transition-transform"
                    />
                  </a>
                </div>
              )}

              {application.licenseBack && (
                <div>
                  <p className="font-semibold">License Back:</p>
                  <a href={application.licenseBack} target="_blank" rel="noopener noreferrer">
                    <img
                      src={application.licenseBack}
                      alt="License Back"
                      className="h-32 w-32 object-cover rounded-md border border-gray-300 hover:scale-105 transition-transform"
                    />
                  </a>
                </div>
              )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={onReject}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              <XCircle size={18} /> Reject
            </button>
            <button
              onClick={onApprove}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              <CheckCircle size={18} /> Approve
            </button>
          </div>
        </div>      
      </div>
    </div>
  );
}




