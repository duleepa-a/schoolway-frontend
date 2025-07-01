'use client';

import { FaChartBar, FaBus, FaUser } from 'react-icons/fa';
import EarningsChart from './components/EarningsChart';
import TopBar from '../dashboardComponents/TopBar';
import StatCard from '../dashboardComponents/StatCard';

const AdminDashboard = () => {

  return (

      <section className="p-5 md:p-10 min-h-screen w-full">
        {/*Top bar with profile icon and the heading*/}
        <TopBar heading = "Dashboard" />       

        {/* User Stats */}
        <h3>User Statistics</h3>
        <div className="grid grid-cols-3 gap-4 mb-10">
          <StatCard icon={<FaChartBar className="text-xl" />} text="Van Drivers" number={100} />
          <StatCard icon={<FaBus className="text-xl" />} text="Van Owners" number={122} />
          <StatCard icon={<FaUser className="text-xl" />} text="Parents" number={16} />
        </div>

         {/* Earning Stats */}
         <h3>Revenue Statistics</h3>
        <div className="grid grid-cols-3 gap-4 mb-10">
          <StatCard icon={<FaChartBar className="text-xl" />} text="Total Earnings" number={100} />
          <StatCard icon={<FaBus className="text-xl" />} text="Spent this month" number={122} />
          <StatCard icon={<FaUser className="text-xl" />} text="Revenue" number={16} />
        </div>

        


      <div className='flex gap-4'>
          
          <EarningsChart/>
          <EarningsChart/>

      </div>
    </section>
  )
}

export default AdminDashboard