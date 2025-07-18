import React from 'react';
import DriverDetails from '../DriverDetails';
import TopBar from '@/app/dashboardComponents/TopBar';

interface DriverDetailsPageProps {
  params: {
    id: string;
  };
}

const DriverDetailsPage = async ({ params }: DriverDetailsPageProps) => {
  const {id} = await params;

  return (
    <section className="p-6 md:p-10 min-h-screen w-full">
      <TopBar heading='Driver Details' />
      <DriverDetails driverId={id} />
    </section>
  );
};

export default DriverDetailsPage;