'use client';
import { useState, useMemo } from 'react';
import TopBar from '@/app/dashboardComponents/TopBar';
import SearchFilter from '@/app/dashboardComponents/SearchFilter';
import DataTable from '@/app/dashboardComponents/CustomTable';
import PopupForm from '@/app/dashboardComponents/PopupForm';
import ConfirmationBox from '@/app/dashboardComponents/ConfirmationBox';
import { userData } from '../../../../public/dummy_data/users';



const columns = [
  { key: "Name", label: "Name" },
  { key: "User_ID", label: "User ID" },
  { key: "Email", label: "Email" },
  { key: "Status", label: "Status" },
  { key: "Role", label: "Role" },
];

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Record<string, string> | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Record<string, string> | null>(null);

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
      name: 'User_ID',
      label: 'User ID',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter user ID'
    },
    {
      name: 'Email',
      label: 'Email Address',
      type: 'email' as const,
      required: false,
      placeholder: 'Enter email address'
    },
    {
      name: 'Password',
      label: 'Reset Password',
      type: 'password' as const,
      required: false,
      placeholder: 'New Password'
    },
    {
      name: 'Status',
      label: 'Status',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Pending', label: 'Pending' }
      ]
    },
    {
      name: 'Role',
      label: 'Role',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'van owner', label: 'Van Owner' },
        { value: 'driver', label: 'Driver' },
        { value: 'parent', label: 'Parent' }
      ]
    }
  ];

  // Define action buttons for the popup
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

  // Filter the data based on search criteria
  const filteredData = useMemo(() => {
    return userData.filter((user) => {
      // Search filter - searches in name, email, and user ID
      const matchesSearch = searchTerm === '' || 
        user.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.User_ID.toLowerCase().includes(searchTerm.toLowerCase());

      // Role filter
      const matchesRole = selectedRole === '' || user.Role === selectedRole;

      // Status filter
      const matchesStatus = selectedStatus === '' || user.Status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, selectedRole, selectedStatus]);

  const handleAddUser = () => {
    console.log("Add user clicked");
    // Implement add user functionality
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
    setSelectedStatus('');
  };
   const handleEdit = (row: Record<string, string | number | boolean | null | undefined>) => {
    setSelectedUser(row as Record<string, string>);
    setIsEditPopupOpen(true);
  };

  const handleDelete = (row: Record<string, string | number | boolean | null | undefined>) => {
    setUserToDelete(row as Record<string, string>);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      console.log("Deleting user:", userToDelete);
      // Here you would typically call your API to delete the user
      // For now, we'll just log it
      setIsDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  return (

      <div className="mt-8">
        <section className="p-5 md:p-10 min-h-screen w-full">
        {/*Top bar with profile icon and the heading*/}
        <TopBar heading="Users" />

        <SearchFilter 
          onSearchChange={setSearchTerm}
          onRoleChange={setSelectedRole}
          onStatusChange={setSelectedStatus}
          onDateChange={() => {}} // Placeholder for future date filtering
          onClearFilters={handleClearFilters}
          config={{
            searchPlaceholder: "Search users by name, email, or ID",
            onAddClick: handleAddUser,
            addButtonText: "+ Add User"
          }}
        />

        <div className="mt-4">
          <DataTable
          columns={columns}
          data={filteredData}
          actions={[
          { type: "edit", onClick: handleEdit },
          { type: "delete", onClick: handleDelete },
          ]}
        />
        </div>

        {/* Edit User Popup */}
        <PopupForm
          isOpen={isEditPopupOpen}
          heading="Edit User"
          fields={userFormFields}
          actionButtons={editActionButtons}
          initialData={selectedUser || undefined}
          onClose={() => setIsEditPopupOpen(false)}
          onSubmit={(data) => {
            console.log('Updated user data:', data);
            // Here you would typically update the user in your backend
            setIsEditPopupOpen(false);
            setSelectedUser(null);
          }}
        />

        {/* Delete Confirmation Box */}
        <ConfirmationBox
          isOpen={isDeleteConfirmOpen}
          title="Delete User"
          confirmationMessage="Are you sure you want to delete this user?"
          objectName={userToDelete ? `${userToDelete.Name} (${userToDelete.User_ID})` : ''}
          message="This action will permanently remove the user and all associated data."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          confirmText="Delete User"
          cancelText="Cancel"
        />
        </section>
      </div>
  )
}

export default AdminDashboard
