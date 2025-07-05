import React from 'react'
import {FaBell, FaMoon } from 'react-icons/fa';
import Image from 'next/image';
import RevenueTable from './revenueTable';
import TopBar from '@/app/dashboardComponents/TopBar';

const revenuePage = () => {
  return (
    <section className="p-6 md:p-10 min-h-screen w-full">
      {/* Top Right Icons */}
      <TopBar heading='Revenue'/>        

      <RevenueTable/>

    </section>
  )
}

export default revenuePage