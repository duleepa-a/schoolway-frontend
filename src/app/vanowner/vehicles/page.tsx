'use client'
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdAddCircle } from 'react-icons/io';
import VehicleCard from './VehicleCard';
import TopBar from '@/app/dashboardComponents/TopBar';
import FormInput from '@/app/components/FormInput';
import { MdOutlineClose } from "react-icons/md";
import FormDateInput from '@/app/components/FormDateInput';
import TablePagination from '@/app/components/TablePagination';


const VehiclesPage = () => {

  const [formData, setFormData] = useState({
    model: '',
    seats: '',
    ac: '',
    license: '',
    fuel: '',
    expireDate: '',
    image: null as File | null
  });

  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.seats) newErrors.seats = 'Seating capacity is required';
    if (!formData.ac) newErrors.ac = 'Select A/C condition';
    if (!formData.license.trim()) newErrors.license = 'License plate required';
    if (!formData.fuel.trim()) newErrors.fuel = 'Fuel type required';
    if (!formData.image) newErrors.image = 'Vehicle image required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Submitting:', formData);
      // handle actual submit logic here (e.g., API call)
      setShowForm(false);
      setFormData({
        model: '',
        seats: '',
        ac: '',
        license: '',
        fuel: '',
        expireDate: '',
        image: null
      });
    }
  };


  const [showForm, setShowForm] = useState(false);

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
      name: "Toyota HIACE Spec 12",
      image: "/Images/vehicle_placeholder.png",
      rating: 4,
      totalRatings: 5,
      fuel: "Petrol",
      seats: 15,
      transmission: "A/C"
    },
    // ... more vehicles
  ];

  const handleAddVehicleClick = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  return (
    <section className="p-6 md:p-10 min-h-screen w-full">
      <TopBar heading="My Vehicles" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between lg:justify-start mb-4 gap-4">
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search vehicle"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-search-bar-bg"
          />
        </div>

        <button onClick={handleAddVehicleClick} className="btn-secondary flex items-center gap-2">
          <span>Add Vehicle</span>
          <IoMdAddCircle className="size-5" />
        </button>
        <TablePagination totalPages={5}/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative">
            {/* Close Button */}
            <button
              onClick={handleCloseForm}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl cursor-pointer"
            >
              <MdOutlineClose className='hover:text-error-color'/>
            </button>

            {/* Heading */}
            <h2 className="text-xl font-semibold text-active-text mb-6">Add New Vehicle</h2>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Row 1: Image Upload + Model */}
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Vehicle Model"
                  name="model"
                  placeholder="e.g. Toyota HIACE Spec 10"
                  value={formData.model}
                  onChange={handleInputChange}
                  error={errors.model}
                />

                <div>
                  <label className="block mb-1 font-medium">Vehicle Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  {errors.image && (
                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Seats + A/C */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <FormInput
                  label="Seating Capacity"
                  name="seats"
                  type="number"
                  placeholder="e.g. 15"
                  value={formData.seats}
                  onChange={handleInputChange}
                  error={errors.seats}
                />

                <div>
                  <label className="block mb-1 font-medium">A/C Condition</label>
                  <select
                    name="ac"
                    value={formData.ac}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select</option>
                    <option value="A/C">A/C</option>
                    <option value="Non A/C">Non A/C</option>
                  </select>
                  {errors.ac && (
                    <p className="text-red-500 text-sm mt-1">{errors.ac}</p>
                  )}
                </div>
              </div>

              {/* Row 3: License + Fuel */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <FormInput
                  label="License Plate"
                  name="license"
                  placeholder="e.g. ABC-1234"
                  value={formData.license}
                  onChange={handleInputChange}
                  error={errors.license}
                />

                <FormInput
                  label="Fuel Type"
                  name="fuel"
                  placeholder="e.g. Petrol"
                  value={formData.fuel}
                  onChange={handleInputChange}
                  error={errors.fuel}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">License Documents</label>
                  <input
                    type="file"
                    name="license documents"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  {errors.image && (
                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                  )}
                </div>

                <FormDateInput
                  label="License Expire Date"
                  name="expireDate"
                  value={formData.expireDate}
                  onChange={handleInputChange}
                  error={errors.registrationDate}
                />
              </div>
                  
              <h1 className='my-4'>
                Add Initial Route Information
              </h1>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <FormInput
                  label="Start Place"
                  name="startPlace"
                  placeholder="State the area that the route starts.."
                  value={formData.license}
                  onChange={handleInputChange}
                  error={errors.license}
                />

                <FormInput
                  label="End Place"
                  name="endPlace"
                  placeholder="State the area that the route ends.."
                  value={formData.fuel}
                  onChange={handleInputChange}
                  error={errors.fuel}
                />
              </div>
            
              {/* Submit */}
              <div className="w-full flex justify-center mt-6">
                <button
                  type="submit"
                  className="btn-secondary px-8 py-2"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

export default VehiclesPage;
