'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { PiSeatFill } from "react-icons/pi";
import { FaTemperatureLow } from "react-icons/fa";
import AddRoute from './[id]/AddRoute';


interface Vehicle {
  id: number;
  registrationNumber: string;
  licensePlateNumber: string;
  makeAndModel: string;
  seatingCapacity: number;
  acCondition: boolean;
  routeStart?: string;
  routeEnd?: string;
  startTime?: string;
  endTime?: string;
  studentRating?: number;
  driverRating?: number;
  photoUrl: string;
  hasDriver: boolean;
  isApproved: boolean;
}

const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  const [showAddRoute, setShowAddRoute] = useState(false);

  const handleAddRouteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAddRoute(true);
  };

  const handleCloseAddRoute = () => {
    setShowAddRoute(false);
  };

  if (showAddRoute) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Add Route for {vehicle.makeAndModel}</h2>
            <button 
              onClick={handleCloseAddRoute}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="p-4">
            <AddRoute vehicleId={vehicle.id} onClose={handleCloseAddRoute} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="relative h-52">
        <Image
          src={vehicle.photoUrl || '/Images/vehicle_placeholder.png'}
          alt={vehicle.makeAndModel}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900">
              {vehicle.makeAndModel}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              !(vehicle.isApproved) ? 'bg-statusbackgroundyellow text-statusyellow' :  vehicle.hasDriver ? 'bg-statusbackgroundblue text-statusblue' : 'bg-statusbackgroundorange text-statusorange'
            }`}>
              {!(vehicle.isApproved) ? 'Pending': vehicle.hasDriver ? 'With Driver' : 'Driver Not Assigned'}
            </span>
        </div>

        {vehicle.routeStart && vehicle.routeEnd && (
          <p className="text-sm text-gray-600 mb-2">
            {vehicle.routeStart} → {vehicle.routeEnd}
          </p>
        )}

        <div className="flex items-center justify-start gap-4 text-sm text-gray-600 mb-5">
          <div className="flex items-center space-x-1">
            <span className="text-xs">Rating per Km : Rs.{vehicle.studentRating}</span> 
          </div>

          <div className="flex items-center space-x-1">
            <PiSeatFill className="text-base" />
            <span className="text-xs">{vehicle.seatingCapacity} Seats</span>
          </div>

          <div className="flex items-center space-x-1">
            <FaTemperatureLow className="text-base" />
            <span className="text-xs">
              {vehicle.acCondition ? 'A/C' : 'Non A/C'}
            </span>
          </div>
        </div>

        <Link href={`/vanowner/vehicles/${vehicle.id}`}>
          <button className="text-sm w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer">
            View Details
          </button>
        </Link>
        
        <button 
          onClick={handleAddRouteClick}
          className="text-sm w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer mt-5"
        >
          Add route
        </button>
      </div>
    </div>
  );
};


export default VehicleCard