import React from 'react';
import TopBar from '@/app/dashboardComponents/TopBar';
import PrivateHireDetailTab from './PrivateHireDetailTab';

const privateHires = () => {
  return (
    <section className="p-6 md:p-10 min-h-screen w-full">
        {/* Top Right Icons */}
        <TopBar heading='Private-hires'/>         

        <PrivateHireDetailTab/>

    </section>
  )
}

export default privateHires