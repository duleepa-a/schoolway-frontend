"use client";

import { useEffect, useState } from 'react';
import CustomTable from '@/app/dashboardComponents/CustomTable';
import { useRouter } from 'next/navigation';
import ViewVanDetails from './ViewVanDetails';
import { FileText, FileCheck } from 'lucide-react';

import { VanDetails } from './types';
import { formatVanDetails } from './utils';
import SearchFilter from '@/app/dashboardComponents/SearchFilter';

export default function RoutesPageContent() {
  const [vans, setVans] = useState<VanDetails[]>([]);
  const [selectedVan, setSelectedVan] = useState<VanDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    const fetchVans = async () => {
      try {
        const res = await fetch('/api/admin/applications/vans');
        if (!res.ok) {
          console.error('Failed to fetch vans. Status:', res.status);
          return;
        }

        const json = await res.json();
        console.log(json);
        const list = Array.isArray(json)
          ? json
          : json && json.success && Array.isArray(json.data)
          ? json.data
          : null;

        if (Array.isArray(list)) {
          const formatted = list.map(formatVanDetails);
          setVans(formatted);
        } else {
          console.error('Unexpected API response:', json);
        }
      } catch (error) {
        console.error('Failed to fetch vans:', error);
      }
    };

    fetchVans();
  }, []);
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedRole('');
  };

  const filteredVans = vans.filter((van) => {
    const matchesSearch = searchTerm
      ? [
          van.serviceName,
          van.ownerName,
          van.email,
          van.contact,
          van.licensePlateNumber,
          van.registrationNumber,
        ]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(searchTerm.toLowerCase()))
      : true;

    const matchesStatus = selectedStatus ? van.isApproved === selectedStatus : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <SearchFilter
        onSearchChange={setSearchTerm}
        onRoleChange={setSelectedRole}
        onStatusChange={setSelectedStatus}
        onClearFilters={handleClearFilters}
        config={{
          searchPlaceholder: 'Search vans... (service, owner, email, contact, plate)',
          roleOptions: undefined,
          statusOptions: [
            { value: '', label: 'Status' },
            { value: 'Approved', label: 'Approved' },
            { value: 'Rejected', label: 'Rejected' },
            { value: 'Pending', label: 'Pending' },
          ],
          showDateFilter: false,
          showAddButton: false,
          showClearButton: true,
        }}
      />
      <CustomTable
        columns={[
          { key: 'serviceName', label: 'Van Service Name' },
          { key: 'ownerName', label: 'Owner Name' },
          { key: 'email', label: 'Email' },
          { key: 'contact', label: 'Contact No' },
          { key: 'isApproved', label: 'Status' },
        ]}
        data={filteredVans}
        actions={[
          {
            type: 'custom',
            label: 'View',
            icon: <FileText size={16} color="blue" />,
            onClick: (row) => setSelectedVan(row as VanDetails),
          },
          {
            type: 'custom',
            label: 'Routes',
            icon: <FileCheck size={16} color="green" />,
            onClick: (row) => router.push(`/admin/routes/${row.id}`),
          },
        ]}
      />

      {selectedVan && (
        <ViewVanDetails
          van={selectedVan}
          onClose={() => setSelectedVan(null)}
        />
      )}
    </>
  );
}