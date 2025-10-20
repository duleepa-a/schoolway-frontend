import React from 'react'
import TopBar from '@/app/dashboardComponents/TopBar';
import ProfileDetailForm from './profileDetailForm';

const ProfilePage = async () => {
  return (
    <section className="p-6 md:p-10 min-h-screen w-full">
      <TopBar heading='My Profile'/>        
      <ProfileDetailForm />
    </section>
  )
}

export default ProfilePage