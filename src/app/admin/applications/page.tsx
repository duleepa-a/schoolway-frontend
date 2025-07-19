'use client';
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import TopBar from '@/app/dashboardComponents/TopBar';
import TabComponent from './TabComponent';
import { formatDriverApplication } from './utils';
import { ApplicationData } from './types';

export default function DriverApplicationsPage() {
  const [applicationRows, setApplicationRows] = useState<ApplicationData[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch('/api/admin/applications/drivers');
        const data = await res.json();
        setApplicationRows(data.map(formatDriverApplication));
      } catch (err) {
        console.error('Failed to fetch applications:', err);
      }
    };

    fetchApplications();
  }, []);

  return (
    <section className="p-5 md:p-10 min-h-screen w-full">
      <TopBar heading="Driver Applications" />
      <TabComponent driverApplications={applicationRows} />
    </section>
  );
}
