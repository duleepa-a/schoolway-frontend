'use client';

import { useState, useEffect, useMemo } from 'react';
import SearchFilter from '@/app/dashboardComponents/SearchFilter';
import DataTable from '@/app/dashboardComponents/CustomTable';
import { inquiriesData as dummyData } from '../../../../public/dummy_data/inquiriesData';
import { FileText, FileCheck } from 'lucide-react';

const columns = [
  { key: 'FullName', label: 'Full Name' },
  { key: 'Subject', label: 'Subject' },
  { key: 'Status', label: 'Status' },
  { key: 'Role', label: 'Role' },
  { key: 'Date', label: 'Date' },
];

interface Inquiry {
  id: number;
  FullName: string;
  Subject: string;
  Status: string;
  Role: string;
  Date: string;
}

const InquiriesPageContent = () => {
  const [inquiriesData, setInquiriesData] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setInquiriesData(dummyData);
      setLoading(false);
    }, 500);
  }, []);

  const filteredData = useMemo(() => {
    return inquiriesData.filter((inquiry) => {
      const matchesSearch =
        searchTerm === '' ||
        inquiry.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.Subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole === '' || inquiry.Role === selectedRole;
      const matchesStatus = selectedStatus === '' || inquiry.Status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, selectedRole, selectedStatus, inquiriesData]);

  const handleView = (row: Inquiry) => {
    alert(`Viewing inquiry from ${row.FullName} - Role: ${row.Role}`);
  };

  const handleResolve = (row: Inquiry) => {
    if (row.Status === 'Reviewed') {
      alert(`${row.FullName}'s inquiry is already reviewed.`);
      return;
    }

    alert(`(Simulated) Marked ${row.FullName}'s inquiry as reviewed.`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
    setSelectedStatus('');
  };

  return (
    <div className="p-4 space-y-4">
      <SearchFilter
        onSearchChange={setSearchTerm}
        onRoleChange={setSelectedRole}
        onStatusChange={setSelectedStatus}
        onDateChange={() => {}}
        onClearFilters={handleClearFilters}
        config={{
          showAddButton: false,
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

      {loading ? (
        <div className="text-center py-10">Loading inquiries...</div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          actions={[
            {
              type: 'custom',
              icon: <FileText size={16} color="blue" />,
              label: 'View Inquiry',
              onClick: handleView,
            },
            {
              type: 'custom',
              icon: <FileCheck size={16} color="green" />,
              label: 'Resolve',
              onClick: handleResolve,
            },
          ]}
        />
      )}
    </div>
  );
};

export default InquiriesPageContent;
