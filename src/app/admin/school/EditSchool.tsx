'use client';
import { useState, useEffect } from 'react';
import { School as SchoolIcon, X } from 'lucide-react';
import ConfirmationBox from '@/app/dashboardComponents/ConfirmationBox';

interface Location {
  lat: number;
  lng: number;
}

interface School {
  id: number;
  schoolName: string;
  email: string;
  contact: string;
  address: string;
  location?: Location;
}

interface EditSchoolProps {
  schoolId: number | null;
  initialData?: School | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditSchool = ({ schoolId, initialData, onClose, onSuccess }: EditSchoolProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Confirmation dialog states
  const [showSuccessConfirmation, setShowSuccessConfirmation] = useState(false);
  const [showErrorConfirmation, setShowErrorConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    contact: '',
    schoolAddress: ''
  });

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      if (initialData) {
        // If initial data is provided, use it directly
        setFormData({
          schoolName: initialData.schoolName || '',
          email: initialData.email || '',
          contact: initialData.contact || '',
          schoolAddress: initialData.address || ''
        });
        return;
      }

      if (!schoolId) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/admin/schools/getSchool?id=${schoolId}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        setFormData({
          schoolName: data.schoolName || '',
          email: data.email || '',
          contact: data.contact || '',
          schoolAddress: data.address || ''
        });
      } catch (err) {
        console.error('Failed to fetch school details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load school data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSchoolDetails();
  }, [schoolId, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setConfirmationMessage("Please enter a valid email address.");
      setShowErrorConfirmation(true);
      return;
    }

    // Phone validation with more flexibility for international formats
    const phoneRegex = /^(\+?[0-9]{1,3}[-\s.]?)?([0-9]{3,}[-\s.]?){1,2}[0-9]{3,}$/;
    if (!phoneRegex.test(formData.contact)) {
      setConfirmationMessage("Please enter a valid contact number.");
      setShowErrorConfirmation(true);
      return;
    }

    if (!schoolId) {
      setConfirmationMessage("School ID is missing.");
      setShowErrorConfirmation(true);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Prepare the data to match the API structure
      const schoolData = {
        id: schoolId,
        schoolName: formData.schoolName,
        email: formData.email,
        contact: formData.contact,
        address: formData.schoolAddress
      };

      // Send PUT request to the API
      const response = await fetch('/api/admin/schools/updateSchool', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schoolData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      await response.json();
      setConfirmationMessage("School information updated successfully!");
      setShowSuccessConfirmation(true);
      
      // Close the edit modal after a short delay to show success message
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      console.error("Failed to update school:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update school';
      setError(errorMessage);
      setConfirmationMessage(`Failed to update school: ${errorMessage}`);
      setShowErrorConfirmation(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 rounded-t-xl" style={{ background: 'linear-gradient(90deg, #0099cc 0%, #00bcd4 60%, #00d4aa 100%)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <SchoolIcon className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Edit School Information</h2>
                <p className="text-white/80 text-sm">Update school details</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-400 border-t-transparent mb-4"></div>
            <p className="text-gray-600">Loading school data...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
            <button 
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="schoolName" className="block text-sm font-semibold text-gray-700">
                  School Name *
                </label>
                <input
                  type="text"
                  id="schoolName"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white"
                  style={{ '--tw-ring-color': '#00d4aa' } as React.CSSProperties}
                  onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  placeholder="Enter school name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="schoolAddress" className="block text-sm font-semibold text-gray-700">
                  School Address *
                </label>
                <input
                  type="text"
                  id="schoolAddress"
                  name="schoolAddress"
                  value={formData.schoolAddress}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white"
                  style={{ '--tw-ring-color': '#00d4aa' } as React.CSSProperties}
                  onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  placeholder="Enter school address"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white"
                  style={{ '--tw-ring-color': '#00d4aa' } as React.CSSProperties}
                  onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact" className="block text-sm font-semibold text-gray-700">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white"
                  style={{ '--tw-ring-color': '#00d4aa' } as React.CSSProperties}
                  onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  placeholder="Enter contact number"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center font-semibold shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}
                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.filter = 'brightness(0.95)')}
                  onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                >
                  <SchoolIcon className="mr-2" size={18} />
                  {isLoading ? 'Updating...' : 'Update School'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold border border-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

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

export default EditSchool;
