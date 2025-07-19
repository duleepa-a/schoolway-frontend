import React from 'react';

interface JobOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  driverName: string;
  vanModel?: string;
  isLoading: boolean;
}

const JobOfferModal: React.FC<JobOfferModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  driverName,
  vanModel,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className="popup-modal">

      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Confirm Job Offer
        </h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Are you sure you want to send a job offer to:
          </p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium text-gray-800">
              Driver: {driverName}
            </p>
            {vanModel && (
              <p className="text-gray-600 text-sm">
                Van: {vanModel}
              </p>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
          <p className="text-yellow-800 text-sm">
            ⚠️ This action will send a job request to the driver. They will be notified and can accept or decline the offer.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              'Send Job Offer'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobOfferModal;
