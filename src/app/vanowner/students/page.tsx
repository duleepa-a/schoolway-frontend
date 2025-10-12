import React from 'react'
import StudentDetailTab from './StudentDetailTab';
import TopBar from '@/app/dashboardComponents/TopBar';

const studentsPage = () => {
  return (
  <section className="p-6 md:p-10 min-h-screen w-full">
        <TopBar heading='Students'/>
        <StudentDetailTab/>       
  </section>
  )
}

export default studentsPage