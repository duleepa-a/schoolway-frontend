'use client'
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { IoMdAddCircle } from 'react-icons/io';
import VehicleCard from './VehicleCard';
import TopBar from '@/app/dashboardComponents/TopBar';
import FormInput from '@/app/components/FormInput';
import { MdOutlineClose } from "react-icons/md";
import TablePagination from '@/app/components/TablePagination';
import { useSession,signOut } from 'next-auth/react';
import { useEffect } from 'react';


interface VanFormProps {
  showForm: boolean;
  handleCloseForm: () => void;
}

interface FormData {
  registrationNumber: string;
  licensePlateNumber: string;
  makeAndModel: string;
  seatingCapacity: string;
  acCondition: string;
  routeStart: string;
  routeEnd: string;
  ownerId: string;
}

interface FileData {
  rBook: File | null;
  revenueLicense: File | null;
  fitnessCertificate: File | null;
  insuranceCertificate: File | null;
  vanPhoto: File | null;
}



const VehiclesPage = () => {

  const {status, data: session} = useSession();


  const [formData, setFormData] = useState<FormData>({
    registrationNumber: '',
    licensePlateNumber: '',
    makeAndModel: '',
    seatingCapacity: '',
    acCondition: '',
    routeStart: '',
    routeEnd: '',
    ownerId:'',
  });

  useEffect(() => {
      if (session?.user?.id) {
        setFormData((prev) => ({
          ...prev,
          ownerId: session.user.id, // 👈 Set ownerId from session
        }));
      }

      console.log("SESSION:", session);
  }, [session])

  const [files, setFiles] = useState<FileData>({
    rBook: null,
    revenueLicense: null,
    fitnessCertificate: null,
    insuranceCertificate: null,
    vanPhoto: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.registrationNumber) newErrors.registrationNumber = 'Required';
    if (!formData.licensePlateNumber) newErrors.licensePlateNumber = 'Required';
    if (!formData.makeAndModel) newErrors.makeAndModel = 'Required';
    if (!formData.seatingCapacity) newErrors.seatingCapacity = 'Required';
    if (!formData.acCondition) newErrors.acCondition = 'Required';
    if (!files.rBook) newErrors.rBook = 'Required';
    if (!files.revenueLicense) newErrors.revenueLicense = 'Required';
    if (!files.fitnessCertificate) newErrors.fitnessCertificate = 'Required';
    if (!files.insuranceCertificate) newErrors.insuranceCertificate = 'Required';
    if (!files.vanPhoto) newErrors.vanPhoto = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const uploads = await Promise.all([
        toBase64(files.rBook!),
        toBase64(files.revenueLicense!),
        toBase64(files.fitnessCertificate!),
        toBase64(files.insuranceCertificate!),
        toBase64(files.vanPhoto!),
      ]);

      const payload = {
        ...formData,
        seatingCapacity: parseInt(formData.seatingCapacity),
        acCondition: formData.acCondition === 'A/C',
        rBookBase64: uploads[0],
        revenueLicenseBase64: uploads[1],
        fitnessCertificateBase64: uploads[2],
        insuranceCertificateBase64: uploads[3],
        photoBase64: uploads[4],
      };

      const response = await fetch('/api/vans/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Vehicle added successfully');
        handleCloseForm();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to add vehicle');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to add vehicle');
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
          <button
            onClick={handleCloseForm}
            className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl cursor-pointer"
          >
            <MdOutlineClose />
          </button>

          <h2 className="text-xl font-semibold text-active-text mb-6">Add New Vehicle </h2>
          <p className="text-sm text-gray-600 mb-2">
            Logged in as: {session?.user?.name} (ID: {session?.user?.id})
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} placeholder="WP-XXXX" error={errors.registrationNumber} />
              <FormInput label="License Plate Number" name="licensePlateNumber" value={formData.licensePlateNumber} onChange={handleInputChange} placeholder="ABC-1234" error={errors.licensePlateNumber} />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <FormInput label="Make & Model" name="makeAndModel" value={formData.makeAndModel} onChange={handleInputChange} placeholder="e.g. Toyota HiAce 2015" error={errors.makeAndModel} />
              <FormInput label="Seating Capacity" name="seatingCapacity" type="number" value={formData.seatingCapacity} onChange={handleInputChange} placeholder="15" error={errors.seatingCapacity} />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <FormInput label="Route Start" name="routeStart" value={formData.routeStart} onChange={handleInputChange} placeholder="Start location" error={errors.routeStart} />
              <FormInput label="Route End" name="routeEnd" value={formData.routeEnd} onChange={handleInputChange} placeholder="End location" error={errors.routeEnd} />
            </div>

            <input type="hidden" name="ownerId" value={formData.ownerId}/>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-1 font-medium">R Book</label>
                <input type="file" name="rBook" onChange={handleFileChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Revenue License</label>
                <input type="file" name="revenueLicense" onChange={handleFileChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Fitness Certificate</label>
                <input type="file" name="fitnessCertificate" onChange={handleFileChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Insurance Certificate</label>
                <input type="file" name="insuranceCertificate" onChange={handleFileChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Van Photo (front + side)</label>
                <input type="file" name="vanPhoto" onChange={handleFileChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">A/C Condition</label>
              <select name="acCondition" value={formData.acCondition} onChange={handleInputChange} className="w-full border rounded px-3 py-2">
                <option value="">Select</option>
                <option value="A/C">A/C</option>
                <option value="Non A/C">Non A/C</option>
              </select>
              {errors.acCondition && <p className="text-red-500 text-sm mt-1">{errors.acCondition}</p>}
              </div>
            </div>

            <div className="w-full flex justify-center mt-6">
              <button type="submit" className="btn-secondary px-8 py-2">
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
