import React from 'react';
import TopBar from '@/app/dashboardComponents/TopBar';
import GuradianPageContent from './GuradianPageContent';


const Page = () => {
   
    return (
        <section className="p-6 md:p-10 min-h-screen w-full">
            <TopBar heading="School Guardians" />
            <GuradianPageContent/>
          
        </section>
    );
};

export default Page;