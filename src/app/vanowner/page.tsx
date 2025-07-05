'use client';

import { FaBus, FaUsers, FaRoute, FaBell, FaMoon } from 'react-icons/fa';
import { TbMoneybag } from "react-icons/tb";
import Image from 'next/image';
import EarningsChart from './EarningsChart';
import TopBar from '../dashboardComponents/TopBar';

const vans = [
  { id: 'V001', driver: 'Lehan Munasinghe', capacity: 12, route: 'Route A', status: 'Active' },
  { id: 'V002', driver: 'Ayanga Wethmini', capacity: 10, route: 'Route B', status: 'Inactive' },
  { id: 'V003', driver: 'Dineth Palliyaguru', capacity: 15, route: 'Route C', status: 'Active' },
];


const VanOwnerDashboard = () => {

  return (

      <section className="p-6 md:p-10 min-h-screen w-full">
        {/* Top Right Icons */}
        <TopBar heading = "Dashboard" />        

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
            <div className="p-3 bg-page-background rounded-full text-primary">
              <FaBus className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Vans</p>
              <p className="font-semibold text-lg text-gray-800">{vans.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
            <div className="p-3 bg-page-background rounded-full text-primary">
              <FaUsers className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Drivers</p>
              <p className="font-semibold text-lg text-gray-800">
                {[...new Set(vans.map((v) => v.driver))].length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
            <div className="p-3 bg-page-background rounded-full text-primary">
              <FaRoute className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Routes Covered</p>
              <p className="font-semibold text-lg text-gray-800">
                {[...new Set(vans.map((v) => v.route))].length}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
            <div className="p-3 bg-page-background rounded-full text-primary">
              <TbMoneybag className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Revenue</p>
              <p className="font-semibold text-lg text-gray-800">
                {'Rs.5000'}
              </p>
            </div>
          </div>
        </div>

      <div className='flex gap-4'>
          
          <EarningsChart/>

          <div className="bg-white shadow rounded-xl p-6 h-fit">
            <h3 className="text-lg font-semibold mb-4 ">My Vans</h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-4 py-2 text-left">Van ID</th>
                    <th className="px-4 py-2 text-left">Driver</th>
                    <th className="px-4 py-2 text-left">Capacity</th>
                    <th className="px-4 py-2 text-left">Route</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vans.map((van) => (
                    <tr key={van.id} className="border-b-2 border-b-border-light-shade hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{van.id}</td>
                      <td className="px-4 py-2">{van.driver}</td>
                      <td className="px-4 py-2">{van.capacity}</td>
                      <td className="px-4 py-2">{van.route}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            van.status === 'Active'
                              ? 'bg-green-100 text-green-700'
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
            </div>
          </div>
      </div>
    </section>
  )
}

export default VanOwnerDashboard