import React from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

interface JobOfferConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  driverName: string;
  vanModel: string;
  salaryPercentage: number;
  shiftDetails: string;
  loading?: boolean;
}

const JobOfferConfirmation: React.FC<JobOfferConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  driverName,
  vanModel,
  salaryPercentage,
  shiftDetails,
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FaExclamationTriangle className="text-yellow-500 text-xl" />
            <h2 className="text-lg font-semibold">Confirm Job Offer</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to send a job offer to:
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Driver:</span>
              <span>{driverName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Van:</span>
              <span>{vanModel}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Salary:</span>
              <span>{salaryPercentage}% of earnings</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Shift:</span>
              <span>{shiftDetails}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mt-4">
            The driver will receive a notification and can accept or reject this offer.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              'Send Job Offer'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobOfferConfirmation;
