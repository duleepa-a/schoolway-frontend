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
import { Session } from "next-auth";
import DriverTable from './DriverTable';
import TopBarContent from '@/app/dashboardComponents/TopBarContent';


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
  startTime:string;
  endTime:string;
  studentRating: string;
  privateRating: string;
  ownerId: string;
}

interface FileData {
  rBook: File | null;
  revenueLicense: File | null;
  fitnessCertificate: File | null;
  insuranceCertificate: File | null;
  vanPhoto: File | null;
}

interface Props {
  serverSession: Session | null;
}


const VehiclesPage = ({ serverSession }: Props) => {

  const { data: clientSession, status } = useSession();

  const session = clientSession || serverSession;

  const [formData, setFormData] = useState<FormData>({
    registrationNumber: '',
    licensePlateNumber: '',
    makeAndModel: '',
    seatingCapacity: '',
    acCondition: '',
    routeStart: '',
    routeEnd: '',
    startTime:'',
    endTime:'',
    studentRating: '',
    privateRating: '',
    ownerId:'',
  });

  useEffect(() => {
      if (session?.user?.id) {
        setFormData((prev) => ({
          ...prev,
          ownerId: session.user.id!,
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

    if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration Number is required';
    if (!formData.licensePlateNumber.trim()) newErrors.licensePlateNumber = 'License Plate Number is required';
    if (!formData.makeAndModel.trim()) newErrors.makeAndModel = 'Make and Model is required';
    if (!formData.seatingCapacity.trim()) newErrors.seatingCapacity = 'Seating Capacity is required';
    else if (parseInt(formData.seatingCapacity) <= 0) newErrors.seatingCapacity = 'Seating Capacity must be greater than 0';

    if (!formData.acCondition) newErrors.acCondition = 'A/C Condition is required';

    if (!formData.routeStart.trim()) newErrors.routeStart = 'Route start is required';
    if (!formData.routeEnd.trim()) newErrors.routeEnd = 'Route end is required';

    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';

    if (!formData.studentRating.trim()) newErrors.studentRating = 'Student rating is required';
    else if (parseFloat(formData.studentRating) <= 0) newErrors.studentRating = 'Student rating must be greater than 0';

    if (!formData.privateRating.trim()) newErrors.privateRating = 'Private rating is required';
    else if (parseFloat(formData.privateRating) <= 0) newErrors.privateRating = 'Private rating must be greater than 0';

    if (!files.rBook) newErrors.rBook = 'R Book is required';
    if (!files.revenueLicense) newErrors.revenueLicense = 'Revenue License is required';
    if (!files.fitnessCertificate) newErrors.fitnessCertificate = 'Fitness Certificate is required';
    if (!files.insuranceCertificate) newErrors.insuranceCertificate = 'Insurance Certificate is required';
    if (!files.vanPhoto) newErrors.vanPhoto = 'Van Photo is required';

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
        privateRating: parseFloat(formData.privateRating),
        studentRating: parseFloat(formData.studentRating),
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

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVans = async () => {
    try {
      const query = new URLSearchParams({
        search: searchTerm,
        page: page.toString(),
        limit: '3'
      });

      const res = await fetch(`/api/vans/user?${query}`);

      const text = await res.text();

      if (!res.ok) {
        console.error('Fetch error:', res.status);
        return;
      }

      if (!text) {
        console.error('Empty response body');
        return;
      }

      const data = JSON.parse(text);

      setVehicles(data.vans);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching vans:', err);
    }
  };


  useEffect(() => {
    if (session?.user?.id) {
      fetchVans();
    }
  }, [searchTerm, page, session]);

  const handleAddVehicleClick = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const [activeTab, setActiveTab] = useState('vans');

  return (
    <section className="p-6 md:p-10 min-h-screen w-full">
      <TopBarContent serverSession={serverSession} heading="My Vehicles" />
      <div className="flex gap-6 border-b border-border-bold-shade mb-4">
        <button
          onClick={() => setActiveTab('vans')}
          className={`pb-2 font-medium cursor-pointer 
            
            ${activeTab === 'vans'
              ? 'border-b-2 border-primary text-active-text'
              : 'text-inactive-text'
          }`}

        >
          Vans
        </button>
        <button
          onClick={() => setActiveTab('drivers')}
          className={`pb-2 font-medium cursor-pointer 
            
            ${activeTab === 'drivers'
              ? 'border-b-2 border-primary text-active-text'
              : 'text-inactive-text'
          }`}
        >
          Driver Assignments
        </button>
      </div>

      {activeTab === 'vans' && (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between lg:justify-start mb-4 gap-2">
            <div className="relative w-full md:w-1/3">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search vehicle"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1); // reset to page 1 when searching
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-search-bar-bg"
              />
          </div>

            <button onClick={handleAddVehicleClick} className="btn-secondary flex items-center gap-2">
              <span>Add Vehicle</span>
              <IoMdAddCircle className="size-5" />
            </button>
              <TablePagination totalPages={totalPages} onPageChange={(p) => setPage(p)} currentPage={page} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl px-4 py-2 relative">
                <button
                  onClick={handleCloseForm}
                  className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl cursor-pointer"
                >
                  <MdOutlineClose />
                </button>

                <h2 className="text-lg font-semibold text-active-text mb-6">Add New Vehicle </h2>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-2">
                    <FormInput label="Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} placeholder="WP-XXXX" error={errors.registrationNumber} />
                    <FormInput label="License Plate Number" name="licensePlateNumber" value={formData.licensePlateNumber} onChange={handleInputChange} placeholder="ABC-1234" error={errors.licensePlateNumber} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <FormInput label="Make & Model" name="makeAndModel" value={formData.makeAndModel} onChange={handleInputChange} placeholder="e.g. Toyota HiAce 2015" error={errors.makeAndModel} />
                    <FormInput label="Seating Capacity" name="seatingCapacity" type="number" value={formData.seatingCapacity} onChange={handleInputChange} placeholder="15" error={errors.seatingCapacity} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <FormInput label="Route Start" name="routeStart" value={formData.routeStart} onChange={handleInputChange} placeholder="Start location" error={errors.routeStart} />
                    <FormInput label="Route End" name="routeEnd" value={formData.routeEnd} onChange={handleInputChange} placeholder="End location" error={errors.routeEnd} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <FormInput label="School Van Rating - Per Km Per Month(Rs)" name="studentRating" type="number" value={formData.studentRating} onChange={handleInputChange} placeholder="15" error={errors.studentRating} />
                    <FormInput label="Private Hire Rating - Per Km (Rs)" name="privateRating" type="number" value={formData.privateRating} onChange={handleInputChange} placeholder="15" error={errors.privateRating} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                     <div>
                      <label className="form-label">Start Time</label>
                      <select name="startTime" value={formData.startTime} onChange={handleInputChange} className="form-input-field ">
                        <option value="">Select</option>
                        <option value="7:30 am">7:30 am</option>
                        <option value="8:00 am">8:00 am</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">End Time</label>
                      <select name="endTime" value={formData.endTime} onChange={handleInputChange} className="form-input-field ">
                        <option value="">Select</option>
                        <option value="12:30 pm">12:30 pm</option>
                        <option value="1:00 pm">1:00 pm</option>
                      </select>
                    </div>
                  </div>

                  <input type="hidden" name="ownerId" value={formData.ownerId}/>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="form-label">R Book</label>
                      <input type="file" name="rBook" onChange={handleFileChange} className="form-input-field " />
                    </div>
                    <div>
                      <label className="form-label">Revenue License</label>
                      <input type="file" name="revenueLicense" onChange={handleFileChange} className="form-input-field " />
                    </div>
                    <div>
                      <label className="form-label">Fitness Certificate</label>
                      <input type="file" name="fitnessCertificate" onChange={handleFileChange} className="form-input-field " />
                    </div>
                    <div>
                      <label className="form-label">Insurance Certificate</label>
                      <input type="file" name="insuranceCertificate" onChange={handleFileChange} className="form-input-field " />
                    </div>
                    <div>
                      <label className="form-label">Van Photo (front + side)</label>
                      <input type="file" name="vanPhoto" onChange={handleFileChange} className="form-input-field " />
                    </div>
                    <div>
                      <label className="form-label">A/C Condition</label>
                      <select name="acCondition" value={formData.acCondition} onChange={handleInputChange} className="form-input-field ">
                        <option value="">Select</option>
                        <option value="A/C">A/C</option>
                        <option value="Non A/C">Non A/C</option>
                      </select>
                      {errors.acCondition && <p className="text-red-500 text-sm mt-1">{errors.acCondition}</p>}
                    </div>
                  </div>

                  <div className="w-full flex justify-center mt-2">
                    <button type="submit" className="btn-secondary px-8 py-2">
                      Save Vehicle
                    </button>
                  </div>
                </form>
              </div>
          </div>
          )}
        </>

      )}

      {activeTab === 'drivers' && (
        <DriverTable/>
      )}
      

    </section>
  );
};

export default VehiclesPage;
