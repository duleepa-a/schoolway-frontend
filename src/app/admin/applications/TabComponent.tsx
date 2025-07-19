'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';
import CustomTable from '@/app/dashboardComponents/CustomTable';
import StatisticsTab from '@/app/admin/applications/StatisticsTab';
import ViewApplication from './ViewApplication';
import { FileText, FileCheck, FileX } from 'lucide-react';
import { ApplicationData } from './types';



interface TabComponentProps {
  driverApplications: ApplicationData[];
}

export default function TabComponent({ driverApplications }: TabComponentProps) {
  const [activeTab, setActiveTab] = useState('drivers');
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);



const handleStatusUpdate = async (action: 'approve' | 'reject', userId: string) => {
  const { isConfirmed } = await Swal.fire({
    title: `Are you sure you want to ${action} this application?`,
    icon: action === 'approve' ? 'success' : 'warning',
    showCancelButton: true,
    confirmButtonColor: action === 'approve' ? '#22c55e' : '#ef4444', // Tailwind green-500 or red-500
    cancelButtonColor: '#6b7280', // Tailwind gray-500
    confirmButtonText: `Yes, ${action} it`,
    cancelButtonText: 'Cancel',
  });

  if (!isConfirmed) return;

  try {
    await fetch(`/api/admin/applications/drivers/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    await Swal.fire({
      title: `Application ${action}ed successfully!`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });

    setSelectedApplication(null);
  } catch (err) {
    console.error(`Failed to ${action} application:`, err);
    Swal.fire({
      title: 'Error!',
      text: `Failed to ${action} the application.`,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  }
};


  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'nic', label: 'NIC' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-300 mb-4">
        {['drivers', 'vehicles', 'statistics'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-medium ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-700' : 'text-gray-500'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Applications
          </button>
        ))}
      </div>

      {activeTab === 'drivers' && (
        <div className="dashboard-section-card bg-gray-50 p-4 rounded">
          <h3 className="text-lg font-semibold mb-4">Driver Applications</h3>
          <CustomTable
            columns={columns}
            data={driverApplications}
            actions={[
              {
                type: 'custom',
                label: 'view',
                icon: <FileText size={16} color="blue" />,
                onClick: setSelectedApplication,
              },
              {
                type: 'custom',
                label: 'approve',
                icon: <FileCheck size={16} color="green" />,
                onClick: (row) => handleStatusUpdate('approve', row.id),
              },
              {
                type: 'custom',
                label: 'reject',
                icon: <FileX size={16} color="red" />,
                onClick: (row) => handleStatusUpdate('reject', row.id),
              },
            ]}
            defaultItemsPerPage={10}
          />
        </div>
      )}

      {activeTab === 'vehicles' && (
        <div className="dashboard-section-card bg-gray-50 p-4 rounded">
          <h3 className="text-lg font-semibold mb-4">Vehicle Applications</h3>
          <p>No vehicle applications yet.</p>
        </div>
      )}

      {activeTab === 'statistics' && (
        <div className="dashboard-section-card bg-gray-50 p-4 rounded">
          <h3 className="text-lg font-semibold mb-4">Statistics</h3>
          <StatisticsTab />
        </div>
      )}

      {selectedApplication && (
        <ViewApplication
          application={selectedApplication}
          onApprove={() => handleStatusUpdate('approve', selectedApplication.id)}
          onReject={() => handleStatusUpdate('reject', selectedApplication.id)}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
}
