'use client';
import { useState, useMemo } from 'react';
import TopBar from '@/app/dashboardComponents/TopBar';
import SearchFilter from '@/app/dashboardComponents/SearchFilter';
import DataTable from '@/app/dashboardComponents/CustomTable';
import { userData } from '../../../../public/dummy_data/users';
import { UserPen, UserX } from 'lucide-react';



const columns = [
  { key: "Name", label: "School Name" },
  { key: "User_ID", label: "School ID" },
  { key: "Email", label: "Email" },
  { key: "Status", label: "Guardian Name" },
  { key: "Role", label: "Contact" },
];

const ManageSchoolsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

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
    console.log("Edit clicked:", row);
  };

  const handleDelete = (row: Record<string, string | number | boolean | null | undefined>) => {
    console.log("Delete clicked:", row);
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
          { 
            type: "custom", 
            icon: <UserPen size={16} />,
            label: "Edit User",
            className: "text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors",
            onClick: handleEdit 
          },
          { 
            type: "custom", 
            icon: <UserX size={16} />,



export default ManageSchoolsPage;
