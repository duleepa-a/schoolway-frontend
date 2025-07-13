'use client';
import TopBar from '@/app/dashboardComponents/TopBar'
import React, { useState } from 'react'
import TabComponent from './TabComponent';


const Applications = () => {

  return (

     <div className="mt-8">
      <section className="p-5 md:p-10 min-h-screen w-full">

        {/*Top bar with profile icon and the heading*/}
        <TopBar heading="Applications" />

        <TabComponent/>

      </section>    
    </div>
   
  )
}

export default Applications
