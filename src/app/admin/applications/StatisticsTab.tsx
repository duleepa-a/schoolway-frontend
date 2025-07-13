
import StatCard from '@/app/dashboardComponents/StatCard'
import DriverOverviewChart from '@/app/dashboardComponents/DriverOverviewChart'
import ActivityFeed from '@/app/dashboardComponents/ActivityFeed'
import DriverRatingChart from '@/app/dashboardComponents/DriverRatingChart'
import { FaFileAlt, FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaRedo } from 'react-icons/fa'


export default function StatisticsTab() {
  return (
    <div>
        <div className="grid grid-cols-5 gap-4 mb-10">
          <StatCard icon={<FaFileAlt className="text-xl" />} text="Total Recieved" number={100} />
          <StatCard icon={<FaHourglassHalf className="text-xl" />} text="Pending " number={122} />
          <StatCard icon={<FaCheckCircle className="text-xl" />} text="Approved" number={16} />
          <StatCard icon={<FaTimesCircle className="text-xl" />} text="Rejected" number={122} />
          <StatCard icon={<FaRedo className="text-xl" />} text="Re-submitted" number={16} />
        </div> 


        <div className='grid grid-cols-4 gap-1'>
            {/* 3-row section (left side) - Driver Overview Chart */}
            <div className="col-span-2 dashboard-section-card">
                <DriverOverviewChart />
            </div>

            {/* 2-row section (below it) */}
            <div className="col-span-2 dashboard-section-card">
                <DriverRatingChart />
        </div>
        
          {/* Full-height dense section (right column) */}
          
        </div>

        <div className="row-span-2 dashboard-section-card">
          <ActivityFeed />
        </div>

    </div>
  );
}
