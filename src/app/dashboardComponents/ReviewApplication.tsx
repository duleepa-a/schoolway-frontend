'use client';
import React from 'react';
import { X, User, FileText, AlertTriangle, CheckCircle, Download, ExternalLink } from 'lucide-react';

// Interface for Document Card props
interface DocumentCardProps {
  title: string;
  status: string;
  description: string;
  documentUrl?: string;
}

// Document Card Component
const DocumentCard: React.FC<DocumentCardProps> = ({ title, status, description, documentUrl }) => {
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
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">{title}</h4>
        {getStatusIcon(status)}
      </div>
      <p className="text-sm text-gray-600">Status: {status}</p>
      <p className="text-xs text-gray-500 mt-1">• {description}</p>
      {documentUrl && (
        <div className="mt-3 flex space-x-2">
          <a 
            href={documentUrl} 
            download
            className="flex items-center px-3 py-1.5 text-xs font-medium bg-yellow-400 text-white rounded hover:bg-yellow-500 transition-colors"
          >
            <Download size={14} className="mr-1" />
            Download
          </a>
          <a 
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            <ExternalLink size={14} className="mr-1" />
            Preview
          </a>
        </div>
      )}
    </div>
  );
};

// Interface for Verification Checkbox props
interface VerificationCheckboxProps {
  label: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}

// Verification Checkbox Component
const VerificationCheckbox: React.FC<VerificationCheckboxProps> = ({ label, isChecked, onChange }) => {
  return (
    <div className={`p-4 rounded-lg transition-colors ${isChecked ? 'bg-green-50 border border-green-100' : 'bg-gray-50'}`}>
      <label className="inline-flex items-center">
        <input 
          type="checkbox" 
          className="form-checkbox h-5 w-5 text-yellow-400 rounded border-gray-300 focus:ring-yellow-400"
          checked={isChecked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="ml-2 text-sm text-gray-800 font-medium">
          {label}
        </span>
        {isChecked && <CheckCircle className="w-4 h-4 text-green-600 ml-2" />}
      </label>
    </div>
  );
};

// Interface for Section Header props
interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  className?: string;
}

// Section Header Component
const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, className = "" }) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 mb-4 flex items-center ${className}`}>
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
  );
};

// Interface for Note Input props
interface NoteInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder: string;
}  // Note Input Component
const NoteInput: React.FC<NoteInputProps> = ({ value, onChange, maxLength, placeholder }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-yellow-400" />
          <span className="ml-2">Special Note</span>
        </h3>
        <span className="text-xs text-gray-500">
          {value.length}/{maxLength} characters
        </span>
      </div>
      
      <textarea
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400 resize-none h-24"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        maxLength={maxLength}
      />
      <div className="flex justify-between mt-1">
        <p className="text-xs text-gray-500">• This note will be attached to the application record</p>
        {value.trim().length > 0 && (
          <span className="text-xs text-green-600 font-medium">Note added</span>
        )}
      </div>
    </div>
  );
};

// Alert Banner Component
interface AlertBannerProps {
  icon: React.ReactNode;
  message: string;
  type: 'warning' | 'error' | 'info' | 'success';
}

const AlertBanner: React.FC<AlertBannerProps> = ({ icon, message, type }) => {
  const bgColors = {
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200'
  };
  
  const textColors = {
    warning: 'text-yellow-800',
    error: 'text-red-800',
    info: 'text-blue-800',
    success: 'text-green-800'
  };
  
  return (
    <div className="mb-6">
      <div className={`${bgColors[type]} border rounded-lg p-4 flex items-center`}>
        {icon}
        <span className={`text-sm font-medium ${textColors[type]} ml-3`}>
          {message}
        </span>
      </div>
    </div>
  );
};

// ActionButton Component
interface ActionButtonProps {
  label: string;
  onClick: () => void;
  variant: 'primary' | 'danger' | 'success' | 'secondary';
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, onClick, variant }) => {
  const bgColors = {
    primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
  };
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-6 py-2 text-sm font-medium text-white ${bgColors[variant]} border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 w-full sm:w-auto`}
    >
      {label}
    </button>
  );
};

interface ReviewApplicationProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (note?: string, verifiedDocs?: { police: boolean; medical: boolean; license: boolean }) => void;
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
    policeReportDocument?: string;
    medicalReportDocument?: string;
  };
}

const ReviewApplication: React.FC<ReviewApplicationProps> = ({
  isOpen,
  onClose,
  onApprove,
  onReject,
  applicationData
}) => {
  const [specialNote, setSpecialNote] = React.useState('');
  const [policeVerified, setPoliceVerified] = React.useState(false);
  const [medicalVerified, setMedicalVerified] = React.useState(false);
  const [licenceVerified, setLicenceVerified] = React.useState(false);
  
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const handleApprove = () => {
    onApprove(specialNote, { police: policeVerified, medical: medicalVerified, license: licenceVerified });
  };

  const isLicenseExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const monthsUntilExpiry = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsUntilExpiry <= 6; // Warning if expires within 6 months
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
            <User className="w-6 h-6 text-yellow-400" />
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

          
          <div className="mb-8">
            <SectionHeader 
              icon={<FileText className="w-5 h-5 mr-2 text-yellow-400" />}
              title="Documents & Verification"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DocumentCard 
                title="Police Report (Background Check)"
                status={applicationData.policeReport}
                description="• Background check required annually"
                documentUrl={applicationData.policeReportDocument}
              />
              
              <DocumentCard 
                title="Medical Report"
                status={applicationData.medicalReport}
                description="• Medical clearance for driving"
                documentUrl={applicationData.medicalReportDocument}
              />
              
              <DocumentCard 
                title="Driving Licence"
                status="valid"
                description="• Should not be expired"
                documentUrl={applicationData.policeReportDocument}
              />
            </div>
          </div>

          {/* Document Approval Checkboxes */}
          <div className="mb-6">
            <SectionHeader 
              icon={<CheckCircle className="w-5 h-5 mr-2 text-yellow-400" />}
              title="Manual Document Verification"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <VerificationCheckbox 
                label="Police Report Verified"
                isChecked={policeVerified}
                onChange={setPoliceVerified}
              />
              
              <VerificationCheckbox 
                label="Medical Report Verified"
                isChecked={medicalVerified}
                onChange={setMedicalVerified}
              />
              
              <VerificationCheckbox 
                label="Driving Licence Verified"
                isChecked={licenceVerified}
                onChange={setLicenceVerified}
              />
            </div>
          </div>
          
          {/* Special Note Section */}
          <NoteInput
            value={specialNote}
            onChange={setSpecialNote}
            maxLength={500}
            placeholder="Add any special notes or comments about this application..."
          />

          {/* Important Reminder: License Expiry */}
          {(() => {
            const expiry = new Date(applicationData.licenseExpiry);
            const today = new Date();
            const monthsUntilExpiry = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
            return monthsUntilExpiry <= 3;
          })() && (
            <AlertBanner 
              type="warning"
              icon={<AlertTriangle className="w-5 h-5 text-yellow-600" />}
              message="The driving license will expire within 3 months. Please update the license information."
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <ActionButton 
            label="Reject Application"
            onClick={onReject}
            variant="danger"
          />
          <ActionButton 
            label="Approve Application"
            onClick={handleApprove}
            variant="success"
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewApplication;
