'use client';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { IoMdAddCircle } from 'react-icons/io';
import { MdOutlineClose, MdEmail, MdLocationOn } from "react-icons/md";
import FormInput from '@/app/components/FormInput';
import DataTable from '@/app/dashboardComponents/CustomTable';
import ConfirmationBox from '@/app/dashboardComponents/ConfirmationBox';
import EditGuardianModal from '../school/components/EditGuardianModal';

interface Guardian {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    schoolName: string;
    phone?: string;
    schoolId: number;
    createdAt: string;
    updatedAt: string;
}

interface SchoolData {
    id: string | number;
    name?: string;
    schoolName?: string;
    // Only include properties we actually use
}

// API data structure for guardians
interface GuardianInfoApi {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    schoolName: string;
    schoolId: number;
    createdAt: string;
    updatedAt: string;
}

const GuradianPageContent = () => {
    // Fix: define handleSearchChange for search input
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };
    // Actual delete function
    const confirmDelete = async () => {
        if (!guardianToDelete) return;
        
        try {
            const response = await fetch(`/api/admin/guardian?id=${guardianToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            // Remove the guardian from the local state
            setGuardiansInfo(prev => prev.filter(guardian => guardian.id !== guardianToDelete.id));
            
            setShowDeleteConfirmation(false);
            setGuardianToDelete(null);
            setConfirmationMessage('Guardian deleted successfully!');
            setShowSuccessConfirmation(true);
        } catch (error) {
            console.error('Failed to delete guardian:', error);
            setShowDeleteConfirmation(false);
            setGuardianToDelete(null);
            setConfirmationMessage(`Failed to delete guardian: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setShowErrorConfirmation(true);
        }
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [schools, setSchools] = useState<SchoolData[]>([]);
    const [isLoadingSchools, setIsLoadingSchools] = useState(false);
    const [guardiansInfo, setGuardiansInfo] = useState<GuardianInfoApi[]>([]);
    const [isLoadingGuardians, setIsLoadingGuardians] = useState(false);
    const [selectedSchoolId, setSelectedSchoolId] = useState('');
    
    // Confirmation dialog states
    const [showSuccessConfirmation, setShowSuccessConfirmation] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showErrorConfirmation, setShowErrorConfirmation] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [guardianToDelete, setGuardianToDelete] = useState<Guardian | null>(null);
    
    // Edit modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedGuardianForEdit, setSelectedGuardianForEdit] = useState<Guardian | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        schoolName: '',
        schoolId: '',
        phone: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initial mock data for guardians
    
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

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!selectedSchoolId) newErrors.schoolName = 'Please select a school';

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
                // Create request payload for new API
                const requestPayload = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone || '',
                    schoolId: parseInt(selectedSchoolId)
                };

                const response = await fetch('/api/admin/guardian', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestPayload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to create guardian');
                }

                // Process the response
                setShowForm(false);
                resetForm();

                // Refetch guardians to update table
                fetchGuardians();

                // Show success message with confirmation box
                setConfirmationMessage('Guardian created successfully!');
                setShowSuccessConfirmation(true);

            } catch (error) {
                console.error('Error creating guardian:', error);
                // Show error message with confirmation box
                setConfirmationMessage(`Failed to create guardian: ${error instanceof Error ? error.message : 'Unknown error'}`);
                setShowErrorConfirmation(true);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            schoolName: '',
            schoolId: '',
            phone: ''
        });
        setSelectedSchoolId('');
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
                
                if (Array.isArray(data)) {
                    // Handle case where API returns array directly
                    setSchools(data.map((school: SchoolData) => ({
                        id: school.id,
                        name: school.schoolName || school.name || ''
                    })));
                } else if (data.schools && Array.isArray(data.schools)) {
                    // Handle case where API returns { schools: [...] }
                    setSchools(data.schools.map((school: SchoolData) => ({
                        id: school.id,
                        name: school.schoolName || school.name || ''
                    })));
                } else {
                    setSchools([]);
                }
            } catch {
                setSchools([]); // Set empty array on error
            } finally {
                setIsLoadingSchools(false);
            }
        };

        fetchSchools();
    }, []);

    // Fetch guardians from API
    const fetchGuardians = async () => {
        setIsLoadingGuardians(true);
        try {
            const response = await fetch('/api/admin/guardian');
            if (!response.ok) throw new Error('Failed to fetch guardians');
            const data = await response.json();
            if (Array.isArray(data)) {
                setGuardiansInfo(data);
            } else if (data.guardians && Array.isArray(data.guardians)) {
                setGuardiansInfo(data.guardians);
            } else {
                setGuardiansInfo([]);
            }
        } catch {
            setGuardiansInfo([]);
        } finally {
            setIsLoadingGuardians(false);
        }
    };
    // Remove useEffect dependency so fetchGuardians can be called anywhere
    useEffect(() => {
        fetchGuardians();
    }, []); // Still run on page load, but fetchGuardians is now reusable


    const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        const selectedSchool = schools.find(school => school.id.toString() === value);
        
        setSelectedSchoolId(value); // Set the selected school ID separately
        
        setFormData(prev => ({
            ...prev,
            schoolId: value,
            schoolName: selectedSchool && selectedSchool.name ? selectedSchool.name : ''
        }));

        if (errors.schoolName) {
            setErrors(prev => ({ ...prev, schoolName: '' }));
        }
    };

    const handleAddGuardianClick = () => setShowForm(true);
    const handleCloseForm = () => {
                setShowForm(false);
                resetForm();

                // Refetch guardians to update table
                fetchGuardians();

                // Show success message with confirmation box
                setConfirmationMessage('Guardian created successfully!');
                setShowSuccessConfirmation(true);
    };

    // Table actions (edit/delete) implementation
    const handleEdit = (guardian: GuardianInfoApi) => {
        setSelectedGuardianForEdit(guardian);
        setShowEditModal(true);
    };
    
    const handleDelete = (guardian: GuardianInfoApi) => {
        setGuardianToDelete(guardian as Guardian);
        setShowDeleteConfirmation(true);
    };
    
    const handleEditSuccess = () => {
        setShowEditModal(false);
        setSelectedGuardianForEdit(null);
        fetchGuardians(); // Refresh the guardians list
        setConfirmationMessage('Guardian updated successfully!');
        setShowSuccessConfirmation(true);
    };
    
    const handleEditClose = () => {
        setShowEditModal(false);
        setSelectedGuardianForEdit(null);
    };


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
            <div className="mt-4">
                <DataTable
                    columns={[
                        { key: 'firstName', label: 'First Name' },
                        { key: 'lastName', label: 'Last Name' },
                        { key: 'email', label: 'Email' },
                        { key: 'phone', label: 'Phone' },
                        { key: 'schoolName', label: 'School' }
                    ]}
                    data={guardiansInfo}
                    actions={[
                        {
                            type: 'edit',
                            onClick: handleEdit,
                            label: 'Edit',
                        },
                        {
                            type: 'delete',
                            onClick: handleDelete,
                            label: 'Delete',
                        }
                    ]}
                    renderCell={(column, value) => {
                        if (column === 'email') {
                            return (
                                <span className="flex items-center gap-1">
                                    <MdEmail className="inline-block text-gray-500" />
                                    {value}
                                </span>
                            );
                        }
                        if (column === 'schoolName') {
                            return (
                                <span className="flex items-center gap-1">
                                    <MdLocationOn className="inline-block text-gray-500" />
                                    {value}
                                </span>
                            );
                        }
                        return value;
                    }}
                />
                {isLoadingGuardians && (
                    <div className="text-center py-4 text-gray-500">Loading guardians...</div>
                )}
                {!isLoadingGuardians && guardiansInfo.length === 0 && (
                    <div className="text-center py-4 text-gray-500">No guardians found.</div>
                )}
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
                                        name="firstName"
                                        placeholder="Enter guardian's first name"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        error={errors.firstName}
                                    />
                                    <FormInput
                                        label="Last Name"
                                        name="lastName"
                                        placeholder="Enter guardian's last name"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        error={errors.lastName}
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
                                        placeholder="Enter phone number (optional)"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                    <div>
                                        <label className="block mb-1 font-medium">School</label>
                                        <select
                                            name="schoolId"
                                            value={selectedSchoolId}
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

            {/* Success Confirmation Dialog */}
            <ConfirmationBox
                isOpen={showSuccessConfirmation}
                variant='success'
                title="success"
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

            {/* Delete Confirmation Dialog */}
            <ConfirmationBox
                isOpen={showDeleteConfirmation}
                title="Confirm Deletion"
                variant='warning'
                confirmationMessage="Are you sure you want to delete this guardian? This action cannot be undone."
                objectName={guardianToDelete ? `${guardianToDelete.firstName} ${guardianToDelete.lastName}` : ''}
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteConfirmation(false)}
                confirmText="Delete"
                cancelText="Cancel"
            />

            {/* Edit Guardian Modal */}
            {showEditModal && selectedGuardianForEdit && (
                <EditGuardianModal
                    isOpen={showEditModal}
                    onClose={handleEditClose}
                    onSuccess={handleEditSuccess}
                    guardian={selectedGuardianForEdit}
                />
            )}
        </>
    );
};

export default GuradianPageContent;