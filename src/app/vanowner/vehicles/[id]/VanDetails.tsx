'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import { loadGoogleMapsAPI } from '@/lib/googleMapsLoader';
import { useEffect, useState } from 'react';
import { Edit2 } from 'lucide-react';
import FormInput from '@/app/components/FormInput';
import AddRoute from './AddRoute';

interface Assistant {
  name: string;
  nic: string;
  contact: string;
  profilePic: string;
  vanId: number;
}

interface Driver {
  firstname: string;
  lastname: string;
  nic: string;
  mobile: string;
  dp: string;
}

interface Van {
  id: number;
  makeAndModel: string;
  licensePlateNumber: string;
  registrationNumber: string;
  seatingCapacity: number;
  noOfStudentsAssigned : number;
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
  hasAssistant: boolean;
  status: number;
  Assistant?: Assistant | null;
  driver?: Driver | null;
  hasRoute: boolean;
  routeAssigned: boolean;
  pathId?: string;
  Path?: {
    id: string;
    routeStart: { lat: number; lng: number } | null;
    routeEnd: { lat: number; lng: number } | null;
    WayPoint: Array<{
      name: string;
      latitude: number;
      longitude: number;
      order: number;
      isStop: boolean;
    }>;
  } | null;
  routeStatus?: {
    hasStartLocation: boolean;
    hasEndLocation: boolean;
    waypointCount: number;
    isComplete: boolean;
    isEmpty: boolean;
  };
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
  // Handler for opening Add Route modal
  const handleAddRouteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAddRoute(true);
  };

  // Handler for closing Add Route modal
  const handleCloseAddRoute = () => {
    setShowAddRoute(false);
  };

  // Removed duplicate useState declarations for localVan and showAddRoute




  // Move all hooks to the top level
  const [localVan, setLocalVan] = useState<Van>(van);
  const [showAddRoute, setShowAddRoute] = useState(false);
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

      const newErrors: Record<string, string> = {};

      if (!formData.makeAndModel.trim()) newErrors.makeAndModel = 'Model is required';
      if (formData.seatingCapacity <= 0) newErrors.seatingCapacity = 'Must be greater than 0';
      if (formData.studentRating <= 0) newErrors.studentRating = 'Student rating must be positive';
      if (formData.privateRating <= 0) newErrors.privateRating = 'Private hire rating must be positive';
      if (formData.salaryPercentage < 0 || formData.salaryPercentage > 100) newErrors.salaryPercentage = 'Salary % must be between 0 and 100';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
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
    setLocalVan(prev => ({
      ...prev,
      ...updatedVan,
    }));
    alert('Van updated successfully');
    setIsModalOpen(false);
  };

  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    const loadMaps = async () => {
      try {
        await loadGoogleMapsAPI();
        setIsGoogleMapsLoaded(true);
      } catch (error) {
        console.error('Failed to load Google Maps API:', error);
      }
    };
    
    loadMaps();
  }, []);

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (isGoogleMapsLoaded && van.routeStart && van.routeEnd) {
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
  }, [isGoogleMapsLoaded, van.routeStart, van.routeEnd]);

  // Assistant Add Logic

  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);

  const [assistantFormData, setAssistantFormData] = useState({
    name:  van.assistant?.name || '',
    nic: van.assistant?.nic || '',
    contactNo: van.assistant?.contact || '',
    profilePicture: null as File | null,
  });

  const handleAssistantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    
    if (name === 'profilePicture' && files) {
      setAssistantFormData(prev => ({
        ...prev,
        profilePicture: files[0],
      }));
    } else {
      setAssistantFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleAssistantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    if (!assistantFormData.name.trim()) errors.name = 'Name is required';
    if (!assistantFormData.nic.trim()) errors.nic = 'NIC is required';
    if (!/^\d{10}$/.test(assistantFormData.contactNo)) errors.contactNo = 'Contact number must be 10 digits';

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const form = new FormData();
    form.append('name', assistantFormData.name);
    form.append('nic', assistantFormData.nic);
    form.append('contactNo', assistantFormData.contactNo);
    if (assistantFormData.profilePicture) {
      form.append('profilePicture', assistantFormData.profilePicture);
    }

    const method = van.hasAssistant ? 'PUT' : 'POST';

    const res = await fetch(`/api/vans/${van.id}/assistant`, {
      method,
      body: form,
    });

    if (!res.ok) {
      alert(`${van.hasAssistant ? 'Update' : 'Assignment'} failed`);
      return;
    }

    const data = await res.json();

    console.log('Assistant data:', data);

    setLocalVan(prev => ({
      ...prev,
      assistant: data.updatedAssistant,
      hasAssistant: true,
    }));

    alert(`Assistant ${van.hasAssistant ? 'updated' : 'assigned'} successfully`);
    setIsAssistantModalOpen(false);

  };


  if (showAddRoute) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Add Route for {van.makeAndModel}</h2>
            <button 
              onClick={handleCloseAddRoute}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="p-4">
            <AddRoute vehicleId={van.id} onClose={handleCloseAddRoute} isLoaded={isGoogleMapsLoaded} />
          </div>
        </div>
      </div>
    );
  }

  const renderRouteStatus = () => {
    if (van.routeAssigned) {
      return (
        <div className="text-green-600">
          Route Assigned ({van.Path?.WayPoint.length || 0} stops)
        </div>
      );
    }
    return <div className="text-red-600">Route Not Assigned</div>;
  };

  // Add this helper function inside the VanDetails component
  const renderRouteSection = () => {
    const status = van.routeStatus;

    // No route at all - no pathId
    if (!van.pathId || !status || status.isEmpty) {
      return (
        <div className="my-3 grid grid-cols-2">
          <div>
            <h2 className="text-base font-semibold mb-4">No Route Assigned</h2>
            <p className="text-sm text-gray-500 mb-4">Create a route to define the areas you cover</p>
          </div>
          <div className='flex items-center justify-center'>
            <button
              onClick={handleAddRouteClick}
              className="btn-secondary w-full max-w-[200px] py-3 rounded-2xl justify-center"
            >
              Add Route
            </button>
          </div>
        </div>
      );
    }

    // Route incomplete - missing start or end
    if (!status.hasStartLocation || !status.hasEndLocation) {
      return (
        <div className="my-3 grid grid-cols-2">
          <div>
            <h2 className="text-base font-semibold mb-4">Route Incomplete</h2>
            <p className="text-sm text-gray-500 mb-4">
              Start: {status.hasStartLocation ? '✓' : '✗'} | 
              End: {status.hasEndLocation ? '✓' : '✗'}
            </p>
          </div>
          <div className='flex items-center justify-center'>
            <button
              onClick={handleAddRouteClick}
              className="btn-small-primary font-bold w-full max-w-[200px] py-3 rounded-2xl"
            >
              Complete Route
            </button>
          </div>
        </div>
      );
    }

    // Route exists but no waypoints
    if (status.hasStartLocation && status.hasEndLocation && status.waypointCount === 0) {
      return (
        <div className="my-3 grid grid-cols-2">
          <div>
            <h2 className="text-base font-semibold mb-4">Route Created - Add Waypoints</h2>
            <p className="text-sm text-gray-500 mb-4">Add waypoints to better define the areas you cover</p>
          </div>
          <div className='flex items-center justify-center'>
            <button
              onClick={handleAddRouteClick}
              className="btn-small-primary font-bold w-full max-w-[200px] py-3 rounded-2xl"
            >
              Add Waypoints
            </button>
          </div>
        </div>
      );
    }

    // Complete route with waypoints - show Update Route button
    return (
      <div className="my-3 grid grid-cols-2">
        <div>
          <h2 className="text-base font-semibold mb-4 text-green-600">Route Assigned ✓</h2>
          <p className="text-sm text-gray-600 mb-4">
            {van.Path?.WayPoint?.length || 0} stops configured
          </p>
        </div>
        <div className='flex items-center justify-center'>
          <button
            onClick={handleAddRouteClick}
            className="btn-small-primary font-bold w-full max-w-[200px] py-3 rounded-2xl"
          >
            Update Route
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className=" grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Van Details */}
      <div className="bg-white rounded-2xl px-8 py-8 shadow-lg col-span-2">
          <h2 className="text-lg font-semibold mb-4">{localVan.makeAndModel}</h2>
        <div className="rounded-xl border-border-bold-shade border p-4 mb-4 flex">
          <div>
            <Image
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
              <div className="text-xs mb-1">Seats: {localVan.noOfStudentsAssigned}/ {localVan.seatingCapacity}</div>
              <div className='w-full flex justify-end'>
                <div className=" bg-gray-200 rounded-full h-1.5 w-${}/10">
                  <div className="bg-primary h-1.5 rounded-full " style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
            <p className='text-sm'><span className="font-medium">Student Rating per km:</span><span className="text-active-text"> Rs. {localVan.studentRating}</span></p>
            <p className='text-sm'><span className="font-medium">Private-Hire Rating per km:</span><span className="text-active-text"> Rs. {localVan.privateRating}</span></p>
            <p className='text-sm'><span className="font-medium">Salary Percentage</span><span className="text-active-text"> {localVan.salaryPercentage} %</span></p>
          </div>
        </div>
        {/* <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Actions</h3>
          <div className="relative">
            <ul>
              <li>Change Driver</li>
            </ul>
            
          </div>
        </div> */}
      </div>
      <div className='col-span-2 space-y-2'>
          {/* Driver & Assistant */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              {(van.status == 1) && <>
                { van.hasDriver ?
                <>
                  <h2 className="text-base font-semibold mb-4">Driver</h2>
                  <div className=" grid  grid-cols-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className=''> 
                        <Image
                                src={van.driver?.dp || '/Images/male_pro_pic_placeholder.png'}
                                alt="Assistant"
                                width={50}
                                height={50}
                                className="rounded-full object-cover"
                          /> 
                        </div>
                        <div>
                          <p className="font-medium text-sm">{van.driver?.firstname + " " + van.driver?.lastname}</p>
                          <p className="text-xs text-gray-500">NIC: {van.driver?.nic}</p>
                          <p className="text-xs text-gray-500">ContactNo: {van.driver?.mobile}</p>
                        </div>
                      </div>   
                    </div>
                    <div className='flex items-center justify-center'> 
                      <Link href={`/vanowner/vehicles/driver?vanId=${van.id}&vanMakeAndModel=${localVan.makeAndModel}`}>
                            <button className="btn-small-primary font-bold"
                            >
                              Change Driver
                            </button>
                      </Link>
                    </div>
                  </div>
                </> :

                <div className="my-3 grid  grid-cols-2">
                  <div>
                    <h2 className="text-base font-semibold mb-4">Driver Not Assigned</h2>
                    <p className="text-sm text-gray-500 mb-4">Please assign a driver to this van.</p>
                  </div>
                  <div className='flex items-center justify-center'> 
                    <Link href={`/vanowner/vehicles/driver?vanId=${van.id}&vanMakeAndModel=${localVan.makeAndModel}`}>
                      <button className="btn-secondary px-14 py-3 rounded-2xl">Find a Driver</button>
                    </Link>
                  </div>
                </div>

                } 
                { van.hasAssistant ? 
                  <>
                    <h2 className="text-base font-semibold mb-4">Assistant</h2>
                      <div className="grid grid-cols-2">
                        <div className="flex items-center space-x-4">
                          <div>
                            <Image
                              src={localVan.Assistant?.profilePic || '/Images/male_pro_pic_placeholder.png'}
                              alt="Assistant"
                              width={50}
                              height={50}
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{localVan.Assistant?.name}</p>
                            <p className="text-xs text-gray-500">NIC: {localVan.Assistant?.nic}</p>
                            <p className="text-xs text-gray-500">Contact: {localVan.Assistant?.contact}</p>
                          </div>
                        </div>
                        <div className='flex items-center justify-center'> 
                            <button className="btn-small-primary font-bold"
                              onClick={() => setIsAssistantModalOpen(true)}
                            >
                              Update Assistant
                            </button>
                        </div>
                      </div>
                  </>
                :

                <div className="my-3 grid grid-cols-2">
                  <div>
                    <h2 className="text-base font-semibold mb-4">Assistant Not Assigned</h2>
                    <p className="text-sm text-gray-500 mb-4">Please assign an assistant to this van.</p>
                  </div>
                  <div className='flex items-center justify-center'>
                    <button className="btn-secondary px-8 py-3 rounded-2xl"
                      onClick={() => setIsAssistantModalOpen(true)}
                    >
                      Assign an Assistant
                    </button>
                  </div>
                </div>

                }
                
                {renderRouteSection()}
                  
              </> 
              } 

            {!van.status && (
                <div className=" my-12">
                  <h2 className="text-base font-semibold mb-4">Van Not Approved</h2>
                  <p className="text-sm text-gray-500 mb-4">Please wait for the approval of your van.</p>
                </div>
              ) 
            }
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg col-span-2">
              <h2 className="text-base font-semibold mb-4">Current Route</h2>
              {isGoogleMapsLoaded && (
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '300px' }}
                      center={{ lat: 7.8731, lng: 80.7718 }}
                      zoom={10}
                    >
                      {directions && <DirectionsRenderer directions={directions} />}
                    </GoogleMap>
                )}
              {!isGoogleMapsLoaded && <p>Loading map...</p>}
            </div>
      </div>

      {/*Van Details Editing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Van Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                {/* <FormInput
                  type="text"
                  name="makeAndModel"
                  label='Van Model'
                  value={formData.makeAndModel}
                  onChange={handleChange}
                  placeholder="Enter van model"
                  error={errors.makeAndModel}
                /> */}
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
                  label='Student Rating per km per month (Rs.)'
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

      {/*Add Assistant Modal */}
      {isAssistantModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Assign Assistant</h2>
            <form onSubmit={handleAssistantSubmit} className="space-y-4">
              <FormInput
                type="text"
                name="name"
                label="Assistant Name"
                value={assistantFormData.name}
                error={errors.name}
                onChange={handleAssistantChange}
                placeholder="Enter assistant name"
              />

              <FormInput
                type="text"
                name="nic"
                label="NIC"
                value={assistantFormData.nic}
                onChange={handleAssistantChange}
                error={errors.nic}
                placeholder="Enter NIC"
              />

              <FormInput
                type="text"
                name="contactNo"
                label="Contact Number"
                value={assistantFormData.contactNo}
                error={errors.contactNo}
                onChange={handleAssistantChange}
                placeholder="Enter contact number"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                <input
                  type="file"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleAssistantChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAssistantModalOpen(false)}
                  className="btn-secondary px-4 py-2"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-4 py-2">
                  Assign
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Add Route Modal - Using showAddRoute state */}
      {/* Note: We're now handling this with showAddRoute at the top of the component */}


    </div>
  );
};

export default VanDetails;
