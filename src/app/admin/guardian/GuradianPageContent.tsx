'use client';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { IoMdAddCircle } from 'react-icons/io';
import { MdOutlineClose, MdEmail, MdLocationOn } from "react-icons/md";
import FormInput from '@/app/components/FormInput';
import DataTable from '@/app/dashboardComponents/CustomTable';

interface Guardian {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    schoolName: string;
    phone?: string;
    activeStatus : boolean;
    createdAt: string;
    updatedAt: string;
}

const GuradianPageContent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [schools, setSchools] = useState<{ id: string | number; name: string }[]>([]);
    const [isLoadingSchools, setIsLoadingSchools] = useState(false);
    const [guardiansList, setGuardiansList] = useState<Guardian[]>([]);
    const [isLoadingGuardians, setIsLoadingGuardians] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        schoolName: '',
        schoolId: '',
        phone: '',
        password: '',
        activeStatus: true
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initial mock data for guardians
    const initialGuardians: Guardian[] = [
        {
            id: '1',
            firstname: 'John',
            lastname: 'Smith',
            email: 'john.smith@royalcollege.edu',
            phone: '+94 77 123 4567',
            schoolName: 'Royal College',
            activeStatus: true,
            createdAt: '2025-06-15T10:30:00Z',
            updatedAt: '2025-07-10T14:22:00Z'
        },
        {
            id: '2',
            firstname: 'Sarah',
            lastname: 'Johnson',
            email: 'sarah.j@trinityschool.edu',
            phone: '+94 71 987 6543',
            schoolName: 'Trinity College',
            activeStatus: true,
            createdAt: '2025-05-22T09:15:00Z',
            updatedAt: '2025-06-30T11:45:00Z'
        },
        {
            id: '3',
            firstname: 'Michael',
            lastname: 'Brown',
            email: 'mbrown@stthomas.edu',
            phone: '+94 76 555 0123',
            schoolName: 'St. Thomas College',
            activeStatus: false,
            createdAt: '2025-07-01T16:20:00Z',
            updatedAt: '2025-07-01T16:20:00Z'
        }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
        if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
        if (!formData.schoolId) newErrors.schoolName = 'Please select a school';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                console.log('Submitting guardian data:', {
                    ...formData,
                    schoolId: formData.schoolId // Use the ID directly as it might be a string UUID
                });
                
                // Make API call to create guardian using the endpoint
                const response = await fetch(`/api/admin/schools/addGuardian/${formData.schoolId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        firstname: formData.firstname,
                        lastname: formData.lastname,
                        email: formData.email,
                        phone: formData.phone,
                        password: formData.password
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to create guardian');
                }
                
                const data = await response.json();
                console.log('Guardian created successfully:', data);
                
                setShowForm(false);
                resetForm();
                
                // Refresh the guardians list
                setRefreshTrigger(prev => prev + 1);
                
                // Show success message
                alert('Guardian created successfully!');
                
            } catch (error) {
                console.error('Error creating guardian:', error);
                // Handle error (e.g., show error message)
                alert(`Failed to create guardian: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            firstname: '',
            lastname: '',
            email: '',
            schoolName: '',
            schoolId: '',
            phone: '',
            password: '',
            activeStatus: true
        });
        setErrors({});
    };

    // Fetch schools from API
    useEffect(() => {
        const fetchSchools = async () => {
            try {
                setIsLoadingSchools(true);
                const response = await fetch('/api/admin/schools/getSchools');
                if (!response.ok) throw new Error('Failed to fetch schools');
                
                const data = await response.json();
                // The response format now matches our expected structure directly
                // since the API already returns { id, name } format
                
                // Set the schools directly from the API response
                setSchools(data.schools || []);
            } catch (error) {
                console.error('Error fetching schools:', error);
            } finally {
                setIsLoadingSchools(false);
            }
        };

        fetchSchools();
    }, []);

    // Fetch guardians from API
    useEffect(() => {
        const fetchGuardians = async () => {
            try {
                setIsLoadingGuardians(true);
                // In a real implementation, you would fetch from your API
                // For now, we'll use the initial mock data
                // const response = await fetch('/api/admin/guardians');
                // if (!response.ok) throw new Error('Failed to fetch guardians');
                // const data = await response.json();
                // setGuardiansList(data.guardians);

                // Using mock data for now
                setGuardiansList(initialGuardians);
            } catch (error) {
                console.error('Error fetching guardians:', error);
            } finally {
                setIsLoadingGuardians(false);
            }
        };

        fetchGuardians();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshTrigger]); // Refetch when refreshTrigger changes

    const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        const selectedSchool = schools.find(school => school.id.toString() === value);
        
        setFormData(prev => ({
            ...prev,
            schoolId: value,
            schoolName: selectedSchool ? selectedSchool.name : ''
        }));

        if (errors.schoolName) {
            setErrors(prev => ({ ...prev, schoolName: '' }));
        }
    };

    const handleAddGuardianClick = () => setShowForm(true);
    const handleCloseForm = () => {
        setShowForm(false);
        resetForm();
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleEdit = (guardian: Guardian) => {
        console.log('Edit guardian:', guardian);
        // Implement edit functionality
    };

    const handleDelete = (guardian: Guardian) => {
        console.log('Delete guardian:', guardian);
        // Implement delete functionality
    };

    // const handleStatusChange = (guardian: Guardian) => {
    //     console.log('Change status for:', guardian);
    //     // Implement status change functionality
    // };

    const filteredGuardians = guardiansList.filter((guardian: Guardian) =>
        `${guardian.firstname} ${guardian.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guardian.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guardian.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // We've removed status column from the table so we don't need this function anymore
    // const getStatusColor = (status: string) => {
    //     switch (status) {
    //         case 'Active': return 'text-green-600 bg-green-100';
    //         case 'Inactive': return 'text-red-600 bg-red-100';
    //         case 'Pending': return 'text-yellow-600 bg-yellow-100';
    //         default: return 'text-gray-600 bg-gray-100';
    //     }
    // };


    return (
        <>

            

            {/* Search and Add Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between lg:justify-start mb-6 gap-4">
                <div className="relative w-full md:w-1/3">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search guardians or schools..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-search-bar-bg"
                    />
                </div>

                <button onClick={handleAddGuardianClick} className="btn-secondary flex items-center gap-2">
                    <span>Add Guardian</span>
                    <IoMdAddCircle className="size-5" />
                </button>
            </div>

            {/* Guardians Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <DataTable 
                    columns={[
                        { key: 'guardianName', label: 'Guardian Name' },
                        { key: 'school', label: 'School' },
                        { key: 'contact', label: 'Contact' },
                        { key: 'Email', label: 'Email' }
                    ]}
                    data={filteredGuardians}
                    itemsPerPageOptions={[5, 10, 25, 50]}
                    defaultItemsPerPage={10}
                    actions={[
                        {
                            type: 'edit',
                            onClick: handleEdit,
                            icon: <FaEdit size={16} />,
                            className: 'text-blue-600 hover:text-blue-900'
                        },
                        {
                            type: 'delete',
                            onClick: handleDelete,
                            icon: <FaTrash size={16} />,
                            className: 'text-red-600 hover:text-red-900'
                        }
                    ]}
                    renderCell={(column, value, row) => {
                        switch (column) {
                            case 'guardianName':
                                return (
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{row.firstname} {row.lastname}</div>
                                        <div className="text-sm text-gray-500">ID: {row.id}</div>
                                    </div>
                                );
                            case 'school':
                                return (
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{row.schoolName}</div>
                                        
                                    </div>
                                );
                            case 'contact':
                                return (
                                    <div className="text-sm text-gray-900 flex items-center">
                                        {row.phone}
                                    </div>
                                );
                            case 'Email':
                                return (
                                    <div className="text-sm text-gray-900 flex items-center">
                                        {row.email}
                                    </div>
                                );
                            default:
                                return value;
                        }
                    }}
                />
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8 relative max-h-[90vh] overflow-y-auto">
                        {/* Close Button */}
                        <button
                            onClick={handleCloseForm}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl cursor-pointer"
                        >
                            <MdOutlineClose className='hover:text-error-color'/>
                        </button>

                        {/* Heading */}
                        <h2 className="text-2xl font-semibold text-active-text mb-6">Add New School Guardian</h2>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <div className="grid grid-cols-1 gap-4">
                                    <FormInput
                                        label="First Name"
                                        name="firstname"
                                        placeholder="Enter guardian's first name"
                                        value={formData.firstname}
                                        onChange={handleInputChange}
                                        error={errors.firstname}
                                    />
                                    <FormInput
                                        label="Last Name"
                                        name="lastname"
                                        placeholder="Enter guardian's last name"
                                        value={formData.lastname}
                                        onChange={handleInputChange}
                                        error={errors.lastname}
                                    />
                                    <FormInput
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        placeholder="guardian@school.edu"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        error={errors.email}
                                    />
                                    {/* <FormInput
                                        label="Password"
                                        name="password"
                                        type="password"
                                        placeholder="Enter password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        error={errors.password}
                                    /> */}
                                    <FormInput
                                        label="Phone Number"
                                        name="phone"
                                        placeholder="Enter phone number (optional)"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                    <div>
                                        <label className="block mb-1 font-medium">School</label>
                                        <select
                                            name="schoolId"
                                            value={formData.schoolId}
                                            onChange={handleSchoolChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                            disabled={isLoadingSchools}
                                        >
                                            <option value="">Select a school</option>
                                            {schools.map(school => (
                                                <option key={school.id} value={school.id}>
                                                    {school.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.schoolName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>
                                        )}
                                        {isLoadingSchools && <p className="text-gray-500 text-sm mt-1">Loading schools...</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center space-x-4">
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-secondary px-8 py-2"
                                >
                                    Add Guardian
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default GuradianPageContent;