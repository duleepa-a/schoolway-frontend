'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { Edit2 } from 'lucide-react';
import FormInput from '@/app/components/FormInput';

interface Van {
  id: number;
  makeAndModel: string;
  licensePlateNumber: string;
  registrationNumber: string;
  seatingCapacity: number;
  acCondition: boolean;
  routeStart?: string;
  routeEnd?: string;
  photoUrl: string;
  studentRating: number;
  privateRating: number;
  startTime?: string;
  endTime?: string;
  salaryPercentage: number;
  hasDriver: boolean;
  isApproved: boolean;
}

interface FormData {

  makeAndModel: string;
  seatingCapacity: number;
  studentRating: number;
  privateRating: number;
  salaryPercentage: number;
  vanId?: number;
}

const VanDetails = ({ van }: { van: Van }) => {

  const [localVan, setLocalVan] = useState<Van>(van);

  useEffect(() => {
    setLocalVan(van);
  }, [van]);

  const schools = [
    'Good Shephard Convent - Watthala',
    "St. Lucia's Collage",
    "St. Benedict's Primary School",
    "St. Benedict's Upper School",
    'Good Shephard Convent - Kotahena',
    "Roman Catholic's Girl's School - Kotahena",
  ];

  const students = [
    { name: 'Ayanga Wethmini', time: '1:30 PM', image: '/Images/male_pro_pic_placeholder.png' },
    { name: 'Ayanga Wethmini', time: '1:30 PM', image: '/Images/male_pro_pic_placeholder.png' },
    { name: 'Ayanga Wethmini', time: '1:30 PM', image: '/Images/male_pro_pic_placeholder.png' },
  ];


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    makeAndModel: van.makeAndModel,
    seatingCapacity: van.seatingCapacity,
    studentRating: van.studentRating,
    privateRating: van.privateRating,
    salaryPercentage: van.salaryPercentage,
  });

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     const res = await fetch(`/api/vans/${van.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        makeAndModel: formData.makeAndModel,
        seatingCapacity: Number(formData.seatingCapacity),
        studentRating: Number(formData.studentRating),
        privateRating: Number(formData.privateRating),
        salaryPercentage: Number(formData.salaryPercentage),
      }),
    });

    if (!res.ok) {
      alert('Update failed');
      return;
    }

    const updatedVan = await res.json();
    setLocalVan(updatedVan); 
    alert('Van updated successfully');
    setIsModalOpen(false);
};

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (isLoaded && van.routeStart && van.routeEnd) {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: van.routeStart,
          destination: van.routeEnd,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
          } else {
            console.error('Failed to fetch directions', result);
          }
        }
      );
    }
  }, [isLoaded, van.routeStart, van.routeEnd]);

  return (
    <div className=" grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Van Details */}
      <div className="bg-white rounded-2xl px-8 py-8 shadow-lg col-span-2">
          <h2 className="text-lg font-semibold mb-4">{localVan.makeAndModel}</h2>
        <div className="rounded-xl border-border-bold-shade border p-4 mb-4 flex">
          <div>
            <img
              src={localVan.photoUrl || '/Images/vehicle_placeholder.png'}
              alt="Van"
              width={250}
              height={150}
              className="rounded-lg mb-4"
            />
          </div>
          <div className='p-2.5 w-full gap-5'>
            <div className="flex items-center justify-between">
              <p className='text-sm'><span className="font-medium">Van ID:</span> <span className="text-active-text">{van.id}</span></p>
              <button className='cursor-pointer' onClick={handleEditClick}><Edit2 size={15}/></button>
            </div>
            <p className='text-sm'><span className="font-medium">Model:</span> {localVan.makeAndModel}</p>
            <div className="my-2">
              <div className="text-xs mb-1">Seats: 5 / {localVan.seatingCapacity}</div>
              <div className='w-full flex justify-end'>
                <div className=" bg-gray-200 rounded-full h-1.5 w-9/10">
                  <div className="bg-primary h-1.5 rounded-full " style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
            <p className='text-sm'><span className="font-medium">Student Rating per km:</span><span className="text-active-text"> Rs. {localVan.studentRating}</span></p>
            <p className='text-sm'><span className="font-medium">Private-Hire Rating per km:</span><span className="text-active-text"> Rs. {localVan.privateRating}</span></p>
            <p className='text-sm'><span className="font-medium">Salary Percentage</span><span className="text-active-text"> {localVan.salaryPercentage} %</span></p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Schools</h3>
          <div className="relative">
            <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gray-300"></div>
              <ul className="space-y-3">
                {schools.map((school, idx) => (
                  <li key={idx} className="flex items-start relative">
                    <div className="relative z-10 flex-shrink-0 mt-1">
                      {idx === 3 ? (
                        <div className="w-3 h-3 rounded-full border-2 border-yellow-500 bg-white"></div>
                      ) : (
                        <div className={`w-3 h-3 rounded-full ${
                          idx < 4 ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></div>
                      )}
                    </div>
                    
                    <span className="ml-4 text-sm text-gray-600 leading-relaxed">
                      {school}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
      </div>
      <div className='col-span-2 space-y-2'>
          {/* Driver & Assistant */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              {(van.hasDriver &&  van.isApproved) ?? <>
                <h2 className="text-base font-semibold mb-4">Driver</h2>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className=''> 
                      <Image src="/Images/male_pro_pic_placeholder.png" alt="Driver" width={50} height={50} className="rounded-full" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Duleepa Edirisinghe</p>
                      <p className="text-xs text-gray-500">Experience: 6 years</p>
                      <p className="text-yellow-500">⭐⭐⭐⭐⭐</p>
                    </div>
                  </div>
                  <button className="btn-small-primary ml-4">More Options</button>
                </div>
                <h2 className="text-base font-semibold mb-4">Assistant</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className=''> 
                      <Image src="/Images/male_pro_pic_placeholder.png" alt="Assistant" width={50} height={50} className="rounded-full" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Ayanga Wethmini</p>
                      <p className="text-xs text-gray-500">Experience: 7 years</p>
                      <p className="text-yellow-500">⭐⭐⭐⭐⭐</p>
                    </div>
                  </div>
                  <button className="btn-small-primary ml-4">More Options</button>
                </div>
              </> } 
              {(!van.hasDriver &&  van.isApproved) && (
                <div className=" my-6">
                  <h2 className="text-base font-semibold mb-4">Driver Not Assigned</h2>
                  <p className="text-sm text-gray-500 mb-4">Please assign a driver to this van.</p>
                  <Link href={`/vanowner/vehicles/driver?vanId=${van.id}&vanMakeAndModel=${van.makeAndModel}`}>
                    <button className="btn-small-primary">Find a Driver</button>
                  </Link>
                </div>
            ) } 

            {!(van.hasDriver) && !van.isApproved && (
                <div className=" my-12">
                  <h2 className="text-base font-semibold mb-4">Van Not Approved</h2>
                  <p className="text-sm text-gray-500 mb-4">Please wait for the approval of your van.</p>
                </div>
              ) 
            }
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg col-span-2">
              <h2 className="text-base font-semibold mb-4">Current Route</h2>
              {isLoaded && (
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '300px' }}
                      center={{ lat: 7.8731, lng: 80.7718 }}
                      zoom={10}
                    >
                      {directions && <DirectionsRenderer directions={directions} />}
                    </GoogleMap>
                )}
              {!isLoaded && <p>Loading map...</p>}
            </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Van Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <FormInput
                  type="text"
                  name="makeAndModel"
                  label='Van Model'
                  value={formData.makeAndModel}
                  onChange={handleChange}
                  placeholder="Enter van model"
                  error={errors.makeAndModel}
                />
              </div>

              <div>
                <FormInput
                  type="number"
                  label='Seating Capacity'
                  name="seatingCapacity"
                  value={formData.seatingCapacity.toString()}
                  onChange={handleChange}
                  placeholder="Enter seating capacity"
                  error={errors.seatingCapacity}
                />
              </div>

              <div>
                <FormInput
                  type="number"
                  name="studentRating"
                  label='Student Rating per km'
                  value={formData.studentRating.toString()}
                  onChange={handleChange}
                  placeholder="Enter van model"
                  error={errors.makeAndModel}
                />
              </div>

              <div>
                <FormInput
                  type="number"
                  name="privateRating"
                  label='Private-Hire Rating per km'
                  value={formData.privateRating.toString()}
                  onChange={handleChange}
                  placeholder="Enter Private-Hire Rating"
                  error={errors.makeAndModel}
                />
              </div>

              <div>
                <FormInput
                  type="number"
                  label='Salary Percentage'
                  name="salaryPercentage"
                  value={formData.salaryPercentage.toString()}
                  onChange={handleChange}
                  placeholder="Enter salary percentage"
                  error={errors.makeAndModel}
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary px-4 py-2">
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-4 py-2">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VanDetails;
