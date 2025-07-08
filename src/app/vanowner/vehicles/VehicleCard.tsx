import Link from 'next/link';
import React from 'react';
import { PiStarFill,PiSeatFill } from "react-icons/pi";
import { MdLocalGasStation } from "react-icons/md";
import { FaTemperatureLow } from "react-icons/fa";



const VehicleCard = ({ 
  vehicle = {
    id: 1,
    name: "Toyota HIACE Spec 10",
    image: "./Images/vehicle_placeholder.png",
    rating: 4,
    totalRatings: 5,
    fuel: "Petrol",
    seats: 15,
    transmission: "A/C"
  }
}) => {
  const renderStars = (rating : number , total = 5) => {
    return Array.from({ length: total }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        <PiStarFill/>
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Vehicle Image */}
      <div className="relative h-52">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover"
        />
        {/* Optional: Add a subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Vehicle Name */}
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          {vehicle.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {renderStars(vehicle.rating)}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            ({vehicle.totalRatings})
          </span>
        </div>

        {/* Vehicle Specifications */}
        <div className="flex items-center justify-start gap-2 mb-5 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MdLocalGasStation className='text-sm'/>
            <span className='text-xs'>{vehicle.fuel}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <PiSeatFill className='text-sm'/>
            <span className='text-xs'>{vehicle.seats} Seats</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <FaTemperatureLow className='text-sm'/>
            <span className='text-xs'>{vehicle.transmission}</span>
          </div>
        </div>

        {/* View Details Button */}
        <Link href={'/vanowner/vehicles/van'}>
          <button className="text-sm w-full bg-gray-900 text-white py-3 px-4 rounded-lg  hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};


export default VehicleCard