 'use client'
import TopBar from '@/app/dashboardComponents/TopBar';
import DataTable from '@/app/dashboardComponents/CustomTable';
import { schoolsData } from '../../../../public/dummy_data/schools';
import { School, Trash2, MapPin } from 'lucide-react';
import MapLocationPicker from '@/app/components/MapLocationPicker';
import { useState, useMemo } from 'react';



const columns = [
  { key: "Name", label: "School Name" },
  { key: "User_ID", label: "School ID" },
  { key: "Email", label: "Email" },
  { key: "GuardianName", label: "Guardian Name" },
  { key: "Contact", label: "Contact" },
  { key: "NumberOfStudents", label: "No. of Students" },
  { key: "Status", label: "Status" },
];

const ManageSchoolsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    contact: '',
    schoolAddress: '',
    location: { lat: 0, lng: 0 }
  });

  // Filter the data based on search criteria
  const filteredData = useMemo(() => {
    return schoolsData.filter((school) => {
      // Search filter - searches in name, email, and school ID
      const matchesSearch = searchTerm === '' || 
        school.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.User_ID.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [searchTerm]);

  const handleEdit = (row: Record<string, string | number | boolean | null | undefined>) => {
    console.log("Edit clicked:", row);
    
    // Handle location data - if it exists in the row data
    let locationData = { lat: 0, lng: 0 };
    if (row.location && typeof row.location === 'object') {
      // If location is already an object with lat/lng
      const location = row.location as any;
      if (location.lat && location.lng) {
        locationData = {
          lat: typeof location.lat === 'number' ? location.lat : parseFloat(location.lat as string),
          lng: typeof location.lng === 'number' ? location.lng : parseFloat(location.lng as string)
        };
      }
    }
    
    // Populate form with selected school data
    setFormData({
      schoolName: row.Name as string || '',
      email: row.Email as string || '',
      contact: row.Contact as string || '',
      schoolAddress: row.Address as string || '',
      location: locationData
    });
  };

  const handleDelete = (row: Record<string, string | number | boolean | null | undefined>) => {
    console.log("Delete clicked:", row);
    alert(`Delete school: ${row.Name}?`);
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

    // Phone validation: starts with 07 or 011, and is 10 or 11 digits
    const phoneRegex = /^(07\d{8}|011\d{8})$/;
    if (!phoneRegex.test(formData.contact)) {
      alert("Contact number must start with 07 or 011 and be 10 or 11 digits.");
      return;
    }

    // Validate location
    if (formData.location.lat === 0 && formData.location.lng === 0) {
      alert("Please select a location on the map.");
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
        location: formData.location
      };

      // Send POST request to the API
      const response = await fetch('/api/admin/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schoolData)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("School added successfully:", data);
      alert("School added successfully!");

      // Clear form after submission
      setFormData({
        schoolName: '',
        email: '',
        contact: '',
        schoolAddress: '',
        location: { lat: 0, lng: 0 }
      });
    } catch (error) {
      console.error("Failed to add school:", error);
      alert("Failed to add school. Please try again.");
    }
  };

  const handleClearForm = () => {
    setFormData({
      schoolName: '',
      email: '',
      contact: '',
      schoolAddress: '',
      location: { lat: 0, lng: 0 }
    });
  };

  return (
      <div>
        <section className="p-5 md:p-10 min-h-screen w-full">
          {/*Top bar with profile icon and the heading*/}
          <TopBar heading="Manage Schools" />

          {/* Split Layout Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            
            {/* Left Side - Add School Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <School className="mr-2 text-yellow-400" size={24} />
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
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      School Location *
                    </label>
                    <div className="mt-2">
                      <MapLocationPicker 
                        onLocationSelect={(location) => {
                          setFormData(prev => ({
                            ...prev,
                            location
                          }));
                        }}
                        initialLocation={formData.location.lat !== 0 ? formData.location : null}
                      />
                    </div>
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

                <DataTable
                  columns={columns}
                  data={filteredData}
                  actions={[
                    { 
                      type: "custom", 
                      icon: <School size={16} />,
                      label: "Edit School",
                      className: "text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors",
                      onClick: handleEdit 
                    },
                    { 
                      type: "custom", 
                      icon: <Trash2 size={16} />,
                      label: "Delete School",
                      className: "text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors",
                      onClick: handleDelete 
                    },
                  ]}
                  itemsPerPageOptions={[5, 10, 15]}
                  defaultItemsPerPage={5}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
  )
}



export default ManageSchoolsPage;
