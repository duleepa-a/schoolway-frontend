import React from 'react'
import DriverDetails from './DriverDetails';
import TopBar from '@/app/dashboardComponents/TopBar';

const DriverDetailsPage = () => {

    return (
        <section className="p-6 md:p-10 min-h-screen w-full">
            <TopBar heading='Driver Details'/>
            <DriverDetails/>
        </section>
    )
}

export default DriverDetailsPage