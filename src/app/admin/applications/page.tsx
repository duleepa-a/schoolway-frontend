'use client';
import TopBar from '@/app/dashboardComponents/TopBar'
import React, { useState } from 'react'
import StatCard from '@/app/dashboardComponents/StatCard'
import ApplicationTable from '@/app/dashboardComponents/ApplicationTable'
import DriverOverviewChart from '@/app/dashboardComponents/DriverOverviewChart'
import DriverRatingChart from '@/app/dashboardComponents/DriverRatingChart'
import ReviewApplication from '@/app/dashboardComponents/ReviewApplication'
import { applicationsData } from '../../../../public/dummy_data/applications'
import { FaFileAlt, FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaRedo } from 'react-icons/fa'
import TabComponent from './TabComponent';

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

        <TabComponent/>

        </section>
      </div>
   
  )
}

export default Applications

