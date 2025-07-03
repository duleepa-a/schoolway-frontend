'use client';
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { IoMdAddCircle } from "react-icons/io";
import FormInput from '@/app/components/FormInput';
import Link from 'next/link';

function VanOwnerSignUp() {
  const [step, setStep] = useState(1);

  // Step 1 state
  const [serviceName, setServiceName] = useState('');
  const [contact, setContact] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  // Step 2 state
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [capacity, setCapacity] = useState('');
  const [color, setColor] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [destinationSchools, setDestinationSchools] = useState<string[]>([]);
  const [selectedTurns, setSelectedTurns] = useState<string[]>(['']);
  const [vehiclePhotos, setVehiclePhotos] = useState<FileList | null>(null);
  const [assistantName, setAssistantName] = useState('');
  const [assistantPhoto, setAssistantPhoto] = useState<File | null>(null);

  const allTurns = ['6:30 A.M.', '12:30 P.M.', '1:30 P.M.'];

  const toggleTurn = (turn: string) => {
    setSelectedTurns(prev =>
      prev.includes(turn) ? prev.filter(t => t !== turn) : [...prev, turn]
    );
  };

  const removeSchool = (school: string) => {
    setDestinationSchools(destinationSchools.filter(s => s !== school));
  };

  const handleStep1Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      vehicleNumber,
      ownerName,
      startLocation,
      district,
      capacity,
      color,
      vehicleModel,
      destinationSchools,
      selectedTurns,
      vehiclePhotos,
      assistantName,
      assistantPhoto,
    });
  };

  return (
    <div
      className= "pt-5 justify-center justify-items-center pb-13 bg-fixed"
      style={{
        backgroundImage: 'url("./../illustrations/signupBackground.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '90vh',
      }}
    >
      <div className="mt-15 max-w-4xl mx-auto bg-white shadow-lg rounded-xl border border-amber-50 relative px-10 py-12 ">
        <button
          onClick={() => setStep(1)}
          className="absolute top-5 left-4 text-gray-600 hover:text-black"
        >
          <ArrowLeft />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-8">
          {step === 1 ? 'Register School Service' : 'Add Vehicles'}
        </h2>

        {step === 1 && (
          <form className="space-y-4  w-95 p-3" onSubmit={handleStep1Submit}>
            <FormInput label="School Service Name" name="service_name" placeholder="Enter Service Name" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
            <FormInput label="Contact Number" name="contact" placeholder="07X-XXXXXXX" value={contact} onChange={(e) => setContact(e.target.value)} />
            <div className="flex justify-between gap-2 pt-5">
              <label className="flex-1 border border-gray-300 rounded-xl p-2 text-center cursor-pointer hover:border-yellow-400">
                <div className="flex justify-between items-center gap-2">
                  <input type="file" className="hidden" onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)} />
                  {profilePhoto ? profilePhoto.name : 'Add Profile'}
                  <IoMdAddCircle className="size-5" />
                </div>
              </label>
              <label className="flex-1 border border-gray-300 rounded-xl p-2 text-center cursor-pointer hover:border-yellow-400">
                <div className="flex justify-between items-center gap-2">
                  <input type="file" className="hidden" onChange={(e) => setLicenseFile(e.target.files?.[0] || null)} />
                  {licenseFile ? licenseFile.name : 'Add License File'}
                  <IoMdAddCircle className="size-5" />
                </div>
              </label>
            </div>
            <div className="text-center">
              <button type="submit" className="bg-black text-white py-2 px-6 rounded-md hover:bg-gray-900 mt-6 w-60">
                Next →
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-5 gap-x-20 w-3xl " onSubmit={handleStep2Submit}>
            <FormInput label="Vehicle Number" name="vehicle_number" placeholder="Enter Vehicle Number" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />
            <FormInput label="Owner Name" name="owner_name" placeholder="Enter Owner Name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
            <FormInput label="Start Location" name="start_location" placeholder="Enter Start Location" value={startLocation} onChange={(e) => setStartLocation(e.target.value)} />
            <FormInput label="District" name="district" placeholder="Enter District" value={district} onChange={(e) => setDistrict(e.target.value)} />
            <FormInput label="Capacity" name="capacity" placeholder="Enter Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
            <FormInput label="Color" name="color" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />
            <FormInput label="Vehicle Model" name="vehicle_model" placeholder="Enter Vehicle Model" value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} />

            <div className="md:col-span-2">
              <label className="text-sm block font-semibold text-gray-700 mb-1">
                Destination Schools
              </label>
              <select
                className="border w-full border-gray-300 rounded-xl h-10 pl-3 cursor-pointer text-sm text-gray-700 hover:border-yellow-400 block"
                onChange={(e) => {
                  const selectedSchool = e.target.value;
                  if (selectedSchool && !destinationSchools.includes(selectedSchool)) {
                    setDestinationSchools([...destinationSchools, selectedSchool]);
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>Select a school</option>
                <option value="Royal College">Royal College</option>
                <option value="Visakha Vidyalaya">Visakha Vidyalaya</option>
                <option value="Ananda College">Ananda College</option>
                <option value="Musaeus College">Musaeus College</option>
              </select>
              <div className="flex flex-wrap gap-2 mt-3">
                {destinationSchools.map((school, i) => (
                  <span
                    key={i}
                    onClick={() => removeSchool(school)}
                    className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-yellow-200"
                  >
                    {school} ✕
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Select Turns</label>
              <div className="flex gap-3 mt-2">
                {allTurns.map((turn, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleTurn(turn)}
                    className={`px-4 py-1 rounded-full border transition ${
                      selectedTurns.includes(turn)
                        ? 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium'
                        : 'bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium'
                    }`}
                  >
                    {turn}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="border border-dashed border-gray-300 rounded-xl p-5 text-center cursor-pointer text-sm text-gray-700 hover:border-yellow-400 block">
                <div className="flex items-center justify-center gap-2">
                  <input type="file" multiple className="hidden" onChange={(e) => setVehiclePhotos(e.target.files)} />
                  Add Vehicle Images
                  <IoMdAddCircle className="size-5" />
                </div>
              </label>
            </div>

            <div className="md:col-span-1">
              <FormInput label="Assistant Deatails" name="assistant_name" placeholder="Enter Assistant Name" value={assistantName} onChange={(e) => setAssistantName(e.target.value)} />
            </div>

            <label className="border border-dashed border-gray-300 rounded-xl pt-3 h-10 mt-6.5 text-center cursor-pointer text-sm text-gray-700 hover:border-yellow-400 block"> 
              <div className="flex items-center justify-center gap-2 ">
                <input type="file" className="hidden" onChange={(e) => setAssistantPhoto(e.target.files?.[0] || null)} />
                Add Image
                <IoMdAddCircle className="size-5" />
              </div>
            </label>

            <div className="md:col-span-2">
              <span className="text-sm text-blue-600 cursor-pointer flex items-center gap-1">
                <IoMdAddCircle /> Add another vehicle
              </span>
            </div>

            <div className="md:col-span-2 flex justify-between mt-8">
              <button type="button" onClick={() => setStep(1)} className="bg-gray-300 text-black py-2 px-6 rounded-md hover:bg-gray-400">
                ← Back
              </button>
              <Link href="/signup/vanowner/driver">
                <button type="submit" className="bg-black text-white py-2 px-6 rounded-md hover:bg-gray-900 mt-6 w-60">
                  Next →
                </button>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default VanOwnerSignUp;
