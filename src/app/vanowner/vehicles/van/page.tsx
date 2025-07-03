import React from 'react'
import {FaBell, FaMoon } from 'react-icons/fa';
import Image from 'next/image';
import VanDetails from './VanDetails';
import TopBar from '@/app/dashboardComponents/TopBar';

const VanDetailsPage = () => {
  
  return (
    <section className="p-6 md:p-10 min-h-screen w-full">
        <TopBar heading='My Vehicle'/>
        <VanDetails/>        

    </section>
  )
}

export default VanDetailsPage