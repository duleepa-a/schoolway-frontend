'use client';
import React from 'react';
import { X, User, FileText, Shield, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

interface ReviewApplicationProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  applicationData: {
    name: string;
    contact: string;
    dob: string;
    address: string;
    drivingLicense: string;
    licenseExpiry: string;
    nic: string;
    policeReport: string;
    medicalReport: string;
    profilePicture?: string;
  };
}

const ReviewApplication: React.FC<ReviewApplicationProps> = ({
  isOpen,
  onClose,
  onApprove,
  onReject,
  applicationData
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const monthsUntilExpiry = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsUntilExpiry <= 6; // Warning if expires within 6 months
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'verified':
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
      case 'review':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Review Driver Application</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Driver Profile Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Driver Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {applicationData.profilePicture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={applicationData.profilePicture} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{applicationData.name}</h4>
                    <p className="text-sm text-gray-600">Driver Applicant</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Contact Number</label>
                    <p className="text-sm text-gray-900">{applicationData.contact}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                    <p className="text-sm text-gray-900">{applicationData.dob}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <p className="text-sm text-gray-900">{applicationData.address}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">NIC Number</label>
                    <p className="text-sm text-gray-900">{applicationData.nic}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Driving License</label>
                    <p className="text-sm text-gray-900">{applicationData.drivingLicense}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">License Expiry</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-900">{applicationData.licenseExpiry}</p>
                      {isLicenseExpiringSoon(applicationData.licenseExpiry) && (
                        <span title="License expires soon">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents & Verification Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Documents & Verification
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Police Report (Background Check)</h4>
                  {getStatusIcon(applicationData.policeReport)}
                </div>
                <p className="text-sm text-gray-600">Status: {applicationData.policeReport}</p>
                <p className="text-xs text-gray-500 mt-1">• Background check required annually</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Medical Report</h4>
                  {getStatusIcon(applicationData.medicalReport)}
                </div>
                <p className="text-sm text-gray-600">Status: {applicationData.medicalReport}</p>
                <p className="text-xs text-gray-500 mt-1">• Medical clearance for driving</p>
              </div>
            </div>
          </div>

          {/* Important Reminders */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Verification Checklist
            </h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Important Reminders
              </h4>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  License renewal should be updated and verified regularly
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Background check required once a year
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  System will inform about upcoming expirations
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  All documents must be verified before approval
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onReject}
            className="px-6 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 w-full sm:w-auto"
          >
            Reject Application
          </button>
          <button
            type="button"
            onClick={onApprove}
            className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 w-full sm:w-auto"
          >
            Approve Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewApplication;
