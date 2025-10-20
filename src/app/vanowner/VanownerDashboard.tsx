'use client';
import { FaBus, FaUsers, FaRoute, FaBell, FaMoon } from 'react-icons/fa';
import { TbMoneybag } from "react-icons/tb";
import EarningsChart from './EarningsChart';
import TopBar from '../dashboardComponents/TopBar';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Define the type for our dashboard stats
interface DashboardStats {
  totalVans: number;
  vansWithRoutes: number;
  vansWithDrivers: number;
  vansWithoutRoutes: number;
  vansWithoutDrivers: number;
}

const vans = [
  { id: 'V001', driver: 'Lehan Munasinghe', capacity: 12, route: 'Route A', status: 'Active' },
  { id: 'V002', driver: 'Ayanga Wethmini', capacity: 10, route: 'Route B', status: 'Inactive' },
  { id: 'V003', driver: 'Dineth Palliyaguru', capacity: 15, route: 'Route C', status: 'Active' },
];

const VanOwnerDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalVans: 0,
    vansWithRoutes: 0,
    vansWithDrivers: 0,
    vansWithoutRoutes: 0,
    vansWithoutDrivers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchDashboardStats = async () => {
  //     try {
  //       const response = await fetch('/api/vanowner/dashboard/get-stats');
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch dashboard stats');
  //       }
  //       const data = await response.json();
  //       setStats(data);
  //     } catch (err) {
  //       console.error('Error fetching dashboard stats:', err);
  //       setError('Failed to load dashboard statistics');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDashboardStats();
  // }, []);

  return (
    <section className="p-6 md:p-10 min-h-screen w-full bg-page-background">
      {/* Top Right Icons */}
      <TopBar heading = "Dashboard" />        

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-card p-6 flex items-center gap-4">
          <div className="p-3  rounded-full text-[var(--blue-shade-dark)]">
            <FaBus className="text-xl" />
          </div>
          <div>
            <p className="text-xs font-medium">Total Vans</p>
            <p className="font-bold text-xl text-swblue">
              {loading ? '...' : stats.totalVans}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 flex items-center gap-4">
          <div className="p-3  rounded-full text-[var(--blue-shade-dark)]">
            <FaUsers className="text-xl" />
          </div>
          <div>
            <p className=" text-xs font-medium">Total Drivers</p>
            <p className="font-bold text-xl text-swblue">
              {loading ? '...' : stats.vansWithDrivers}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 flex items-center gap-4">
          <div className="p-3 rounded-full text-[var(--blue-shade-dark)]">
            <FaRoute className="text-xl" />
          </div>
          <div>
            <p className=" text-xs font-medium">Routes Covered</p>
            <p className="font-bold text-xl text-swblue">
              {loading ? '...' : stats.vansWithRoutes}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 flex items-center gap-4">
          <div className="p-3  rounded-full text-[var(--blue-shade-dark)]">
            <TbMoneybag className="text-xl" />
          </div>
          <div>
            <p className=" text-xs font-medium">Revenue</p>
            <p className="font-bold text-xl text-swblue">
              {'Rs.5000'}
            </p>
          </div>
        </div>
      </div>

      {/* Error message if any */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className='flex flex-col lg:flex-row gap-8'>
        <div className="flex-1 min-w-[300px] flex flex-col min-h-[340px]">
          <div className="flex-1 flex flex-col">
            <EarningsChart/>
          </div>
        </div>
        <div className="bg-white shadow-card rounded-2xl p-0 min-h-[340px] min-w-[320px] flex flex-col">
          <h3 className="text-lg font-semibold px-6 pt-6 pb-2 text-swblue">My Vans</h3>
          <div className="flex-1 flex flex-col justify-between">
            <div className="overflow-x-auto px-2 pb-2">
              <table className="w-full text-sm rounded-2xl overflow-hidden">
                <thead>
                  <tr className="bg-[var(--blue-shade-dark)] text-white">
                    <th className="px-4 py-3 text-left font-semibold">Van ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Driver</th>
                    <th className="px-4 py-3 text-left font-semibold">Capacity</th>
                    <th className="px-4 py-3 text-left font-semibold">Route</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vans.map((van, idx) => (
                    <tr
                      key={van.id}
                      className={`transition-colors ${idx % 2 === 0 ? 'bg-blue-shade-light/10' : 'bg-white'} hover:bg-[var(--blue-shade-light)]/20`}
                    >
                      <td className="px-4 py-3 font-medium text-swblue rounded-l-xl">{van.id}</td>
                      <td className="px-4 py-3 text-blue-shade-dark/90">{van.driver}</td>
                      <td className="px-4 py-3 text-blue-shade-dark/90">{van.capacity}</td>
                      <td className="px-4 py-3 text-blue-shade-dark/90">{van.route}</td>
                      <td className="px-4 py-3 rounded-r-xl">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            van.status === 'Active'
                              ? 'bg-[var(--green-shade-light)]/20 text-[var(--green-shade-dark)]'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {van.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                <div className="flex justify-end mt-10">
                  <Link href="/vanowner/vehicles">
                  <button className='btn-secondary p-2'>Manage Vehicles</button>
                  </Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VanOwnerDashboard;