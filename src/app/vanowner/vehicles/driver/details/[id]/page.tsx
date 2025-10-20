import React from 'react';
import DriverDetails from '../DriverDetails';
import TopBar from '@/app/dashboardComponents/TopBar';
// import Driverinf from '../Driverinf';

interface DriverDetailsPageProps {
  params: Promise<{
    id: string;
    vanId?: string;
    vanMakeAndModel?: string;
  }>;
}

const DriverDetailsPage = async ({ params }: DriverDetailsPageProps) => {
  const param = await params;
  console.log('DriverDetailsPage params:', param);
  return (
    <section className="p-6 md:p-10 min-h-screen w-full">
      <TopBar heading='Driver Details' />
      <DriverDetails driverId={param.id} />
    </section>
  );
};

export default DriverDetailsPage;