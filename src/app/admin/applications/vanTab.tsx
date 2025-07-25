'use client';

import { useEffect, useState } from 'react';
import CustomTable from '@/app/dashboardComponents/CustomTable';
import ViewVanApplication from './ViewVanApplication';
import Swal from 'sweetalert2';
import { FileText, FileCheck, FileX } from 'lucide-react';

import { VanApplication } from './types';
import { formatVanApplication } from './utils';

export default function VanTab() {
  const [vans, setVans] = useState<VanApplication[]>([]);
  const [selectedVan, setSelectedVan] = useState<VanApplication | null>(null);

  useEffect(() => {
    const fetchVans = async () => {
      try {
        const res = await fetch('/api/admin/applications/vans');
        const data = await res.json();
        console.log(data);
        const formatted = data.map(formatVanApplication);
        setVans(formatted);
        console.log(formatted);
        
      } catch (error) {
        console.error('Failed to fetch vans:', error);
      }
    };
  
    fetchVans();
  }, []);
  

  const handleStatusUpdate = async (
    action: 'approve' | 'reject',
    id: number
    
  ) => {
    console.log(id);
    const { isConfirmed } = await Swal.fire({
      title: `Are you sure you want to ${action} this van?`,
      icon: action === 'approve' ? 'success' : 'warning',
      showCancelButton: true,
      confirmButtonColor: action === 'approve' ? '#22c55e' : '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action}`,
    });

    if (!isConfirmed) return;

    await fetch(`/api/admin/applications/vans/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vanID: id }),
    });

    setSelectedVan(null);
    setVans((prev) => prev.filter((v) => v.id !== id));
    window.location.reload();
  };

  return (
    <>
      <CustomTable
        columns={[
          { key: 'registrationNumber', label: 'Reg. Number' },
          { key: 'licensePlateNumber', label: 'Plate Number' },
          { key: 'makeAndModel', label: 'Model' },
          { key: 'seatingCapacity', label: 'Seats' },
          { key: 'createdAt', label: 'Date' },
          { key: 'isApproved', label: 'Status' },
        ]}
        data={vans}
        actions={[
          {
            type: 'custom',
            label: 'View',
            icon: <FileText size={16} color="blue" />,
            onClick: (row) => setSelectedVan(row as VanApplication),
          },
          {
            type: 'custom',
            label: 'Approve',
            icon: <FileCheck size={16} color="green" />,
            onClick: (row) => handleStatusUpdate('approve', (row as VanApplication).id),
          },
          {
            type: 'custom',
            label: 'Reject',
            icon: <FileX size={16} color="red" />,
            onClick: (row) => handleStatusUpdate('reject', (row as VanApplication).id),
          },
        ]}
      />

      {selectedVan && (
        <ViewVanApplication
          van={selectedVan}
          onApprove={() => handleStatusUpdate('approve', selectedVan.id)}
          onReject={() => handleStatusUpdate('reject', selectedVan.id)}
          onClose={() => setSelectedVan(null)}
        />
      )}
    </>
  );
}
