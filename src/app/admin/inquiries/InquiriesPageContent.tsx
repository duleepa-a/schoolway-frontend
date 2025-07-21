'use client';

import { useState, useMemo } from 'react';
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



const InquiriesPageContent = () => {
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

      // 🔽 Dummy fallback data
    setInquiriesData([
      {
        id: 1,
        FullName: 'John Doe',
        Subject: 'School transport timing issue',
        Status: 'Pending',
        Role: 'Parent',
        Date: '2025-07-20',
      },
      {
        id: 2,
        FullName: 'Jane Smith',
        Subject: 'Driver behavior concern',
        Status: 'Reviewed',
        Role: 'Driver',
        Date: '2025-07-18',
      },
      {
        id: 3,
        FullName: 'Ali Khan',
        Subject: 'Request for van approval',
        Status: 'Pending',
        Role: 'Van Owner',
        Date: '2025-07-19',
      },
      {
        id: 4,
        FullName: 'Guest User',
        Subject: 'General platform feedback',
        Status: 'Pending',
        Role: 'Guest',
        Date: '2025-07-17',
      },
      {
        id: 5,
        FullName: 'Emily Rose',
        Subject: 'Lost item in van',
        Status: 'Resolved',
        Role: 'Parent',
        Date: '2025-07-16',
      },
      {
        id: 6,
        FullName: 'Carlos Martinez',
        Subject: 'Driver late regularly',
        Status: 'Pending',
        Role: 'Parent',
        Date: '2025-07-15',
      },
      {
        id: 7,
        FullName: 'Nisha Perera',
        Subject: 'Issue with van cleanliness',
        Status: 'Reviewed',
        Role: 'Student',
        Date: '2025-07-14',
      },
      {
        id: 8,
        FullName: 'Ravi Senanayake',
        Subject: 'Unable to track van in map',
        Status: 'Pending',
        Role: 'Parent',
        Date: '2025-07-13',
      },
      {
        id: 9,
        FullName: 'Mohammed Faisal',
        Subject: 'Request to change pickup location',
        Status: 'In Progress',
        Role: 'Parent',
        Date: '2025-07-12',
      },
      {
        id: 10,
        FullName: 'Chathura De Silva',
        Subject: 'Inquiry about insurance requirements',
        Status: 'Resolved',
        Role: 'Van Owner',
        Date: '2025-07-11',
      },
      {
        id: 11,
        FullName: 'Amanda Lee',
        Subject: 'Need help registering as a driver',
        Status: 'Pending',
        Role: 'Driver',
        Date: '2025-07-10',
      },
      {
        id: 12,
        FullName: 'Thilina Jayawardena',
        Subject: 'App crashes during payment',
        Status: 'Pending',
        Role: 'Guest',
        Date: '2025-07-09',
      },
      {
        id: 13,
        FullName: 'Ishani Wijesekara',
        Subject: 'Feedback on customer service',
        Status: 'Reviewed',
        Role: 'Parent',
        Date: '2025-07-08',
      },
      {
        id: 14,
        FullName: 'Guest User',
        Subject: 'Question about data privacy',
        Status: 'Pending',
        Role: 'Guest',
        Date: '2025-07-07',
      },
    ]);
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
    </div>
  );
};

export default InquiriesPageContent;
