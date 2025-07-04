import React from 'react'
import {FaBell, FaMoon } from 'react-icons/fa';
import Image from 'next/image';
import TopBar from '@/app/dashboardComponents/TopBar';
import ProfileDetailForm from './profileDetailForm';

const profilePage = () => {
  return (
    <section className="p-6 md:p-10 min-h-screen w-full">
      {/* Top Right Icons */}

      <TopBar heading='My Profile'/>        
      
      <ProfileDetailForm/>

    </section>
  )
}

export default profilePage