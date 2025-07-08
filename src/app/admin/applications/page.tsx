'use client';
import TopBar from '@/app/dashboardComponents/TopBar'
import React, { useState } from 'react'
import StatCard from '@/app/dashboardComponents/StatCard'
import ApplicationTable from '@/app/dashboardComponents/ApplicationTable'
import DriverOverviewChart from '@/app/dashboardComponents/DriverOverviewChart'
import ActivityFeed from '@/app/dashboardComponents/ActivityFeed'
import DriverRatingChart from '@/app/dashboardComponents/DriverRatingChart'
import ReviewApplication from '@/app/dashboardComponents/ReviewApplication'
import { applicationsData } from '../../../../public/dummy_data/applications'
import { FaFileAlt, FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaRedo } from 'react-icons/fa'

interface ApplicationData {
  name: string;
  contact: string;
  dob: string;
  address: string;
  drivingLicense: string;
  licenseExpiry: string;
  nic: string;
  policeReport: string;
  medicalReport: string;
  profilePicture?: string;
  policeReportDocument?: string;
  medicalReportDocument?: string;
}

const columns = [
  { key: "Name", label: "Name" },
  { key: "User_ID", label: "User ID" },
  { key: "Date", label: "Date"},
  { key: "Status", label: "Status" },
];

const Applications = () => {
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null);

  const handleReview = (row: Record<string, string | number | boolean | null | undefined>) => {
    // Convert the row data to the format expected by ReviewApplication
    const applicationData: ApplicationData = {
      name: String(row.Name || ''),
      contact: String(row.Contact || '+94 77 123 4567'), // Default if not available
      dob: String(row.DOB || '1990-01-01'), // Default if not available
      address: String(row.Address || 'Colombo, Sri Lanka'), // Default if not available
      drivingLicense: String(row.License || 'DL' + row.User_ID),
      licenseExpiry: String(row.LicenseExpiry || '2025-12-31'),
      nic: String(row.NIC || row.User_ID + 'V'),
      policeReport: String(row.PoliceReport || 'Pending'),
      medicalReport: String(row.MedicalReport || 'Verified'),
      profilePicture: String(row.ProfilePicture || ''),
      // Use document paths from the data if available, otherwise use sample documents
      policeReportDocument: String(row.PoliceReportDocument || '/dummy_data/documents/police_report_sample.pdf'),
      medicalReportDocument: String(row.MedicalReportDocument || '/dummy_data/documents/medical_report_sample.pdf')
    };
    setSelectedApplication(applicationData);
    setIsReviewOpen(true);
  };

  const handleReject = (row: Record<string, string | number | boolean | null | undefined>) => {
    console.log("Reject application:", row);
    // Implement reject functionality
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedApplications(selectedIds);
    console.log("Selected applications:", selectedIds);
  };

  const handleApproveApplication = (note?: string, verifiedDocs?: { police: boolean; medical: boolean; license: boolean }) => {
    if (selectedApplication) {
      console.log("Approving application for:", selectedApplication.name);
      console.log("Special note:", note || "No note provided");
      console.log("Document verification:", verifiedDocs || "No verification provided");
      // Here you would typically call your API to approve the application with the note and verification
      setIsReviewOpen(false);
      setSelectedApplication(null);
    }
  };

  const handleRejectFromReview = () => {
    if (selectedApplication) {
      console.log("Rejecting application for:", selectedApplication.name);
      // Here you would typically call your API to reject the application
      setIsReviewOpen(false);
      setSelectedApplication(null);
    }
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
        </div>        <div className="row-span-2 dashboard-section-card">
          <ActivityFeed />
        </div>

        {/* Review Application Popup */}
        {selectedApplication && (
          <ReviewApplication
            isOpen={isReviewOpen}
            onClose={() => setIsReviewOpen(false)}
            onApprove={handleApproveApplication}
            onReject={handleRejectFromReview}
            applicationData={selectedApplication}
          />
        )}

        </section>
      </div>
   
  )
}

export default Applications
