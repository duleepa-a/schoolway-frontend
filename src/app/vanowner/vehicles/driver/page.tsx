import React from 'react'
// @ts-ignore
import AssignDriver from './AssignDriver';
import TopBar from '@/app/dashboardComponents/TopBar';

const AssignDriverPage = () => {

    return (
        <section className="p-6 md:p-10 min-h-screen w-full">
            <TopBar heading='Assign Driver'/>
            <AssignDriver/>
        </section>
    )
}

export default AssignDriverPage