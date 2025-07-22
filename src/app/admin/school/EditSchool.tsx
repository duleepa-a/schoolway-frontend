'use client';
import { useState, useEffect } from 'react';
import { School as SchoolIcon, MapPin, X } from 'lucide-react';
import MapLocationPicker from '@/app/components/MapLocationPicker';

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
  
  // Form state
  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    contact: '',
    schoolAddress: '',
    schoolLocation: { lat: 7.8731, lng: 80.7718 } // Default to Sri Lanka center
  });

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      if (initialData) {
        // If initial data is provided, use it directly
        setFormData({
          schoolName: initialData.schoolName || '',
          email: initialData.email || '',
          contact: initialData.contact || '',
          schoolAddress: initialData.address || '',
          schoolLocation: initialData.location || { lat: 7.8731, lng: 80.7718 }
        });
        return;
      }

      if (!schoolId) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:3000/api/admin/schools/getSchool?id=${schoolId}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        setFormData({
          schoolName: data.schoolName || '',
          email: data.email || '',
          contact: data.contact || '',
          schoolAddress: data.address || '',
          schoolLocation: data.location || { lat: 7.8731, lng: 80.7718 }
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
      alert("Please enter a valid email address.");
      return;
    }

    // Phone validation with more flexibility for international formats
    const phoneRegex = /^(\+?[0-9]{1,3}[-\s.]?)?([0-9]{3,}[-\s.]?){1,2}[0-9]{3,}$/;
    if (!phoneRegex.test(formData.contact)) {
      alert("Please enter a valid contact number.");
      return;
    }

    if (!schoolId) {
      alert("School ID is missing.");
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
        address: formData.schoolAddress,
        location: formData.schoolLocation
      };

      // Send PUT request to the API
      const response = await fetch('http://localhost:3000/api/admin/schools/updateSchool', {
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
      alert("School information updated successfully!");
      onSuccess();
    } catch (err) {
      console.error("Failed to update school:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update school';
      setError(errorMessage);
      alert(`Failed to update school: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <SchoolIcon className="mr-2 text-yellow-400" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Edit School Information</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X size={24} />
          </button>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">
                  School Name *
                </label>
                <input
                  type="text"
                  id="schoolName"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter school name"
                />
              </div>

              <div>
                <label htmlFor="schoolAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  School Address *
                </label>
                <input
                  type="text"
                  id="schoolAddress"
                  name="schoolAddress"
                  value={formData.schoolAddress}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter school address"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter contact number"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center">
                    <MapPin size={16} className="mr-1 text-yellow-400" />
                    School Location *
                  </span>
                </label>
                <div className="border border-gray-300 rounded-md" style={{ height: '250px' }}>
                  <MapLocationPicker 
                    onLocationSelect={(location) => {
                      setFormData(prev => ({
                        ...prev,
                        schoolLocation: location
                      }));
                    }}
                    initialLocation={formData.schoolLocation}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Search for a location or click on the map to select the exact school location</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-amber-500 transition-colors flex items-center justify-center disabled:bg-yellow-200 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Updating...' : 'Update School'}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default EditSchool;
