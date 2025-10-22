'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, RefreshCw, Edit3, UserCheck, UserX, Loader2, ToggleLeft, ToggleRight, Eye } from 'lucide-react';
import DataTable from '@/app/dashboardComponents/CustomTable';
import ModernPopupForm from './ModernPopupForm';
import ModernConfirmationBox from './ModernConfirmationBox';
import ModernAlert from './ModernAlert';
import LiveToggleButton from './components/LiveToggleButton';
import ChildrenViewModal from './components/ChildrenViewModal';
import VansViewModal from './components/VansViewModal';
import { useUsers } from '@/hooks/useUsers';

interface UserTabProps {
  userRole: 'driver' | 'parent' | 'van owner' | 'admin' | 'guardian';
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

  // Modal states
  const [isChildrenModalOpen, setIsChildrenModalOpen] = useState(false);
  const [isVansModalOpen, setIsVansModalOpen] = useState(false);
  const [selectedChildren, setSelectedChildren] = useState<any[]>([]);
  const [selectedVans, setSelectedVans] = useState<any[]>([]);
  const [selectedParentName, setSelectedParentName] = useState('');
  const [selectedServiceName, setSelectedServiceName] = useState('');

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

  // Use the custom hook to fetch users
  const { users, loading, error, updateUser, toggleUserStatus } = useUsers({
    userRole,
    searchTerm,
    statusFilter: selectedStatus,
    roleFilter: ''
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
    },
    ...(userRole === 'driver' ? [{
      name: 'LicenseNumber',
      label: 'License Number',
      type: 'text' as const,
      required: false,
      placeholder: 'Enter license number'
    }] : []),
    ...(userRole === 'van owner' ? [{
      name: 'ServiceName',
      label: 'Service Name',
      type: 'text' as const,
      required: false,
      placeholder: 'Enter service name'
    }] : []),
    ...(userRole === 'guardian' ? [{
      name: 'SchoolName',
      label: 'School Name',
      type: 'text' as const,
      required: false,
      placeholder: 'Enter school name'
    }] : [])
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

  const handleViewChildren = (row: any) => {
    setSelectedChildren(row.Children || []);
    setSelectedParentName(row.Name);
    setIsChildrenModalOpen(true);
  };

  const handleViewVans = (row: any) => {
    setSelectedVans(row.Vans || []);
    setSelectedServiceName(row.ServiceName || row.Name);
    setIsVansModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (userToUpdate) {
      try {
        const success = await toggleUserStatus(userToUpdate.id, newStatus === 'Active');
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

  const handleFormSubmit = async (data: Record<string, string>) => {
    if (selectedUser) {
      try {
        const success = await updateUser(selectedUser.id, data);
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
    if (column === 'Children' && value && Array.isArray(value)) {
      return (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-sm text-gray-600">{value.length} child{value.length !== 1 ? 'ren' : ''}</span>
          <button
            onClick={() => handleViewChildren(row)}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-xs font-medium shadow-sm flex-shrink-0"
            title="View children details"
          >
            <Eye size={12} />
            View
          </button>
        </div>
      );
    }
    if (column === 'Vans' && value && Array.isArray(value)) {
      return (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-sm text-gray-600">{value.length} van{value.length !== 1 ? 's' : ''}</span>
          <button
            onClick={() => handleViewVans(row)}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-xs font-medium shadow-sm flex-shrink-0"
            title="View vans details"
          >
            <Eye size={12} />
            View
          </button>
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
          />
        </div>
      );
    }
    return String(value ?? '');
  };

  const columns = userRole === 'driver' ? [
    { key: "ProfilePicture", label: "Photo" },
    { key: "Name", label: "Name" },
    { key: "Email", label: "Email" },
    { key: "Mobile", label: "Phone" },
    { key: "NIC", label: "NIC" },
    { key: "LicenseNumber", label: "License No." },
    { key: "AssignedVan", label: "Assigned Van" },
    { key: "Actions", label: "Actions" },
  ] : userRole === 'parent' ? [
    { key: "ProfilePicture", label: "Photo" },
    { key: "Name", label: "Name" },
    { key: "Email", label: "Email" },
    { key: "NIC", label: "NIC" },
    { key: "Address", label: "Address" },
    { key: "Children", label: "Children" },
    { key: "Actions", label: "Actions" },
  ] : userRole === 'van owner' ? [
    { key: "ProfilePicture", label: "Photo" },
    { key: "Name", label: "Name" },
    { key: "ServiceName", label: "Service Name" },
    { key: "Email", label: "Email" },
    { key: "Mobile", label: "Phone" },
    { key: "NIC", label: "NIC" },
    { key: "Vans", label: "Vans" },
    { key: "Actions", label: "Actions" },
  ] : userRole === 'guardian' ? [
    { key: "ProfilePicture", label: "Photo" },
    { key: "Name", label: "Name" },
    { key: "Email", label: "Email" },
    { key: "Mobile", label: "Phone" },
    { key: "NIC", label: "NIC" },
    { key: "SchoolName", label: "School" },
    { key: "Actions", label: "Actions" },
  ] : [
    { key: "ProfilePicture", label: "Photo" },
    { key: "Name", label: "Name" },
    { key: "User_ID", label: "User ID" },
    { key: "Email", label: "Email" },
    { key: "NIC", label: "NIC" },
    { key: "Actions", label: "Actions" },
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
              renderCell={renderCell}
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

      {/* Modern Alert */}
      <ModernAlert
        isOpen={alert.isOpen}
        variant={alert.variant}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
      />

      {/* Children View Modal */}
      <ChildrenViewModal
        isOpen={isChildrenModalOpen}
        onClose={() => setIsChildrenModalOpen(false)}
        children={selectedChildren}
        parentName={selectedParentName}
      />

      {/* Vans View Modal */}
      <VansViewModal
        isOpen={isVansModalOpen}
        onClose={() => setIsVansModalOpen(false)}
        vans={selectedVans}
        serviceName={selectedServiceName}
      />
    </div>
  );
};

export default UserTab;
