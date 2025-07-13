'use client';

import { FaChartBar, FaBus, FaUser, FaMoneyBill, FaCalendar, FaCreditCard } from 'react-icons/fa';
import EarningsChart from './components/EarningsChart';
import TopBar from '../dashboardComponents/TopBar';
import StatCard from '../dashboardComponents/StatCard';
import ActivityFeed from '../dashboardComponents/ActivityFeed';

const AdminDashboard = () => {
  return (
    <section className="p-5 md:p-10 min-h-screen w-full">
      {/*Top bar with profile icon and the heading*/}
      <TopBar heading="Dashboard" />       

      

      {/* Earnings Chart and Activity Feed side by side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Earnings Chart - takes up 2/3 of the space */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4 border border-gray-200">
          {/* Stats Grid - 2 rows of 3 cards as shown in the layout image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Row 1 */}
        <StatCard icon={<FaChartBar className="text-xl" />} text="Van Drivers" number={100} />
        <StatCard icon={<FaBus className="text-xl" />} text="Van Owners" number={122} />
        <StatCard icon={<FaUser className="text-xl" />} text="Parents" number={16} />
        
        {/* Row 2 */}
        <StatCard icon={<FaMoneyBill className="text-xl" />} text="Total Earnings" number={2500} />
        <StatCard icon={<FaCalendar className="text-xl" />} text="Monthly Revenue" number={750} />
        <StatCard icon={<FaCreditCard className="text-xl" />} text="Pending Payments" number={14} />
      </div>
          <h2 className="text-lg font-semibold mb-4">Earnings Chart</h2>
          <EarningsChart />
        </div>
        
        {/* Activity Feed - takes up 1/3 of the space */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <ActivityFeed />
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;