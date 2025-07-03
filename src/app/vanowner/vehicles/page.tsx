import React from 'react';
import {FaBell, FaMoon } from 'react-icons/fa';
import Image from 'next/image';
import VehicleCard from './VehicleCard';
import TopBar from '@/app/dashboardComponents/TopBar';
import { FaSearch,FaChevronDown } from 'react-icons/fa';


const vehiclesPage = () => {
  
  const vehicles = [
    {
      id: 1,
      name: "Toyota HIACE Spec 12",
      image: "/Images/vehicle_placeholder.png",
      rating: 4,
      totalRatings: 5,
      fuel: "Petrol",
      seats: 15,
      transmission: "A/C"
    },
    {
      id: 2,
      name: "Toyota HIACE Spec 10",
      image: "/Images/vehicle_placeholder.png",
      rating: 4,
      totalRatings: 5,
      fuel: "Petrol",
      seats: 15,
      transmission: "A/C"
    },
    {
      id: 3,
      name: "Toyota HIACE Spec 10",
      image: "/Images/vehicle_placeholder.png",
      rating: 4,
      totalRatings: 5,
      fuel: "Petrol",
      seats: 15,
      transmission: "A/C"
    }
  ];

  return (
    <section className="p-6 md:p-10 min-h-screen w-full">
        {/* Top Right Icons */}
        <TopBar heading = "My Vehicles" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between lg:justify-start  mb-4 gap-4">
                <div className="relative w-full md:w-1/3">
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vehicle"
                    className="
                    w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md  bg-search-bar-bg"
                  />
                </div>
                
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>        

       
    </section>
  )
}

export default vehiclesPage