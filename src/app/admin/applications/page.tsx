
import React from 'react';
import TopBar from '@/app/dashboardComponents/TopBar';
import DriverApplicationsPageContent from './DriverApplicationsPageContent';

export default function DriverApplicationsPage() {

  return (
    <section className="p-5 md:p-10 min-h-screen w-full">
      <TopBar heading="Applications and Stats" />
      <DriverApplicationsPageContent/>
    </section>
  );
}
