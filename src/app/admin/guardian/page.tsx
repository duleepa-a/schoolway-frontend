'use client';
import React, { useState } from 'react';
import { FaSearch, FaUser, FaUserCheck, FaUserTimes, FaUserClock, FaEdit, FaTrash } from 'react-icons/fa';
import { IoMdAddCircle } from 'react-icons/io';
import { MdOutlineClose, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import TopBar from '@/app/dashboardComponents/TopBar';
import StatCard from '@/app/dashboardComponents/StatCard';
import FormInput from '@/app/components/FormInput';
import TablePagination from '@/app/components/TablePagination';

interface Guardian {
    id: string;
    name: string;
    email: string;
    phone: string;
    schoolName: string;
    address: string;
    district: string;
    studentsCount: number;
    status: 'Active' | 'Inactive' | 'Pending';
    joinDate: string;
}

const Page = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        schoolName: '',
        address: '',
        district: '',
        emergencyContact: '',
        emergencyPhone: '',
        studentsCount: '',
        licenseNumber: '',
        licenseExpiry: '',
        documents: null as File | null
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Mock data for guardians
    const guardians: Guardian[] = [
        {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@royalcollege.edu',
            phone: '+94 77 123 4567',
            schoolName: 'Royal College',
            address: '123 Main Street, Colombo 07',
            district: 'Colombo',
            studentsCount: 45,
            status: 'Active',
            joinDate: '2024-01-15'
        },
        {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah.j@trinityschool.edu',
            phone: '+94 71 987 6543',
            schoolName: 'Trinity College',
            address: '456 School Road, Kandy',
            district: 'Kandy',
            studentsCount: 32,
            status: 'Active',
            joinDate: '2024-02-20'
        },
        {
            id: '3',
            name: 'Michael Brown',
            email: 'mbrown@stthomas.edu',
            phone: '+94 76 555 0123',
            schoolName: 'St. Thomas College',
            address: '789 Education Lane, Galle',
            district: 'Galle',
            studentsCount: 28,
            status: 'Pending',
            joinDate: '2024-03-10'
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            documents: file
        }));

        if (errors.documents) {
            setErrors(prev => ({ ...prev, documents: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Guardian name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.schoolName.trim()) newErrors.schoolName = 'School name is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.district.trim()) newErrors.district = 'District is required';
        if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
        if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = 'Emergency phone is required';
        if (!formData.studentsCount) newErrors.studentsCount = 'Number of students is required';
        if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
        if (!formData.licenseExpiry.trim()) newErrors.licenseExpiry = 'License expiry date is required';
        if (!formData.documents) newErrors.documents = 'School registration documents are required';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation
        const phoneRegex = /^(\+94|0)[0-9]{9}$/;
        if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid Sri Lankan phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Submitting guardian data:', formData);
            // Handle actual submit logic here (e.g., API call)
            setShowForm(false);
            resetForm();
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            schoolName: '',
            address: '',
            district: '',
            emergencyContact: '',
            emergencyPhone: '',
            studentsCount: '',
            licenseNumber: '',
            licenseExpiry: '',
            documents: null
        });
        setErrors({});
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

    const filteredGuardians = guardians.filter(guardian =>
        guardian.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guardian.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guardian.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'text-green-600 bg-green-100';
            case 'Inactive': return 'text-red-600 bg-red-100';
            case 'Pending': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const activeGuardians = guardians.filter(g => g.status === 'Active').length;
    const pendingGuardians = guardians.filter(g => g.status === 'Pending').length;
    const inactiveGuardians = guardians.filter(g => g.status === 'Inactive').length;

    return (
        <section className="p-6 md:p-10 min-h-screen w-full">
            <TopBar heading="School Guardians" />

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={<FaUser className="text-xl" />} text="Total Guardians" number={guardians.length} />
                <StatCard icon={<FaUserCheck className="text-xl" />} text="Active" number={activeGuardians} />
                <StatCard icon={<FaUserClock className="text-xl" />} text="Pending" number={pendingGuardians} />
                <StatCard icon={<FaUserTimes className="text-xl" />} text="Inactive" number={inactiveGuardians} />
            </div>

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
                <TablePagination totalPages={Math.ceil(filteredGuardians.length / 10)} />
            </div>

            {/* Guardians Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Guardian Info
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                School Details
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Students
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredGuardians.map((guardian) => (
                            <tr key={guardian.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{guardian.name}</div>
                                        <div className="text-sm text-gray-500">ID: {guardian.id}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{guardian.schoolName}</div>
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <MdLocationOn className="mr-1" />
                                            {guardian.district}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="text-sm text-gray-900 flex items-center">
                                            <MdEmail className="mr-1" />
                                            {guardian.email}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <MdPhone className="mr-1" />
                                            {guardian.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{guardian.studentsCount}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(guardian.status)}`}>
                      {guardian.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(guardian)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(guardian)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
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
                            {/* Guardian Information Section */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Guardian Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput
                                        label="Guardian Name"
                                        name="name"
                                        placeholder="Enter guardian's full name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        error={errors.name}
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
                                    <FormInput
                                        label="Phone Number"
                                        name="phone"
                                        placeholder="+94 77 123 4567"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        error={errors.phone}
                                    />
                                    <FormInput
                                        label="Emergency Contact Name"
                                        name="emergencyContact"
                                        placeholder="Emergency contact person"
                                        value={formData.emergencyContact}
                                        onChange={handleInputChange}
                                        error={errors.emergencyContact}
                                    />
                                    <FormInput
                                        label="Emergency Phone"
                                        name="emergencyPhone"
                                        placeholder="+94 71 987 6543"
                                        value={formData.emergencyPhone}
                                        onChange={handleInputChange}
                                        error={errors.emergencyPhone}
                                    />
                                </div>
                            </div>

                            {/* School Information Section */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">School Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput
                                        label="School Name"
                                        name="schoolName"
                                        placeholder="Enter school name"
                                        value={formData.schoolName}
                                        onChange={handleInputChange}
                                        error={errors.schoolName}
                                    />
                                    <div>
                                        <label className="block mb-1 font-medium">District</label>
                                        <select
                                            name="district"
                                            value={formData.district}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                        >
                                            <option value="">Select District</option>
                                            <option value="Colombo">Colombo</option>
                                            <option value="Kandy">Kandy</option>
                                            <option value="Galle">Galle</option>
                                            <option value="Matara">Matara</option>
                                            <option value="Kurunegala">Kurunegala</option>
                                            <option value="Anuradhapura">Anuradhapura</option>
                                            <option value="Ratnapura">Ratnapura</option>
                                            <option value="Badulla">Badulla</option>
                                            <option value="Batticaloa">Batticaloa</option>
                                            <option value="Jaffna">Jaffna</option>
                                        </select>
                                        {errors.district && (
                                            <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <FormInput
                                            label="School Address"
                                            name="address"
                                            placeholder="Enter complete school address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            error={errors.address}
                                        />
                                    </div>
                                    <FormInput
                                        label="Number of Students"
                                        name="studentsCount"
                                        type="number"
                                        placeholder="e.g. 45"
                                        value={formData.studentsCount}
                                        onChange={handleInputChange}
                                        error={errors.studentsCount}
                                    />
                                </div>
                            </div>

                            {/* License Information Section */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">License & Documentation</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput
                                        label="School License Number"
                                        name="licenseNumber"
                                        placeholder="Enter license number"
                                        value={formData.licenseNumber}
                                        onChange={handleInputChange}
                                        error={errors.licenseNumber}
                                    />
                                    <FormInput
                                        label="License Expiry Date"
                                        name="licenseExpiry"
                                        type="date"
                                        placeholder=""
                                        value={formData.licenseExpiry}
                                        onChange={handleInputChange}
                                        error={errors.licenseExpiry}
                                    />
                                    <div className="md:col-span-2">
                                        <label className="block mb-1 font-medium">School Registration Documents</label>
                                        <input
                                            type="file"
                                            name="documents"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Upload school registration certificate, license, or other relevant documents
                                        </p>
                                        {errors.documents && (
                                            <p className="text-red-500 text-sm mt-1">{errors.documents}</p>
                                        )}
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
        </section>
    );
};

export default Page;