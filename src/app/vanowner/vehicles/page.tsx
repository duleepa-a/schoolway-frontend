import React from 'react';
import {FaBell, FaMoon } from 'react-icons/fa';
import Image from 'next/image';
import VehicleCard from './VehicleCard';


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
        <div className="flex justify-between items-center mt-10 mb-2.5">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Vehicles</h2>
          </div>
          <div className='bg-white flex justify-end items-center gap-4 mb-6 py-1 px-6 rounded-4xl w-fit'>
            <FaBell className="text-gray-500 hover:text-gray-700 cursor-pointer ml-5" />
            <FaMoon className="text-gray-500 hover:text-gray-700 cursor-pointer" />
            <Image
              src="/Images/male_pro_pic_placeholder.png"
              alt="Profile"
              width={50}
              height={50}
              className="rounded-full object-cover border ml-14"
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