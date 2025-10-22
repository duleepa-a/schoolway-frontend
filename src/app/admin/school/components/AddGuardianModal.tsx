'use client';
import { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import ConfirmationBox from '@/app/dashboardComponents/ConfirmationBox';

interface AddGuardianModalProps {
  preselectedSchool?: number;
  schoolName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AddGuardianModal = ({ preselectedSchool, schoolName, onClose, onSuccess }: AddGuardianModalProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nic: '',
    password: '',
    schoolId: preselectedSchool || ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Confirmation dialog states
  const [showSuccessConfirmation, setShowSuccessConfirmation] = useState(false);
  const [showErrorConfirmation, setShowErrorConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Function to generate email based on firstname and school name
  const generateEmail = (firstName: string, schoolName: string) => {
    if (!firstName || !schoolName) return '';
    
    // Clean the firstname (lowercase, remove spaces and special characters)
    const cleanFirstName = firstName.toLowerCase().replace(/[^a-z]/g, '');
    
    // Clean the school name (lowercase, remove spaces and special characters)
    const cleanSchoolName = schoolName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    return `${cleanFirstName}.guardian@${cleanSchoolName}.lk`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Auto-generate email when firstName changes and schoolName is available
      if (name === 'firstName' && schoolName) {
        newData.email = generateEmail(value, schoolName);
      }
      
      return newData;
    });
  };

  // Generate initial email when component mounts if schoolName is available
  useEffect(() => {
    if (schoolName && formData.firstName) {
      const generatedEmail = generateEmail(formData.firstName, schoolName);
      if (generatedEmail && generatedEmail !== formData.email) {
        setFormData(prev => ({
          ...prev,
          email: generatedEmail
        }));
      }
    }
  }, [schoolName]);

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
    
    if (!formData.email.trim()) {
      setConfirmationMessage('Email is required');
      setShowErrorConfirmation(true);
      return;
    }
    
    if (!formData.phone.trim()) {
      setConfirmationMessage('Phone number is required');
      setShowErrorConfirmation(true);
      return;
    }
    
    if (!formData.schoolId) {
      setConfirmationMessage('School is required');
      setShowErrorConfirmation(true);
      return;
    }
    
    if (!formData.nic.trim()) {
      setConfirmationMessage('NIC is required');
      setShowErrorConfirmation(true);
      return;
    }
    
    if (!formData.password.trim()) {
      setConfirmationMessage('Password is required');
      setShowErrorConfirmation(true);
      return;
    }
    
    if (formData.password.length < 6) {
      setConfirmationMessage('Password must be at least 6 characters long');
      setShowErrorConfirmation(true);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setConfirmationMessage('Please enter a valid email address');
      setShowErrorConfirmation(true);
      return;
    }

    try {
      setIsLoading(true);
      
      const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        nic: formData.nic,
        password: formData.password,
        schoolId: parseInt(formData.schoolId.toString())
      };
      
      console.log('Sending guardian data:', requestData);
      
      const response = await fetch(`/api/admin/schools/addGuardian/${formData.schoolId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        console.log('Error data received:', errorData);
        
        // Handle email conflict by suggesting alternative
        if (errorData.error === 'EMAIL_EXISTS' && errorData.suggestedEmail) {
          setFormData(prev => ({
            ...prev,
            email: errorData.suggestedEmail
          }));
          
          setConfirmationMessage(`Email already exists. Using alternative: ${errorData.suggestedEmail}. Please try submitting again.`);
          setShowErrorConfirmation(true);
          return;
        }
        
        // Show detailed error message
        const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: Failed to create guardian`;
        console.error('Guardian creation error:', errorData);
        throw new Error(errorMessage);
      }

      setConfirmationMessage('Guardian added successfully!');
      setShowSuccessConfirmation(true);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nic: '',
        password: '',
        schoolId: preselectedSchool || ''
      });
      
    } catch (error) {
      console.error('Error adding guardian:', error);
      console.error('Error type:', typeof error);
      console.error('Error instanceof Error:', error instanceof Error);
      
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        errorMessage = JSON.stringify(error);
      }
      
      setConfirmationMessage(`Failed to add guardian: ${errorMessage}`);
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
          Add New Guardian
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          {/* Hidden field to prevent auto-fill */}
          <input type="text" style={{ display: 'none' }} autoComplete="off" />
          <input type="password" style={{ display: 'none' }} autoComplete="off" />
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
              Email * (Auto-generated)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              readOnly
              autoComplete="new-email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
              placeholder="Email will be generated automatically"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email is automatically generated as: firstname.guardian@schoolname.lk
            </p>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
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
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              autoComplete="new-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter password (min 6 characters)"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding...' : 'Add Guardian'}
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
          onConfirm={() => {
            setShowSuccessConfirmation(false);
            onSuccess();
          }}
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

export default AddGuardianModal;