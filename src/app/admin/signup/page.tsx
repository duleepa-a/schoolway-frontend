'use client';
import React, { useState } from 'react';
import { FaSearch, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaLock, FaIdCard, FaUpload } from 'react-icons/fa';
import { IoMdAddCircle } from 'react-icons/io';
import { MdOutlineClose } from "react-icons/md";
import TopBar from '@/app/dashboardComponents/TopBar';
import FormInput from '@/app/components/FormInput';
import TablePagination from '@/app/components/TablePagination';

// Admin Card Component
const AdminCard = ({ admin, setEditAdmin, setViewAdmin }: { admin: any; setEditAdmin: (admin: any) => void; setViewAdmin: (admin: any) => void }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                {admin.profileImage ? (
                    <img src={admin.profileImage} alt={admin.name} className="w-full h-full object-cover" />
                ) : (
                    <FaUser className="text-gray-500 text-2xl" />
                )}
            </div>
            <div>
                <h3 className="font-semibold text-lg text-gray-900">{admin.name}</h3>
                <p className="text-gray-600">{admin.email}</p>
            </div>
        </div>

        <div className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-gray-600">Department:</span>
                <span className="font-medium">{admin.department}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium">{admin.role}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{admin.phone}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                    admin.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                }`}>
          {admin.status}
        </span>
            </div>
        </div>

        <div className="mt-4 flex space-x-2">
            <button
                onClick={() => setEditAdmin(admin)}
                className="flex-1 btn-secondary py-2 px-3 text-sm"
            >
                Edit
            </button>
            <button
                onClick={() => setViewAdmin(admin)}
                className="btn-small-primary ml-3 text-sm py-2 px-43"
            >
                View
            </button>
        </div>
    </div>
);

const AdminsPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [editAdmin, setEditAdmin] = useState<any>(null);
    const [viewAdmin, setViewAdmin] = useState<any>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nic: '',
        address: '',
        department: '',
        role: '',
        password: '',
        confirmPassword: '',
        profileImage: null as File | null,
        documents: null as File | null
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sample admin data
    const admins = [
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@company.com",
            department: "Operations",
            role: "Admin",
            phone: "+94 77 123 4567",
            status: "Active",
            profileImage: null
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@company.com",
            department: "Customer Service",
            role: "Senior Admin",
            phone: "+94 77 234 5678",
            status: "Active",
            profileImage: null
        },
        {
            id: 3,
            name: "Mike Johnson",
            email: "mike.johnson@company.com",
            department: "IT",
            role: "System Administrator",
            phone: "+94 77 345 6789",
            status: "Inactive",
            profileImage: null
        },
    ];

    const handleAddAdminClick = () => setShowForm(true);
    const handleCloseForm = () => {
        setShowForm(false);
        // Reset form data
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            nic: '',
            address: '',
            department: '',
            role: '',
            password: '',
            confirmPassword: '',
            profileImage: null,
            documents: null
        });
        setErrors({});
    };

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
        const { name } = e.target;
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            [name]: file
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Required field validations
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.nic.trim()) newErrors.nic = 'NIC number is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.department.trim()) newErrors.department = 'Department is required';
        if (!formData.role.trim()) newErrors.role = 'Role is required';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
        if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Confirm password is required';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Phone validation (Sri Lankan format)
        const phoneRegex = /^(\+94|0)[0-9]{9}$/;
        if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid Sri Lankan phone number';
        }

        // NIC validation (Sri Lankan format)
        const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
        if (formData.nic && !nicRegex.test(formData.nic)) {
            newErrors.nic = 'Please enter a valid NIC number (9 digits + V/X or 12 digits)';
        }

        // Password validation
        if (formData.password && formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        // Password complexity validation
        if (formData.password) {
            const hasUpperCase = /[A-Z]/.test(formData.password);
            const hasLowerCase = /[a-z]/.test(formData.password);
            const hasNumbers = /\d/.test(formData.password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

            if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
                newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
            }
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Admin registration data:', formData);

            // Show success message
            alert('Admin registered successfully!');

            // Close form and reset
            handleCloseForm();

        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <section className="p-6 md:p-10 min-h-screen w-full">
            <TopBar heading="My Admins" />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between lg:justify-start mb-4 gap-4">
                <div className="relative w-full md:w-1/3">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search admin"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-search-bar-bg"
                    />
                </div>

                <button onClick={handleAddAdminClick} className="btn-secondary flex items-center gap-2">
                    <span>Add Admin</span>
                    <IoMdAddCircle className="size-5" />
                </button>
                <TablePagination totalPages={5}/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {admins.map((admin) => (
                    <AdminCard key={admin.id} admin={admin} setEditAdmin={setEditAdmin} setViewAdmin={setViewAdmin} />
                ))}
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8 relative my-8 mx-4 max-h-[90vh] overflow-y-auto">
                        {/* Close Button */}
                        <button
                            onClick={handleCloseForm}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl cursor-pointer z-10"
                        >
                            <MdOutlineClose className='hover:text-error-color'/>
                        </button>

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Admin Account</h1>
                            <p className="text-gray-600">Register a new administrator for the system</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information Section */}
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <FaUser className="mr-2" />
                                    Personal Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput
                                        label="First Name"
                                        name="firstName"
                                        placeholder="Enter first name"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        error={errors.firstName}
                                    />

                                    <FormInput
                                        label="Last Name"
                                        name="lastName"
                                        placeholder="Enter last name"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        error={errors.lastName}
                                    />

                                    <FormInput
                                        label="NIC Number"
                                        name="nic"
                                        placeholder="e.g. 123456789V or 123456789012"
                                        value={formData.nic}
                                        onChange={handleInputChange}
                                        error={errors.nic}
                                    />

                                    <FormInput
                                        label="Phone Number"
                                        name="phone"
                                        placeholder="+94 77 123 4567"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        error={errors.phone}
                                    />

                                    <div className="md:col-span-2">
                                        <FormInput
                                            label="Address"
                                            name="address"
                                            placeholder="Enter complete address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            error={errors.address}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Professional Information Section */}
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <FaIdCard className="mr-2" />
                                    Professional Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormInput
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        placeholder="admin@company.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        error={errors.email}
                                    />

                                    <div>
                                        <label className="block mb-1 font-medium text-gray-700">Department</label>
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Department</option>
                                            <option value="Operations">Operations</option>
                                            <option value="Customer Service">Customer Service</option>
                                            <option value="Finance">Finance</option>
                                            <option value="Human Resources">Human Resources</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="IT">IT</option>
                                            <option value="Legal">Legal</option>
                                            <option value="Safety & Compliance">Safety & Compliance</option>
                                        </select>
                                        {errors.department && (
                                            <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block mb-1 font-medium text-gray-700">Role</label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Role</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Senior Admin">Senior Admin</option>
                                            <option value="Department Head">Department Head</option>
                                            <option value="System Administrator">System Administrator</option>
                                            <option value="Content Moderator">Content Moderator</option>
                                            <option value="Support Agent">Support Agent</option>
                                        </select>
                                        {errors.role && (
                                            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Security Information Section */}
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <FaLock className="mr-2" />
                                    Security Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 font-medium text-gray-700">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                placeholder="Enter password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                        )}
                                        <p className="text-sm text-gray-500 mt-1">
                                            Password must be at least 8 characters with uppercase, lowercase, number, and special character
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                placeholder="Confirm password"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={toggleConfirmPasswordVisibility}
                                                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* File Uploads Section */}
                            <div className="pb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <FaUpload className="mr-2" />
                                    Documents & Profile
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 font-medium text-gray-700">Profile Image</label>
                                        <input
                                            type="file"
                                            name="profileImage"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Upload a profile picture (JPG, PNG, max 2MB)
                                        </p>
                                        {errors.profileImage && (
                                            <p className="text-red-500 text-sm mt-1">{errors.profileImage}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block mb-1 font-medium text-gray-700">Supporting Documents</label>
                                        <input
                                            type="file"
                                            name="documents"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Upload CV, certificates, or other relevant documents
                                        </p>
                                        {errors.documents && (
                                            <p className="text-red-500 text-sm mt-1">{errors.documents}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-center space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-secondary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Registering...
                                        </>
                                    ) : (
                                        'Register Admin'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Edit Admin Modal */}
            {editAdmin && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative mx-4">
                        <button
                            onClick={() => setEditAdmin(null)}
                            className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl cursor-pointer"
                        >
                            <MdOutlineClose className='hover:text-error-color'/>
                        </button>

                        <h2 className="text-xl font-semibold text-active-text mb-6">Edit Admin</h2>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                                    <FaUser className="text-gray-500 text-2xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{editAdmin.name}</h3>
                                    <p className="text-gray-600">{editAdmin.email}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="font-medium">Department:</span>
                                    <span>{editAdmin.department}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Role:</span>
                                    <span>{editAdmin.role}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Phone:</span>
                                    <span>{editAdmin.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Status:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        editAdmin.status === 'Active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                    {editAdmin.status}
                  </span>
                                </div>
                            </div>

                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={() => setEditAdmin(null)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="flex-1 btn-secondary px-4 py-2">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Admin Modal */}
            {viewAdmin && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative mx-4">
                        <button
                            onClick={() => setViewAdmin(null)}
                            className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl cursor-pointer"
                        >
                            <MdOutlineClose className='hover:text-error-color'/>
                        </button>

                        <h2 className="text-xl font-semibold text-active-text mb-6">Admin Details</h2>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                                    <FaUser className="text-gray-500 text-2xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{viewAdmin.name}</h3>
                                    <p className="text-gray-600">{viewAdmin.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <span className="font-medium text-gray-700 block">Department</span>
                                    <span className="text-gray-900">{viewAdmin.department}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700 block">Role</span>
                                    <span className="text-gray-900">{viewAdmin.role}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700 block">Phone Number</span>
                                    <span className="text-gray-900">{viewAdmin.phone}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700 block">Status</span>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                                        viewAdmin.status === 'Active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                    {viewAdmin.status}
                  </span>
                                </div>
                            </div>

                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setViewAdmin(null)}
                                    className="btn-secondary px-8 py-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
};

export default AdminsPage;