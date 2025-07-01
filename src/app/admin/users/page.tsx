'use client';
import TopBar from '@/app/dashboardComponents/TopBar';
import UserFilterBar from '@/app/dashboardComponents/SearchFilter';

const AdminDashboard = () => {

  return (

      <section className="p-5 md:p-10 min-h-screen w-full">
        {/*Top bar with profile icon and the heading*/}
        <TopBar heading= "Users" />     

        <UserFilterBar />  

        

      
    </section>
  )
}

export default AdminDashboard
