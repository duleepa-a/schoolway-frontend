'use client';

import { useState, useMemo } from 'react';
import TopBar from '@/app/dashboardComponents/TopBar';
import SearchFilter from '@/app/dashboardComponents/SearchFilter';
import DataTable from '@/app/dashboardComponents/CustomTable';
import { inquiriesData } from '../../../../public/dummy_data/inquiriesData.tsx';
import { FileText,FileCheck } from 'lucide-react';

const columns = [
  { key: 'FullName', label: 'Full Name' },
  { key: 'Subject', label: 'Subject' },
  { key: 'Status', label: 'Status' },
  { key: 'Role', label: 'Role' },
  { key: 'Date', label: 'Date' },
];

const InquiriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredData = useMemo(() => {
    return inquiriesData.filter((inquiry) => {
      const matchesSearch =
        searchTerm === '' ||
        inquiry['FullName'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.Subject?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole === '' || inquiry.Role === selectedRole;
      const matchesStatus = selectedStatus === '' || inquiry.Status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, selectedRole, selectedStatus]);

  const handleView = (row) => {
    alert(`Viewing inquiry from ${row['Full Name']} - Role: ${row.Role}`);
  };

  const handleResolve = (row) => {
    if (row.Status === 'Reviewed') {
      alert(`${row['Full Name']}'s inquiry is already reviewed.`);
    } else {
      alert(`Marking ${row['Full Name']}'s inquiry as reviewed.`);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
    setSelectedStatus('');
  };

  return (
    <div>
      <section className="p-5 md:p-10 min-h-screen w-full">
        <TopBar heading="Inquiries" />

        <SearchFilter
          onSearchChange={setSearchTerm}
          onRoleChange={setSelectedRole}
          onStatusChange={setSelectedStatus}
          onDateChange={() => {}}
          onClearFilters={handleClearFilters}
          config={{
            showAddButton:false,
            searchPlaceholder: 'Search by name or subject',
            addButtonText: '',
            statusOptions: [
              { value: '', label: 'Status' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Reviewed', label: 'Reviewed' },
            ],
            roleOptions: [
              { value: '', label: 'Role' },
              { value: 'Driver', label: 'Driver' },
              { value: 'Parent', label: 'Parent' },
              { value: 'Guest', label: 'Guest' },
              { value: 'Van Owner', label: 'Van Owner' },
            ],
          }}
        />

        <div className="mt-4">
          <DataTable
            columns={columns}
            data={filteredData}
            actions={[
              { 
                      type: "custom", 
                      icon: <FileText size={16} color='blue'/>,
                      label: "View Inquiry",
                      onClick: handleView
                 },
              { 
                      type: "custom", 
                      icon: <FileCheck size={16} color='green'/> ,
                      label: "Resolve",
                      onClick: handleResolve 
                    },          
             
            ]}
          />
        </div>
      </section>
    </div>
  );
};

export default InquiriesPage;
