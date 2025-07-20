'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import DataTable from '@/app/dashboardComponents/CustomTable';
// Using backend data instead of dummy data
import { School as SchoolIcon, Trash2, MapPin, Users, Eye, Edit, MoreVertical } from 'lucide-react';
import MapLocationPicker from '@/app/components/MapLocationPicker';
import EditSchool from './EditSchool';
import StatCard from '@/app/dashboardComponents/StatCard';
import { FaUser, FaUserCheck, FaUserTimes } from 'react-icons/fa';
import { FaUserClock } from 'react-icons/fa6';

// Define interfaces
interface Location {
  lat: number;
  lng: number;
}

// Define the School interface
interface School {
  id: number;
  schoolName: string;
  email: string;
  contact: string;
  address: string;
  location?: Location;
  [key: string]: string | number | boolean | null | undefined | Location | undefined;
}



const columns = [
  { key: "schoolName", label: "School Name" },
  { key: "email", label: "Email" },
  { key: "contact", label: "Contact" },
  { key: "address", label: "Address" },
  { key: "actions", label: "Actions" }
];

const ManageSchoolsPageContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [editingSchool, setEditingSchool] = useState<number | null>(null);
  const [selectedSchoolData, setSelectedSchoolData] = useState<School | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    contact: '',
    schoolAddress: '',
    schoolLocation: { lat: 7.8731, lng: 80.7718 } // Default to Sri Lanka center
  });

  // Add click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('http://localhost:3000/api/admin/schools/getSchools');
        
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

  const handleEdit = (row: Record<string, string | number | boolean | null | undefined>) => {
    console.log("Edit clicked:", row);
    // Set the selected school for editing
    setEditingSchool(row.id as number);
    
      // Convert row data to School object for the edit form
    const schoolData: School = {
      id: row.id as number,
      schoolName: row.schoolName as string,
      email: row.email as string,
      contact: row.contact as string,
      address: row.address as string,
      // Default location if none provided
      location: { lat: 7.8731, lng: 80.7718 }
    };    setSelectedSchoolData(schoolData);
  };

  const handleDelete = (row: Record<string, string | number | boolean | null | undefined>) => {
    console.log("Delete clicked:", row);
    
    if (window.confirm(`Are you sure you want to delete ${row.schoolName}?`)) {
      const deleteSchool = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`http://localhost:3000/api/admin/schools/deleteSchool?id=${row.id}`, { 
            method: 'DELETE' 
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
          }
          
          setSchools(prevSchools => prevSchools.filter(school => school.id !== row.id));
          alert('School deleted successfully');
        } catch (err) {
          console.error('Failed to delete school:', err);
          const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
          alert(`Failed to delete school: ${errorMessage}`);
        } finally {
          setIsLoading(false);
        }
      };
      
      deleteSchool();
    }
  };
  
  const handleViewGuardians = (row: Record<string, string | number | boolean | null | undefined>) => {
    console.log("View guardians for:", row);
    alert(`View guardians for ${row.schoolName}`);
    // In real implementation, navigate to guardians page or show modal
  };

  const handleAddGuardian = (row: Record<string, string | number | boolean | null | undefined>) => {
    console.log("Add guardian for:", row);
    alert(`Add guardian for ${row.schoolName}`);
    // In real implementation, navigate to add guardian page or show modal
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
      alert("Please enter a valid email address.");
      return;
    }

    // Phone validation with more flexibility for international formats
    const phoneRegex = /^(\+?[0-9]{1,3}[-\s.]?)?([0-9]{3,}[-\s.]?){1,2}[0-9]{3,}$/;
    if (!phoneRegex.test(formData.contact)) {
      alert("Please enter a valid contact number.");
      return;
    }

    console.log("Form submitted:", formData);

    try {
      // Prepare the data to match the API structure
      const schoolData = {
        schoolName: formData.schoolName,
        email: formData.email,
        contact: formData.contact,
        address: formData.schoolAddress,
        location: formData.schoolLocation
      };

      // Send POST request to the API
      const response = await fetch('http://localhost:3000/api/admin/schools/addAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schoolData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log("School added successfully:", data);
      
      // Add the new school to the state
      const newSchool: School = {
        id: data.id || Math.floor(Math.random() * 10000), // Use returned ID or generate one for demo
        schoolName: schoolData.schoolName,
        email: schoolData.email,
        contact: schoolData.contact,
        address: schoolData.address,
        location: schoolData.location
      };
      
      setSchools(prevSchools => [...prevSchools, newSchool]);
      
      alert("School added successfully!");

      // Clear form after submission
      setFormData({
        schoolName: '',
        email: '',
        contact: '',
        schoolAddress: '',
        schoolLocation: { lat: 7.8731, lng: 80.7718 } // Reset to Sri Lanka center
      });
    } catch (err) {
      console.error("Failed to add school:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add school';
      alert(`Failed to add school: ${errorMessage}`);
    }
  };

  const handleClearForm = () => {
    setFormData({
      schoolName: '',
      email: '',
      contact: '',
      schoolAddress: '',
      schoolLocation: { lat: 7.8731, lng: 80.7718 } // Reset to Sri Lanka center
    });
  };

  // Function to handle successful edit
  const handleEditSuccess = async () => {
    setEditingSchool(null);
    setSelectedSchoolData(null);
    
    // Refetch schools data
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3000/api/admin/schools/getSchools');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setSchools(data);
    } catch (err) {
      console.error('Failed to refresh schools:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh schools data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div>
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
          {/** Dummy guardian stats for demonstration. Replace with real data as needed. */}
          {(() => {
            // Dummy data for demonstration
            const guardians: any[] = ["hello", "this", "is", "just", "to", "test"];
            const activeGuardians = 29;
            const pendingGuardians = 450;
            const inactiveGuardians = 0;
            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={<FaUser className="text-xl" />} text="Total School" number={guardians.length} />
                <StatCard icon={<FaUserCheck className="text-xl" />} text="Total Guardians" number={activeGuardians} />
                <StatCard icon={<FaUserClock className="text-xl" />} text="Total Students" number={pendingGuardians} />
                <StatCard icon={<FaUserTimes className="text-xl" />} text="Inactive" number={inactiveGuardians} />
              </div>
            );
          })()}

          {/* Split Layout Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            
            
            {/* Left Side - Add School Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <SchoolIcon className="mr-2 text-yellow-400" size={24} />
                  <h2 className="text-xl font-semibold text-gray-800">Add New School</h2>
                </div>
                
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
                    <div className="border border-gray-300 rounded-md">
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
                      className="flex-1 bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      Add School
                    </button>
                    <button
                      type="button"
                      onClick={handleClearForm}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Side - Schools Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">Schools List</h2>
                  <p className="text-sm text-gray-600">Manage and view all registered schools</p>
                </div>
                
                {/* Search Filter */}
                <div className="p-4 border-b">
                  <div className="max-w-md">
                    <input
                      type="text"
                      placeholder="Search schools by name, ID, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-400 border-t-transparent mb-4"></div>
                    <p className="text-gray-600">Loading schools data...</p>
                  </div>
                ) : error ? (
                  <div className="p-8 text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                      <strong className="font-bold">Error!</strong>
                      <span className="block sm:inline"> {error}</span>
                    </div>
                    <button 
                      onClick={() => window.location.reload()}
                      className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
                    >
                      Try Again
                    </button>
                  </div>
                ) : filteredData.length === 0 && searchTerm === '' ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-600">No schools found. Add a school using the form.</p>
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={filteredData}
                    renderCell={(column, value, row) => {
                    // Custom renderer for actions column
                    if (column === 'actions') {
                      const rowId = row.id as number;
                      const isActive = activeDropdown === rowId;
                      
                      return (
                        <div className="relative">
                          <button
                            onClick={() => setActiveDropdown(isActive ? null : rowId)}
                            className="p-1 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                            title="More Actions"
                          >
                            <MoreVertical size={18} />
                          </button>
                          
                          {isActive && (
                            <div ref={dropdownRef} className="absolute right-0 z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    handleEdit(row);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                                >
                                  <Edit size={16} className="mr-2 text-blue-600" />
                                  Edit School Info
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    handleViewGuardians(row);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                                >
                                  <Eye size={16} className="mr-2 text-blue-600" />
                                  View Guardians
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    handleAddGuardian(row);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                                >
                                  <Users size={16} className="mr-2 text-green-600" />
                                  Add Guardian
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    handleDelete(row);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900 w-full text-left"
                                >
                                  <Trash2 size={16} className="mr-2 text-red-600" />
                                  Delete School
                                </button>
                              </div>
                            </div>
                          )}
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
      </div>
  )
}



export default ManageSchoolsPageContent;
