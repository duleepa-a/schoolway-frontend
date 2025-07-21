'use client';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaLock, FaIdCard, FaUpload } from 'react-icons/fa';
import { MdOutlineClose } from "react-icons/md";
import TopBar from '@/app/dashboardComponents/TopBar';
import FormInput from '@/app/components/FormInput';

const AdminSignUpPage = () => {
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

            // Show success message or redirect
            alert('Admin registered successfully!');

            // Reset form
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
        <section className="p-6 md:p-10 min-h-screen w-full bg-gray-50">
            <TopBar heading="Admin Registration" />

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
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

                        {/* Submit Button */}
                        <div className="flex justify-center space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
        </section>
    );
};

export default AdminSignUpPage;