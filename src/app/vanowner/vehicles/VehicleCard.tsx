import Link from 'next/link';
import React from 'react';
import { PiStarFill } from "react-icons/pi";


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
        <div className="flex items-center justify-between mb-5 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
            <span className='text-sm'>{vehicle.fuel}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
            </svg>
            <span className='text-sm'>{vehicle.seats} Seats</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
            </svg>
            <span className='text-sm'>{vehicle.transmission}</span>
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