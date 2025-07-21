'use client';

import { useEffect, useState } from 'react';
import CustomTable from '@/app/dashboardComponents/CustomTable';
import ViewApplication from './ViewApplication';
import Swal from 'sweetalert2';
import { FileText, FileCheck, FileX } from 'lucide-react';
import { ApplicationData } from './types';
import { formatDriverApplication } from './utils';

export default function DriverTab() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [selectedApp, setSelectedApp] = useState<ApplicationData | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      const res = await fetch('/api/admin/applications/drivers');
      const data = await res.json();
      const formatted = data.map(formatDriverApplication);
      setApplications(formatted);
    };
    fetchDrivers();
  }, []);

  const handleStatusUpdate = async (action: 'approve' | 'reject', userId: string) => {
    const { isConfirmed } = await Swal.fire({
      title: `Are you sure you want to ${action} this driver?`,
      icon: action === 'approve' ? 'success' : 'warning',
      showCancelButton: true,
      confirmButtonColor: action === 'approve' ? '#22c55e' : '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action}`,
    });

    if (!isConfirmed) return;

    await fetch(`/api/admin/applications/drivers/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    setSelectedApp(null);
    setApplications((prev) => prev.filter((a) => a.id !== userId));
  };

  return (
    <>
      <CustomTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'nic', label: 'NIC' },
          { key: 'date', label: 'Date' },
          { key: 'status', label: 'Status' },
        ]}
        data={applications}
        actions={[
          {
            type: 'custom',
            label: 'View',
            icon: <FileText size={16} color="blue" />,
            onClick: (row) => setSelectedApp(row as ApplicationData),
          },
          {
            type: 'custom',
            label: 'Approve',
            icon: <FileCheck size={16} color="green" />,
            onClick: (row) => handleStatusUpdate('approve', (row as ApplicationData).id),
          },
          {
            type: 'custom',
            label: 'Reject',
            icon: <FileX size={16} color="red" />,
            onClick: (row) => handleStatusUpdate('reject', (row as ApplicationData).id),
          },
        ]}
      />

      {selectedApp && (
        <ViewApplication
          application={selectedApp}
          onApprove={() => handleStatusUpdate('approve', selectedApp.id)}
          onReject={() => handleStatusUpdate('reject', selectedApp.id)}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </>
  );
}
