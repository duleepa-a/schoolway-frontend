'use client';

import { useState } from 'react';
import ApplicationTable from '@/app/dashboardComponents/ApplicationTable'
import { applicationsData } from '../../../../public/dummy_data/applications'
import StatisticsTab from './StatisticsTab';



export default function TabComponent() {
  const [activeTab, setActiveTab] = useState('drivers');
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  

  const columns = [
    { key: "Name", label: "Name" },
    { key: "User_ID", label: "User ID" },
    { key: "Date", label: "Date"},
    { key: "Status", label: "Status" },
    ];

    const handleReview = (row: Record<string, string | number | boolean | null | undefined>) => {
        console.log("Review application:", row);
        // Implement review functionality
    };

    const handleReject = (row: Record<string, string | number | boolean | null | undefined>) => {
        console.log("Reject application:", row);
        // Implement reject functionality
    };

    const handleSelectionChange = (selectedIds: string[]) => {
        setSelectedApplications(selectedIds);
        console.log("Selected applications:", selectedIds);
    };

  return (
    <div className="">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-border-bold-shade mb-4">
        <button
          onClick={() => setActiveTab('drivers')}
          className={`pb-2 font-medium cursor-pointer 
            
            ${activeTab === 'drivers'
              ? 'border-b-2 border-primary text-active-text'
              : 'text-inactive-text'
          }`}

        >
          Drivers Applications
        </button>
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`pb-2 font-medium cursor-pointer 
            
            ${activeTab === 'vehicles'
              ? 'border-b-2 border-primary text-active-text'
              : 'text-inactive-text'
          }`}
        >
          Vehicles Applications
        </button>
        <button
          onClick={() => setActiveTab('statistics')}
          className={`pb-2 font-medium cursor-pointer 
            
            ${activeTab === 'statistics'
              ? 'border-b-2 border-primary text-active-text'
              : 'text-inactive-text'
          }`}

        >
            Statistics
        </button>
      </div>

      {activeTab === 'drivers' && (
        <div className="row-span-5 dashboard-section-card bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Driver Applications</h3>
            
            <div className="h-full overflow-y-auto">
              <ApplicationTable
                columns={columns}
                data={applicationsData}
                actions={[
                  { type: "review", onClick: handleReview },
                  { type: "reject", onClick: handleReject },
                ]}
                onSelectionChange={handleSelectionChange}
                defaultItemsPerPage={10}
              />
            </div>
        </div>
      )}

      {activeTab === 'vehicles' && (
        <div className="row-span-5 dashboard-section-card bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Vehicle Applications</h3>
            
            <div className="h-full overflow-y-auto">
              <ApplicationTable
                columns={columns}
                data={applicationsData}
                actions={[
                  { type: "review", onClick: handleReview },
                  { type: "reject", onClick: handleReject },
                ]}
                onSelectionChange={handleSelectionChange}
                defaultItemsPerPage={10}
              />
            </div>
        </div>
      )}

      {activeTab === 'statistics' && (
        <div className="row-span-5 dashboard-section-card bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Statistics</h3>
            
            <div className="h-full overflow-y-auto">
              <StatisticsTab/>
            </div>
        </div>
      )}

      

    </div>
  );
}
