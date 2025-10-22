'use client';
import { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import ConfirmationBox from '@/app/dashboardComponents/ConfirmationBox';

interface Guardian {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  nic?: string;
  schoolId: number;
}

interface EditGuardianModalProps {
  guardian: Guardian;
  onClose: () => void;
  onSuccess: () => void;
}

const EditGuardianModal = ({ guardian, onClose, onSuccess }: EditGuardianModalProps) => {
  const [formData, setFormData] = useState({
    firstName: guardian.firstName,
    lastName: guardian.lastName,
    email: guardian.email,
    phone: guardian.phone || '',
    nic: guardian.nic || ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Confirmation dialog states
  const [showSuccessConfirmation, setShowSuccessConfirmation] = useState(false);
  const [showErrorConfirmation, setShowErrorConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName.trim()) {
      setConfirmationMessage('First name is required');
      setShowErrorConfirmation(true);
      return;
    }
    
    if (!formData.lastName.trim()) {
      setConfirmationMessage('Last name is required');
      setShowErrorConfirmation(true);
      return;
    }
    
    if (!formData.nic.trim()) {
      setConfirmationMessage('NIC is required');
      setShowErrorConfirmation(true);
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch('/api/admin/guardian', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: guardian.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          nic: formData.nic,
          schoolId: guardian.schoolId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update guardian');
      }

      setConfirmationMessage('Guardian updated successfully!');
      setShowSuccessConfirmation(true);
      
      // Call onSuccess after a short delay to show the success message
      setTimeout(() => {
        onSuccess();
      }, 2000);
      
    } catch (error) {
      console.error('Error updating guardian:', error);
      setConfirmationMessage(`Failed to update guardian: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setShowErrorConfirmation(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl cursor-pointer"
        >
          &times;
        </button>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <User className="mr-2 text-blue-500" size={24} />
          Edit Guardian
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter first name"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter last name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email * (Read-only)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
              placeholder="Email cannot be changed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Guardian email cannot be modified after creation
            </p>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>
          
          <div>
            <label htmlFor="nic" className="block text-sm font-medium text-gray-700 mb-1">
              NIC Number *
            </label>
            <input
              type="text"
              id="nic"
              name="nic"
              value={formData.nic}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter NIC number"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Guardian'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Success Confirmation Dialog */}
        <ConfirmationBox
          isOpen={showSuccessConfirmation}
          variant='success'
          title="Success"
          confirmationMessage={confirmationMessage}
          objectName=""
          onConfirm={() => setShowSuccessConfirmation(false)}
          onCancel={() => setShowSuccessConfirmation(false)}
          confirmText="OK"
          cancelText="Close"
        />

        {/* Error Confirmation Dialog */}
        <ConfirmationBox
          isOpen={showErrorConfirmation}
          title="Error"
          variant='error'
          confirmationMessage={confirmationMessage}
          objectName=""
          onConfirm={() => setShowErrorConfirmation(false)}
          onCancel={() => setShowErrorConfirmation(false)}
          confirmText="OK"
          cancelText="Close"
        />
      </div>
    </div>
  );
};

export default EditGuardianModal;