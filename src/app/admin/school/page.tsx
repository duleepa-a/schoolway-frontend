'use client';
import { useState, useMemo } from 'react';
import TopBar from '@/app/dashboardComponents/TopBar';
import DataTable from '@/app/dashboardComponents/CustomTable';
import { schoolsData } from '../../../../public/dummy_data/schools';
import { School, Trash2} from 'lucide-react';



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
    schoolId: '',
    email: '',
    guardianName: '',
    contact: ''
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
    // Populate form with selected school data
    setFormData({
      schoolName: row.Name as string || '',
      schoolId: row.User_ID as string || '',
      email: row.Email as string || '',
      guardianName: row.Status as string || '',
      contact: row.Role as string || ''
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("School added successfully!");
    // Clear form after submission
    setFormData({
      schoolName: '',
      schoolId: '',
      email: '',
      guardianName: '',
      contact: ''
    });
  };

  const handleClearForm = () => {
    setFormData({
      schoolName: '',
      schoolId: '',
      email: '',
      guardianName: '',
      contact: ''
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
                    <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 mb-1">
                      School ID *
                    </label>
                    <input
                      type="text"
                      id="schoolId"
                      name="schoolId"
                      value={formData.schoolId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter school ID"
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
                    <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700 mb-1">
                      Principal/Guardian Name *
                    </label>
                    <input
                      type="text"
                      id="guardianName"
                      name="guardianName"
                      value={formData.guardianName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter principal/guardian name"
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
