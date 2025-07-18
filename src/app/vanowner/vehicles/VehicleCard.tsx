import Link from 'next/link';
import React from 'react';
import { PiStarFill,PiSeatFill } from "react-icons/pi";
import { MdLocalGasStation } from "react-icons/md";
import { FaTemperatureLow } from "react-icons/fa";


interface Vehicle {
  id: number;
  registrationNumber: string;
  licensePlateNumber: string;
  makeAndModel: string;
  seatingCapacity: number;
  acCondition: boolean;
  routeStart?: string;
  routeEnd?: string;
  photoUrl: string;
  hasDriver: boolean;
  isApproved: boolean;
}

const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="relative h-52">
        <img
          src={vehicle.photoUrl || '/Images/vehicle_placeholder.png'}
          alt={vehicle.makeAndModel}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900">
              {vehicle.makeAndModel}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              !(vehicle.isApproved) ? 'bg-statusbackgroundyellow text-statusyellow' :  vehicle.hasDriver ? 'bg-statusbackgroundblue text-statusbackgroundblue' : 'bg-statusbackgroundorange text-statusorange'
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
            <MdLocalGasStation className="text-base" />
            <span className="text-xs">Petrol</span> 
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
      </div>
    </div>
  );
};


export default VehicleCard