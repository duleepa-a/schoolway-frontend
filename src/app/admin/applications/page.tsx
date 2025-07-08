'use client';
import TopBar from '@/app/dashboardComponents/TopBar'
import React, { useState } from 'react'
import StatCard from '@/app/dashboardComponents/StatCard'
import ApplicationTable from '@/app/dashboardComponents/ApplicationTable'
import DriverOverviewChart from '@/app/dashboardComponents/DriverOverviewChart'
import ActivityFeed from '@/app/dashboardComponents/ActivityFeed'
import DriverRatingChart from '@/app/dashboardComponents/DriverRatingChart'
import { applicationsData } from '../../../../public/dummy_data/applications'
import { FaFileAlt, FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaRedo } from 'react-icons/fa'


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

        <div className="grid grid-cols-5 gap-4 mb-10">
          <StatCard icon={<FaFileAlt className="text-xl" />} text="Total Recieved" number={100} />
          <StatCard icon={<FaHourglassHalf className="text-xl" />} text="Pending " number={122} />
          <StatCard icon={<FaCheckCircle className="text-xl" />} text="Approved" number={16} />
          <StatCard icon={<FaTimesCircle className="text-xl" />} text="Rejected" number={122} />
          <StatCard icon={<FaRedo className="text-xl" />} text="Re-submitted" number={16} />
        </div> 


        <div className="grid grid-rows-5 grid-flow-col gap-4 mb-10 min-w-[400px] h-[600px]">
          {/* 3-row section (left side) - Driver Overview Chart */}
          <div className="row-span-3 dashboard-section-card">
            <DriverOverviewChart />
          </div>

          {/* 2-row section (below it) */}
          <div className="row-span-2 dashboard-section-card">
            <DriverRatingChart />
          </div>
 
          {/* Full-height dense section (right column) */}
          <div className="row-span-5 dashboard-section-card bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">All Applications</h3>
            
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
        </div>

        <div className="row-span-2 dashboard-section-card">
          <ActivityFeed />
        </div>





        </section>
      </div>
   
  )
}

export default Applications
