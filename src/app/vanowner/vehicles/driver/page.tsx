import React from 'react'
// @ts-ignore
import AssignDriver from './AssignDriver';
import TopBar from '@/app/dashboardComponents/TopBar';

interface AssignDriverPageProps {
    searchParams: { [key: string]: string | undefined }
}

const AssignDriverPage = ({ searchParams }: AssignDriverPageProps) => {
    const vanMakeAndModel = searchParams?.vanMakeAndModel ?? '';

    return (
        <section className="p-6 md:p-10 min-h-screen w-full">
            <TopBar heading={`Find a Driver for ${vanMakeAndModel}`} />
            <AssignDriver />
        </section>
    );
};

export default AssignDriverPage;