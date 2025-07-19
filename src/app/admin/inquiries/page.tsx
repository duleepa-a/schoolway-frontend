'use client';

import { useState, useMemo } from 'react';
import TopBar from '@/app/dashboardComponents/TopBar';
import SearchFilter from '@/app/dashboardComponents/SearchFilter';
import DataTable from '@/app/dashboardComponents/CustomTable';
// import { inquiriesData } from '../../../../public/dummy_data/inquiriesData.tsx';
import { useEffect } from 'react';

import { FileText,FileCheck } from 'lucide-react';

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



const InquiriesPage = () => {
  const [inquiriesData, setInquiriesData] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/inquiries'); 
      const data = await response.json();
      setInquiriesData(data);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
  }, []);

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
  }, [searchTerm, selectedRole, selectedStatus, inquiriesData]);

const handleView = (row: Record<string, string | number | boolean | null | undefined>) => {
  alert(`Viewing inquiry from ${row.FullName} - Role: ${row.Role}`);
};
const handleResolve = async (row: Record<string, string | number | boolean | null | undefined>) => {
  if (row.Status === 'Reviewed') {
    alert(`${row.FullName}'s inquiry is already reviewed.`);
    return;
  }

  try {
    const res = await fetch(`/api/inquiries/${row.id}/resolve`, {
      method: 'POST',
    });
    if (res.ok) {
      alert(`Marked ${row.FullName}'s inquiry as reviewed.`);
    } else {
      alert('Failed to update inquiry status.');
    }
  } catch (err) {
    console.error(err);
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
      {loading ? (
            <div className="text-center py-10">Loading inquiries...</div>
      ) : (
        <div className="mt-4">
          <DataTable
            columns={columns}
            data={filteredData}
            actions={[
              { 
                      type: "custom", 
                      icon: <FileText size={16} color='blue'/>,
                      label: "View Inquiry",
                      onClick: handleView,
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
        )}
      </section>
    </div>
  );
};

export default InquiriesPage;
