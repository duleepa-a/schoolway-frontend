'use client';
import TopBar from '@/app/dashboardComponents/TopBar'
import React, { useState } from 'react'


const columns = [
  { key: "Name", label: "Name" },
  { key: "User_ID", label: "User ID" },
  { key: "Date", label: "Date"},
  { key: "Status", label: "Status" },
];

const Applications = () => {
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);

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

     <div className="mt-8">
        <section className="p-5 md:p-10 min-h-screen w-full">
        {/*Top bar with profile icon and the heading*/}
        <TopBar heading="Driver Applications" />

        {/* Show selected count if any applications are selected */}
        {selectedApplications.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800">
              {selectedApplications.length} application{selectedApplications.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}

        

        </section>
      </div>
   
  )
}

export default Applications
