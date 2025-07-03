'use client';
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { IoMdAddCircle } from 'react-icons/io';

function DriverRegistration() {
  const [step, setStep] = useState(3); // Current step in form
  const [isSubmitted, setIsSubmitted] = useState(false); // For success screen

  // Driver registration state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [driversLicense, setDriversLicense] = useState<File | null>(null);
  const [licenseExpiryDate, setLicenseExpiryDate] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [nic, setNic] = useState('');
  const [policeReport, setPoliceReport] = useState<File | null>(null);
  const [medicalReport, setMedicalReport] = useState<File | null>(null);

  const FormInput = ({
    label,
    name,
    placeholder,
    value,
    onChange,
    type = 'text',
  }: {
    label: string;
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
  }) => (
    <div>
      <label className="text-sm block font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border w-full border-gray-300 rounded-xl h-10 pl-3 text-sm text-gray-700 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none"
      />
    </div>
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      name,
      address,
      contactNumber,
      driversLicense,
      licenseExpiryDate,
      profilePhoto,
      nic,
      policeReport,
      medicalReport,
    });
    setIsSubmitted(true); // Show success screen
  };

  const handleBack = () => {
    setStep(2);
  };

  return (
    <div
      className="pt-5 justify-center justify-items-center pb-13 bg-fixed"
      style={{
        backgroundImage: 'url("./../illustrations/signupBackground.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '90vh',
      }}
    >
      <div className="mt-15 max-w-4xl mx-auto bg-white shadow-lg rounded-xl border border-amber-50 relative px-10 py-12">
        {!isSubmitted && (
          <button
            onClick={handleBack}
            className="absolute top-5 left-4 text-gray-600 hover:text-black"
          >
            <ArrowLeft />
          </button>
        )}

        <h2 className="text-2xl font-semibold text-center mb-8">
          Driver Registration
        </h2>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center text-center space-y-6 px-4 py-10">
            <h2 className="text-2xl font-semibold text-gray-800">
              Your driver application has been submitted successfully!
            </h2>
            <p className="text-sm text-gray-600 max-w-md">
              You can manage your vehicles and find drivers until we get back
              to you soon after reviewing your application! View your
              application status on your dashboard.
              <br />
              Happy riding!
            </p>
            <button className="mt-4 bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-900">
              Go to Dashboard
            </button>
          </div>
        ) : (
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-5 gap-x-20 w-3xl"
            onSubmit={handleSubmit}
          >
            <FormInput
              label="Name"
              name="name"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <FormInput
              label="Address"
              name="address"
              placeholder="Enter Your Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <FormInput
              label="Contact Number"
              name="contact_number"
              placeholder="07X-XXXXXXX"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />

            <div className="flex md:row-span-2 gap-2 h-20 justify-between">
              <div className="relative">
                <label className="w-40 text-sm block font-semibold text-gray-700 mb-1">
                  Drivers Licence
                </label>
                <label className="w-40 border border-gray-300 rounded-xl h-10 px-3 text-center cursor-pointer text-sm text-gray-700 hover:border-yellow-400 flex items-center justify-between">
                  <span>
                    {driversLicense ? driversLicense.name : 'Add pdf'}
                  </span>
                  <IoMdAddCircle className="size-5" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setDriversLicense(e.target.files?.[0] || null)
                    }
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
              <div className="w-40">
                <FormInput
                  label="Licence Expiry Date"
                  name="license_expiry"
                  placeholder="dd/mm/yyyy"
                  value={licenseExpiryDate}
                  onChange={(e) => setLicenseExpiryDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex md:row-span-3 h-20 gap-2 mt-5 justify-between">
              <div>
                <label className="w-40 text-sm block font-semibold text-gray-700 mb-1">
                  Add profile photo
                </label>
                <label className="w-40 border border-gray-300 rounded-xl h-10 px-3 text-center cursor-pointer text-sm text-gray-700 hover:border-yellow-400 flex items-center justify-between">
                  <span>{profilePhoto ? profilePhoto.name : 'Add Photo'}</span>
                  <IoMdAddCircle className="size-5" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setProfilePhoto(e.target.files?.[0] || null)
                    }
                    accept=".jpg,.jpeg,.png"
                  />
                </label>
              </div>

              <div>
                <label className="text-sm block font-semibold text-gray-700 mb-1">
                  NIC
                </label>
                <input
                  type="text"
                  name="nic"
                  placeholder="xxxxxxxxxxxx"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  className="border w-40 w-full border-gray-300 rounded-xl h-10 pl-3 text-sm text-gray-700 hover:border-yellow-400 focus:border-yellow-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex md:row-span-2 gap-2 pb-10 justify-between">
              <div>
                <label className="text-sm block font-semibold text-gray-700 mb-1">
                  Police Report
                </label>
                <label className="w-40 border border-gray-300 rounded-xl h-10 px-3 text-center cursor-pointer text-sm text-gray-700 hover:border-yellow-400 flex items-center justify-between">
                  <span>{policeReport ? policeReport.name : 'Add pdf'}</span>
                  <IoMdAddCircle className="size-5" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setPoliceReport(e.target.files?.[0] || null)
                    }
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
              </div>

              <div>
                <label className="text-sm block font-semibold text-gray-700 mb-1">
                  Medical Report
                </label>
                <label className="w-40 border border-gray-300 rounded-xl h-10 px-3 text-center cursor-pointer text-sm text-gray-700 hover:border-yellow-400 flex items-center justify-between">
                  <span>{medicalReport ? medicalReport.name : 'Add pdf'}</span>
                  <IoMdAddCircle className="size-5" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setMedicalReport(e.target.files?.[0] || null)
                    }
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-center mt-8">
              <button
                type="submit"
                className="bg-black text-white py-2 px-6 rounded-md hover:bg-gray-900 w-60"
              >
                Finish
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default DriverRegistration;
