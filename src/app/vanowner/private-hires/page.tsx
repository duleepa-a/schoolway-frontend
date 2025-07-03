import React from 'react';
import {FaBell, FaMoon } from 'react-icons/fa';
import Image from 'next/image';
import TopBar from '@/app/dashboardComponents/TopBar';
import PrivatehireTable from './PrivatehireTable';

const privateHires = () => {
  return (
    <section className="p-6 md:p-10 min-h-screen w-full">
          {/* Top Right Icons */}
          <TopBar heading='Private-hires'/>       
          
          <PrivatehireTable/>
                  
    </section>
  )
}

export default privateHires