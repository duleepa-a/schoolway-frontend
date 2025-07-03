import React from 'react'
import {FaBell, FaMoon } from 'react-icons/fa';
import Image from 'next/image';
import StudentDetailTab from './StudentDetialTab';
import TopBar from '@/app/dashboardComponents/TopBar';

const studentsPage = () => {
  return (
   <section className="p-6 md:p-10 min-h-screen w-full">
           {/* Top Right Icons */}
           <TopBar heading='Students'/>
            <StudentDetailTab/>        
   
          
    </section>
     )
}

export default studentsPage