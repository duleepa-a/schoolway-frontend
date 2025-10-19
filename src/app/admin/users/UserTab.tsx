'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, RefreshCw, Edit3, UserCheck, UserX, Loader2 } from 'lucide-react';
import DataTable from '@/app/dashboardComponents/CustomTable';
import ModernPopupForm from './ModernPopupForm';
import ModernConfirmationBox from './ModernConfirmationBox';
import { useUsers } from '@/hooks/useUsers';

interface UserTabProps {
  userRole: 'driver' | 'parent' | 'van owner' | 'admin';
  tabTitle: string;
}

const UserTab = ({ userRole, tabTitle }: UserTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<'Active' | 'Inactive'>('Active');

  // Use the custom hook to fetch users
  const { users, loading, error, updateUser, toggleUserStatus } = useUsers({
    userRole,
    searchTerm,
    statusFilter: selectedStatus
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
      name: 'District',
      label: 'District',
      type: 'text' as const,
      required: false,
      placeholder: 'Enter district'
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
  };

  const handleEdit = (row: Record<string, string | number | boolean | null | undefined>) => {
    setSelectedUser(row);
    setIsEditPopupOpen(true);
  };

  const handleStatusToggle = (row: Record<string, string | number | boolean | null | undefined>) => {
    const user = row as any;
    setUserToUpdate(user);
    setNewStatus(user.Status === 'Active' ? 'Inactive' : 'Active');
    setIsStatusConfirmOpen(true);
  };

  const confirmStatusChange = async () => {
    if (userToUpdate) {
      const success = await toggleUserStatus(userToUpdate.id, newStatus === 'Active');
      if (success) {
        setIsStatusConfirmOpen(false);
        setUserToUpdate(null);
      }
    }
  };

  const cancelStatusChange = () => {
    setIsStatusConfirmOpen(false);
    setUserToUpdate(null);
  };

  const handleFormSubmit = async (data: Record<string, string>) => {
    if (selectedUser) {
      const success = await updateUser(selectedUser.id, data);
      if (success) {
        setIsEditPopupOpen(false);
        setSelectedUser(null);
      }
    }
  };

  const columns = [
    { key: "Name", label: "Name" },
    { key: "User_ID", label: "User ID" },
    { key: "Email", label: "Email" },
    { key: "Status", label: "Status" },
  ];

  return (
    <div className="p-6">
      {/* Modern Search and Filter Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 mb-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={`Search ${tabTitle.toLowerCase()} by name, email, or ID`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 bg-white"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 bg-white appearance-none"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={handleClearFilters}
            className="px-4 py-3 bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <RefreshCw size={16} />
            Clear
          </button>
        </div>
      </div>

      {/* Error Message */}
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
            <span className="text-gray-600">Loading users...</span>
          </div>
        </div>
      )}

      {/* Modern Table */}
      {!loading && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <DataTable
            columns={columns}
            data={users}
            actions={[
              { 
                type: "custom", 
                label: "Edit",
                onClick: handleEdit,
                icon: <Edit3 size={16} className="text-blue-600" />,
                className: "hover:bg-blue-50 text-blue-600"
              },
              { 
                type: "custom", 
                label: "Toggle Status",
                onClick: handleStatusToggle,
                icon: <UserCheck size={16} className="text-green-600" />,
                className: "hover:bg-green-50 text-green-600"
              },
            ]}
          />
        </div>
      )}

      {/* Modern Edit User Popup */}
      <ModernPopupForm
        isOpen={isEditPopupOpen}
        heading={`Edit ${tabTitle}`}
        fields={userFormFields}
        actionButtons={editActionButtons}
        initialData={selectedUser || undefined}
        onClose={() => setIsEditPopupOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Modern Status Change Confirmation Box */}
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
    </div>
  );
};

export default UserTab;
