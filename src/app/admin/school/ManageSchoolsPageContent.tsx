'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import DataTable from '@/app/dashboardComponents/CustomTable';
import { School as SchoolIcon, Trash2, MapPin, Users, Eye, Edit, MoreVertical, Map } from 'lucide-react';
import GateManager from '@/app/admin/school/components/GateManager';
import EditSchool from './EditSchool';
import ManageGuardiansModal from './components/ManageGuardiansModal';
import StatCard from '@/app/dashboardComponents/StatCard';
import ConfirmationBox from '@/app/dashboardComponents/ConfirmationBox';
import { FaUser, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import { FaUserClock } from 'react-icons/fa6';

// Define interfaces
interface Gate {
  id?: number;
  gateName: string;
  latitude: number;
  longitude: number;
  description?: string;
  isActive: boolean;
}

// Define the School interface
interface School {
  id: number;
  schoolName: string;
  email: string;
  contact: string;
  address: string;
  gates?: Gate[];
  [key: string]: string | number | boolean | null | undefined | Gate[] | undefined;
}

const columns = [
  { key: "schoolName", label: "School Name" },
  { key: "address", label: "Address" },
  { key: "email", label: "Email" },
  { key: "contact", label: "Phone" },
  { key: "actions", label: "Actions" }
];

const ManageSchoolsPageContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedSchoolForDropdown, setSelectedSchoolForDropdown] = useState<School | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [editingSchool, setEditingSchool] = useState<number | null>(null);
  const [selectedSchoolData, setSelectedSchoolData] = useState<School | null>(null);

  // Gate management modal state
  const [showGateModal, setShowGateModal] = useState(false);
  const [selectedSchoolForGates, setSelectedSchoolForGates] = useState<School | null>(null);
  
  // Guardian management modal state
  const [showManageGuardiansModal, setShowManageGuardiansModal] = useState(false);
  const [selectedSchoolForGuardians, setSelectedSchoolForGuardians] = useState<School | null>(null);
  
  // Confirmation dialog states
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);
  const [showSuccessConfirmation, setShowSuccessConfirmation] = useState(false);
  const [showErrorConfirmation, setShowErrorConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  
  // Statistics state
  const [statistics, setStatistics] = useState({
    totalSchools: 0,
    totalGuardians: 0,
    totalStudents: 0,
    totalGates: 0,
    activeGates: 0,
    inactiveGates: 0
  });
  

  // Form state (removed location-related fields)
  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    contact: '',
    schoolAddress: ''
  });

  // Current school being added (for gate management)
  const [currentSchoolId, setCurrentSchoolId] = useState<number | null>(null);

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setDropdownPosition(null);
        setSelectedSchoolForDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch statistics data
  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/admin/schools/statistics');
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      } else {
        console.error('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  // Fetch data from API
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/admin/schools');

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid data format received from server');
        }

        setSchools(data);
      } catch (err) {
        console.error('Failed to fetch schools:', err);
        setError(err instanceof Error ? err.message : 'Failed to load schools data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchools();
    fetchStatistics();
  }, []);

  // Filter the data based on search criteria
  const filteredData = useMemo(() => {
    return schools.filter((school) => {
      // Search filter - searches in name, email, and id
      const matchesSearch = searchTerm === '' ||
          school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          school.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          school.id.toString().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [schools, searchTerm]);

  const handleEdit = (school: School) => {
    console.log("Edit clicked:", school);
    // Set the selected school for editing
    setEditingSchool(school.id);

    // Set the school data for the edit form
    setSelectedSchoolData(school);
  };

  const handleDelete = (school: School) => {
    console.log("Delete clicked:", school);
    setSchoolToDelete(school);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteSchool = async () => {
    if (!schoolToDelete) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/schools/deleteSchool?id=${schoolToDelete.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      setSchools(prevSchools => prevSchools.filter(s => s.id !== schoolToDelete.id));
      
      // Refresh statistics
      fetchStatistics();
      
      setShowDeleteConfirmation(false);
      setSchoolToDelete(null);
      setConfirmationMessage('School deleted successfully!');
      setShowSuccessConfirmation(true);
    } catch (err) {
      console.error('Failed to delete school:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setShowDeleteConfirmation(false);
      setSchoolToDelete(null);
      setConfirmationMessage(`Failed to delete school: ${errorMessage}`);
      setShowErrorConfirmation(true);
    } finally {
      setIsLoading(false);
    }
  };


  const handleManageGates = (school: School) => {
    setSelectedSchoolForGates(school);
    setShowGateModal(true);
  };

  const handleManageGuardians = (school: School) => {
    setSelectedSchoolForGuardians(school);
    setShowManageGuardiansModal(true);
  };

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

    console.log("Form submitted:", formData);

    try {
      // Prepare the data to match the API structure (removed location fields)
      const schoolData = {
        schoolName: formData.schoolName,
        email: formData.email,
        contact: formData.contact,
        address: formData.schoolAddress
      };

      console.log("Sending school data:", schoolData);
      console.log("API endpoint:", '/api/admin/schools/addAccount');

      // Send POST request to the API
      const response = await fetch('/api/admin/schools/addAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schoolData)
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log("School added successfully:", data);

      // Add the new school to the state (removed location fields)
      const newSchool: School = {
        id: data.id || Math.floor(Math.random() * 10000),
        schoolName: schoolData.schoolName,
        email: schoolData.email,
        contact: schoolData.contact,
        address: schoolData.address
      };

      setSchools(prevSchools => [...prevSchools, newSchool]);
      setCurrentSchoolId(data.id || newSchool.id);

      // Refresh statistics
      fetchStatistics();

      setConfirmationMessage("School added successfully! You can now add gates for this school.");
      setShowSuccessConfirmation(true);

      // Clear form after submission
      setFormData({
        schoolName: '',
        email: '',
        contact: '',
        schoolAddress: ''
      });
    } catch (err) {
      console.error("Failed to add school:", err);
      console.error("Error details:", {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        name: err instanceof Error ? err.name : undefined
      });
      const errorMessage = err instanceof Error ? err.message : 'Failed to add school';
      setConfirmationMessage(`Failed to add school: ${errorMessage}`);
      setShowErrorConfirmation(true);
    }
  };

  const handleClearForm = () => {
    setFormData({
      schoolName: '',
      email: '',
      contact: '',
      schoolAddress: ''
    });
    setCurrentSchoolId(null);
  };

  // Function to handle successful edit
  const handleEditSuccess = async () => {
    setEditingSchool(null);
    setSelectedSchoolData(null);

    // Refetch schools data
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/admin/schools');

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setSchools(data);
      
      // Refresh statistics
      fetchStatistics();
    } catch (err) {
      console.error('Failed to refresh schools:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh schools data');
    } finally {
      setIsLoading(false);
    }
  };


  return (
      <div>

        {/* Gate Management Modal */}
        {showGateModal && selectedSchoolForGates && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={() => {
                      setShowGateModal(false);
                      setSelectedSchoolForGates(null);
                    }}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl cursor-pointer"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Map className="mr-2 text-blue-500" size={24} />
                  Manage Gates for {selectedSchoolForGates.schoolName}
                </h2>
                <GateManager
                    schoolId={selectedSchoolForGates.id}
                    onGatesUpdate={(gates) => {
                      // Update the school's gates in the local state if needed
                      console.log('Gates updated:', gates);
                    }}
                />
              </div>
            </div>
        )}

        {/* Manage Guardians Modal */}
        {showManageGuardiansModal && selectedSchoolForGuardians && (
            <ManageGuardiansModal
                schoolId={selectedSchoolForGuardians.id}
                schoolName={selectedSchoolForGuardians.schoolName}
                onClose={() => {
                    setShowManageGuardiansModal(false);
                    setSelectedSchoolForGuardians(null);
                }}
            />
        )}

        {/* Edit School Modal */}
        {editingSchool !== null && (
            <EditSchool
                schoolId={editingSchool}
                initialData={selectedSchoolData}
                onClose={() => {
                  setEditingSchool(null);
                  setSelectedSchoolData(null);
                }}
                onSuccess={handleEditSuccess}
            />
        )}


        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-200">
            <div className="p-3 rounded-full" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
              <FaUser className="text-xl text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Schools</p>
              <p className="font-semibold text-lg text-gray-800">{statistics.totalSchools}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-200">
            <div className="p-3 rounded-full" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
              <FaUserCheck className="text-xl text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Guardians</p>
              <p className="font-semibold text-lg text-gray-800">{statistics.totalGuardians}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-200">
            <div className="p-3 rounded-full" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
              <FaUserClock className="text-xl text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Students</p>
              <p className="font-semibold text-lg text-gray-800">{statistics.totalStudents}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-200">
            <div className="p-3 rounded-full" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
              <FaUserTimes className="text-xl text-white" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Gates</p>
              <p className="font-semibold text-lg text-gray-800">{statistics.totalGates}</p>
            </div>
          </div>
        </div>

        {/* Split Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

          {/* Left Side - Add School Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4" style={{ background: 'linear-gradient(90deg, #0099cc 0%, #00bcd4 60%, #00d4aa 100%)' }}>
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-lg mr-3">
                    <SchoolIcon className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Add New School</h2>
                    <p className="text-white/80 text-sm">Register a new school</p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
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
                        className="flex-1 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center font-semibold shadow-md hover:shadow-lg"
                        style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}
                        onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0.95)'}
                        onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                    >
                      <SchoolIcon className="mr-2" size={18} />
                      Add School
                    </button>
                    <button
                        type="button"
                        onClick={handleClearForm}
                        className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold border border-gray-200"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>

              {/* Gate Management Section for newly added school */}
              {currentSchoolId && (
                  <div className="bg-gray-50 p-6 border-t border-gray-200">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <Map className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Add Gates</h3>
                        <p className="text-sm text-gray-600">Configure school entry points</p>
                      </div>
                    </div>
                    <GateManager
                        schoolId={currentSchoolId}
                        onGatesUpdate={(gates) => {
                          console.log('Gates updated for new school:', gates);
                        }}
                    />
                  </div>
              )}
            </div>
          </div>

          {/* Right Side - Schools Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Schools List</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage and view all registered schools</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <SchoolIcon style={{ color: '#00d4aa' }} size={24} />
                  </div>
                </div>
              </div>

              {/* Search Filter */}
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <div className="max-w-md">
                  <div className="relative">
                    <input
                        type="text"
                        placeholder="Search schools by name, ID, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 transition-all duration-200 bg-white"
                        style={{ '--tw-ring-color': '#00d4aa' } as React.CSSProperties}
                        onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {isLoading ? (
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'rgba(0, 212, 170, 0.1)' }}>
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent" style={{ borderColor: '#00d4aa' }}></div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Schools</h3>
                    <p className="text-gray-600">Please wait while we fetch the data...</p>
                  </div>
              ) : error ? (
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Data</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                        style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}
                        onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0.95)'}
                        onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
                    >
                      Try Again
                    </button>
                  </div>
              ) : filteredData.length === 0 && searchTerm === '' ? (
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <SchoolIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Schools Found</h3>
                    <p className="text-gray-600">Get started by adding your first school using the form on the left.</p>
                  </div>
              ) : (
                <DataTable
                    columns={columns}
                    data={filteredData}
                    renderCell={(column, value, row) => {
                      const school = row as School;
                      
                      // Custom renderer for actions column
                      if (column === 'actions') {
                        const rowId = school.id;
                        const isActive = activeDropdown === rowId;

                        return (
                            <div className="relative">
                              <button
                                  onClick={(e) => {
                                    if (isActive) {
                                      setActiveDropdown(null);
                                      setDropdownPosition(null);
                                    } else {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      const dropdownHeight = 300; // Approximate dropdown height
                                      const spaceBelow = window.innerHeight - rect.bottom;
                                      const spaceAbove = rect.top;
                                      
                                      let top, left;
                                      
                                      // If there's not enough space below, position above the button
                                      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
                                        top = rect.top + window.scrollY - dropdownHeight - 8;
                                      } else {
                                        top = rect.bottom + window.scrollY + 8;
                                      }
                                      
                                      // Calculate left position to keep dropdown in viewport
                                      left = Math.min(window.innerWidth - 250, Math.max(20, rect.right - 200));
                                      
                                      setDropdownPosition({ top, left });
                                      setActiveDropdown(rowId);
                                      setSelectedSchoolForDropdown(school);
                                    }
                                  }}
                                  className="p-1 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                                  title="More Actions"
                              >
                                <MoreVertical size={18} />
                              </button>

                            </div>
                        );
                      }

                      // Default rendering
                      return value;
                    }}
                    itemsPerPageOptions={[5, 10, 15]}
                    defaultItemsPerPage={5}
                />
              )}
            </div>
          </div>
        </div>

        {/* Portal-based Dropdown Menu */}
        {activeDropdown && dropdownPosition && createPortal(
          <div 
            ref={dropdownRef} 
            className="fixed z-50 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
            style={{ 
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`
            }}
          >
            <div className="py-2">
              <button
                onClick={() => {
                  setActiveDropdown(null);
                  setDropdownPosition(null);
                  handleEdit(selectedSchoolForDropdown!);
                }}
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left transition-colors duration-150"
              >
                <div className="bg-blue-100 p-1.5 rounded-lg mr-3">
                  <Edit size={14} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Edit School Info</div>
                  <div className="text-xs text-gray-500">Update school details</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveDropdown(null);
                  setDropdownPosition(null);
                  handleManageGates(selectedSchoolForDropdown!);
                }}
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 w-full text-left transition-colors duration-150"
              >
                <div className="bg-green-100 p-1.5 rounded-lg mr-3">
                  <Map size={14} className="text-green-600" />
                </div>
                <div>
                  <div className="font-medium">Manage Gates</div>
                  <div className="text-xs text-gray-500">Configure entry points</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveDropdown(null);
                  setDropdownPosition(null);
                  handleManageGuardians(selectedSchoolForDropdown!);
                }}
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left transition-colors duration-150"
              >
                <div className="bg-blue-100 p-1.5 rounded-lg mr-3">
                  <Users size={14} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Manage Guardians</div>
                  <div className="text-xs text-gray-500">Add and manage guardians</div>
                </div>
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={() => {
                  setActiveDropdown(null);
                  setDropdownPosition(null);
                  handleDelete(selectedSchoolForDropdown!);
                }}
                className="flex items-center px-4 py-3 text-sm text-red-700 hover:bg-red-50 hover:text-red-900 w-full text-left transition-colors duration-150"
              >
                <div className="bg-red-100 p-1.5 rounded-lg mr-3">
                  <Trash2 size={14} className="text-red-600" />
                </div>
                <div>
                  <div className="font-medium">Delete School</div>
                  <div className="text-xs text-red-500">Remove permanently</div>
                </div>
              </button>
            </div>
          </div>,
          document.body
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmationBox
          isOpen={showDeleteConfirmation}
          title="Confirm Deletion"
          variant='warning'
          confirmationMessage="Are you sure you want to delete this school? This action cannot be undone."
          objectName={schoolToDelete ? schoolToDelete.schoolName : ''}
          onConfirm={confirmDeleteSchool}
          onCancel={() => setShowDeleteConfirmation(false)}
          confirmText="Delete"
          cancelText="Cancel"
        />

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
    )
  }
  
  export default ManageSchoolsPageContent;