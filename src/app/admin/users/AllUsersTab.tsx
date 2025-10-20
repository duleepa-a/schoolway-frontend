'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, RefreshCw, Edit3, UserCheck, UserX, Loader2, Users, ToggleLeft, ToggleRight } from 'lucide-react';
import DataTable from '@/app/dashboardComponents/CustomTable';
import ModernPopupForm from './ModernPopupForm';
import ModernConfirmationBox from './ModernConfirmationBox';
import ModernAlert from './ModernAlert';
import LiveToggleButton from './components/LiveToggleButton';
import { useUsers } from '@/hooks/useUsers';

export default function AllUsersTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<'Active' | 'Inactive'>('Active');

  // Modern alert state
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    variant: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    variant: 'info',
    title: '',
    message: ''
  });

  const showAlert = (variant: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setAlert({
      isOpen: true,
      variant,
      title,
      message
    });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  // Fetch all users regardless of role
  const { users, loading, error, updateUser, toggleUserStatus } = useUsers({
    userRole: 'all' as any,
    searchTerm,
    statusFilter: selectedStatus,
    roleFilter: selectedRole || ''
  });

  // Define form fields for the edit user popup
  const userFormFields = [
    {
      name: 'Name',
      label: 'Full Name',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter full name'
    },
    {
      name: 'Email',
      label: 'Email Address',
      type: 'email' as const,
      required: true,
      placeholder: 'Enter email address'
    },
    {
      name: 'Mobile',
      label: 'Mobile Number',
      type: 'tel' as const,
      required: false,
      placeholder: 'Enter mobile number'
    },
    {
      name: 'Address',
      label: 'Address',
      type: 'text' as const,
      required: false,
      placeholder: 'Enter address'
    },
    {
      name: 'NIC',
      label: 'NIC Number',
      type: 'text' as const,
      required: false,
      placeholder: 'Enter NIC number'
    }
  ];

  const editActionButtons = [
    {
      label: 'Cancel',
      type: 'button' as const,
      variant: 'secondary' as const,
      onClick: () => setIsEditPopupOpen(false)
    },
    {
      label: 'Update User',
      type: 'submit' as const,
      variant: 'primary' as const
    }
  ];

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedRole('');
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditPopupOpen(true);
  };

  const handleStatusToggle = (user: any) => {
    // Prevent toggling for admin users
    if (user.Role === 'admin') {
      return;
    }
    
    setUserToUpdate(user);
    setNewStatus(user.Status === 'Active' ? 'Inactive' : 'Active');
    setIsStatusConfirmOpen(true);
  };

  const confirmStatusChange = async () => {
    if (userToUpdate) {
      try {
        const success = await toggleUserStatus(userToUpdate.User_ID, newStatus === 'Active');
        if (success) {
          showAlert('success', 'Status Updated', `${userToUpdate.Name} has been ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully!`);
        } else {
          showAlert('error', 'Update Failed', `Failed to ${newStatus === 'Active' ? 'activate' : 'deactivate'} ${userToUpdate.Name}. Please try again.`);
        }
        setIsStatusConfirmOpen(false);
        setUserToUpdate(null);
      } catch (error) {
        console.error('Error toggling user status:', error);
        showAlert('error', 'Update Failed', `Failed to ${newStatus === 'Active' ? 'activate' : 'deactivate'} ${userToUpdate.Name}. Please try again.`);
        setIsStatusConfirmOpen(false);
        setUserToUpdate(null);
      }
    }
  };

  const cancelStatusChange = () => {
    setIsStatusConfirmOpen(false);
    setUserToUpdate(null);
  };

  const handleFormSubmit = async (formData: any) => {
    if (selectedUser) {
      try {
        const success = await updateUser(selectedUser.User_ID, formData);
        if (success) {
          showAlert('success', 'User Updated', `${selectedUser.Name}'s information has been updated successfully!`);
          setIsEditPopupOpen(false);
          setSelectedUser(null);
        } else {
          showAlert('error', 'Update Failed', `Failed to update ${selectedUser.Name}'s information. Please try again.`);
        }
      } catch (error) {
        console.error('Error updating user:', error);
        showAlert('error', 'Update Failed', `Failed to update ${selectedUser.Name}'s information. Please try again.`);
      }
    }
  };

  const renderCell = (column: string, value: any, row: any) => {
    if (column === 'ProfilePicture') {
      return (
        <div className="flex items-center justify-center">
          <img 
            src={value || '/Images/male_pro_pic_placeholder.png'} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              e.currentTarget.src = '/Images/male_pro_pic_placeholder.png';
            }}
          />
        </div>
      );
    }
    if (column === 'Mobile' && value) {
      return (
        <a 
          href={`tel:${value}`} 
          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          {value}
        </a>
      );
    }
    if (column === 'Email' && value) {
      return (
        <a 
          href={`mailto:${value}`} 
          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          {value}
        </a>
      );
    }
    if (column === 'Role' && value) {
      let displayRole = value === 'service' ? 'van service' : value;
      displayRole = displayRole === 'teacher' ? 'guardian' : displayRole;
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          displayRole === 'driver' ? 'bg-blue-100 text-blue-800' :
          displayRole === 'parent' ? 'bg-green-100 text-green-800' :
          displayRole === 'van service' ? 'bg-purple-100 text-purple-800' :
          displayRole === 'admin' ? 'bg-red-100 text-red-800' :
          displayRole === 'guardian' ? 'bg-orange-100 text-orange-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {displayRole.charAt(0).toUpperCase() + displayRole.slice(1)}
        </span>
      );
    }
    if (column === 'Actions') {
      return (
        <div className="flex items-center gap-3">
          {/* Edit Button */}
          <button
            onClick={() => handleEdit(row)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 font-medium text-sm"
            title="Edit user"
          >
            <Edit3 size={16} />
            Edit
          </button>
          
          {/* Live Toggle Button */}
          <LiveToggleButton
            isActive={row.Status === 'Active'}
            onToggle={() => handleStatusToggle(row)}
            size="md"
            disabled={row.Role === 'admin'}
          />
        </div>
      );
    }
    return String(value ?? '');
  };

  const columns = [
    { key: "ProfilePicture", label: "Photo" },
    { key: "Name", label: "Name" },
    { key: "Email", label: "Email" },
    { key: "NIC", label: "NIC" },
    { key: "Address", label: "Address" },
    { key: "Role", label: "Role" },
    { key: "Actions", label: "Actions" },
  ];

  return (
    <div className="p-6">
      {/* Modern Search and Filter Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or NIC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none min-w-[140px]"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none min-w-[140px]"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="driver">Driver</option>
                <option value="parent">Parent</option>
                <option value="van owner">Van Service Owner</option>
                <option value="teacher">Guardian</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw size={16} />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-lg mr-3">
              <UserX className="text-red-600" size={20} />
            </div>
            <div>
              <h3 className="text-red-800 font-semibold">Error</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin text-blue-600" size={24} />
            <span className="text-gray-600">Loading all users...</span>
          </div>
        </div>
      )}

      {/* Users Table */}
      {!loading && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <DataTable
            columns={columns}
            data={users}
            renderCell={renderCell}
          />
        </div>
      )}

      {/* Edit User Modal */}
      <ModernPopupForm
        isOpen={isEditPopupOpen}
        heading="Edit User"
        fields={userFormFields}
        actionButtons={editActionButtons}
        initialData={selectedUser || undefined}
        onClose={() => setIsEditPopupOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Status Change Confirmation */}
      <ModernConfirmationBox
        isOpen={isStatusConfirmOpen}
        title={`${newStatus === 'Active' ? 'Activate' : 'Deactivate'} User`}
        confirmationMessage={`Are you sure you want to ${newStatus === 'Active' ? 'activate' : 'deactivate'} this user?`}
        objectName={userToUpdate ? `${userToUpdate.Name} (${userToUpdate.User_ID})` : ''}
        message={`This will ${newStatus === 'Active' ? 'enable' : 'disable'} the user's access to the system.`}
        onConfirm={confirmStatusChange}
        onCancel={cancelStatusChange}
        confirmText={newStatus === 'Active' ? 'Activate' : 'Deactivate'}
        cancelText="Cancel"
      />

      {/* Modern Alert */}
      <ModernAlert
        isOpen={alert.isOpen}
        variant={alert.variant}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
      />
    </div>
  );
}
