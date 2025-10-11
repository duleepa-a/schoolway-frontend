'use client';

import React, { useEffect, useState } from 'react';
import { Edit2, Save, X, Camera, User} from 'lucide-react';
import Image from 'next/image';
import FormInput from '../../components/FormInput';

interface data{
  firstname: string;
  lastname: string;
  mobile: string;
  dp: string;
  vanService?: {
    serviceName: string;
    serviceRegNumber: string;
  };
}

const ProfileDetailForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personalInfo');

  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
    contactNo: '',
    dp: '',
    serviceName: '',
    serviceRegNumber: '',
  });

  const [tempData, setTempData] = useState(profileData);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('/api/vanowner/profile');
      const data = await res.json();
      setProfileData({
        firstname: data.firstname || 'Enter your first name',
        lastname: data.lastname || 'Enter your last name',
        contactNo: data.mobile || 'Enter your contact number',
        dp: data.dp || '',
        serviceName: data.vanService?.serviceName || 'Enter your service name',
        serviceRegNumber: data.vanService?.serviceRegNumber || 'Enter your business registration number',
      });
      setTempData(data);
    };

    fetchProfile();
  }, []);


  const handleEdit = () => {
    setTempData(profileData);
    setIsEditing(true);
  };

  const transformApiData = (data : data) => ({
    firstname: data.firstname || 'Enter your first name',
    lastname: data.lastname || 'Enter your last name',
    contactNo: data.mobile || 'Enter your contact number',
    dp: data.dp || '',
    serviceName: data.vanService?.serviceName || 'Enter your service name',
    serviceRegNumber: data.vanService?.serviceRegNumber || 'Enter your business registration number',
  });

  const handleSave = async () => {
    const res = await fetch('/api/vanowner/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tempData),
    });

    if (res.ok) {
      const updated = await res.json();
      const transformedData = transformApiData(updated);
      
      setProfileData(transformedData);
      setTempData(transformedData); // Also update tempData to keep them in sync
      setIsEditing(false);
    } else {
      console.error('Failed to save');
    }
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/vanowner/profile/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok && data.url) {
      setTempData((prev) => ({
        ...prev,
        dp: data.url,
      }));
    } else {
      console.error('Image upload failed:', data?.error || 'Unknown error');
    }
  };

  // Password update logic 

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordUpdate = async () => {
    const { currentPassword, newPassword, confirmNewPassword } = passwordData;

    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      const res = await fetch('/api/vanowner/profile/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Failed to update password.');
        return;
      }

      alert('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      alert('Something went wrong.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-8">
      <div className="flex gap-6 border-b border-[var(--blue-shade-light)] mb-6">
        <button
          onClick={() => setActiveTab('personalInfo')}
          className={`pb-2 font-semibold cursor-pointer transition-colors duration-200
            ${activeTab === 'personalInfo'
              ? 'border-b-4 border-[var(--blue-shade-dark)] text-[var(--blue-shade-dark)]'
              : 'text-[var(--color-inactive-text)]'
          }`}
        >
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-2 font-semibold cursor-pointer transition-colors duration-200
            ${activeTab === 'security'
              ? 'border-b-4 border-[var(--blue-shade-dark)] text-[var(--blue-shade-dark)]'
              : 'text-[var(--color-inactive-text)]'
          }`}
        >
          Security
        </button>
      </div>

      {activeTab === 'personalInfo' && (
        <>
          {/* Header */}
          <div className="flex justify-end items-center mb-6">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-6 py-2 btn-primary rounded-full shadow-md"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 btn-small-primary rounded-full shadow-md"
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-[var(--color-textblack)] rounded-full shadow-md hover:bg-gray-400 transition-colors cursor-pointer"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          <div className='grid grid-cols-4 gap-4'>
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-8 col-span-1">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-[var(--blue-shade-light)]/20 flex items-center justify-center overflow-hidden">
                  {(isEditing ? tempData.dp : profileData.dp) ? (
                    <Image
                      src={isEditing ? tempData.dp : profileData.dp}
                      alt="Profile"
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={40} className="text-[var(--blue-shade-dark)]" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-[var(--blue-shade-dark)] text-white p-2 rounded-full cursor-pointer hover:bg-[var(--blue-shade-light)] transition-colors">
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {isEditing && (
                <p className="text-sm  text-center">
                  Click the camera icon to upload a new profile picture
                </p>
              )}
            </div>
            <div className='col-span-3'>
              <div className='grid grid-cols-3 gap-4'>
                {/* Service Name */}
                <div>
                  <label className="block text-sm font-semibold  mb-2">
                    Service Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="serviceName"
                      value={tempData.serviceName}
                      onChange={handleInputChange}
                      className="form-field"
                      placeholder="Enter your service name"
                    />
                  ) : (
                    <div className="form-field bg-gray-50">
                      {profileData.serviceName}
                    </div>
                  )}
                </div>
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold  mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstname"
                      value={tempData.firstname}
                      onChange={handleInputChange}
                      className="form-field"
                      placeholder="Enter your first name"
                    />
                  ) : (
                    <div className="form-field bg-gray-50">
                      {profileData.firstname}
                    </div>
                  )}
                </div>
                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold  mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastname"
                      value={tempData.lastname}
                      onChange={handleInputChange}
                      className="form-field"
                      placeholder="Enter your last name"
                    />
                  ) : (
                    <div className="form-field bg-gray-50">
                      {profileData.lastname}
                    </div>
                  )}
                </div>
              </div>
              <div className='grid grid-cols-3 gap-4 mt-4'>
                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-semibold  mb-2">
                    Contact Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="contactNo"
                      value={tempData.contactNo}
                      onChange={handleInputChange}
                      className="form-field"
                      placeholder="Enter your contact number"
                    />
                  ) : (
                    <div className="form-field bg-gray-50">
                      {profileData.contactNo}
                    </div>
                  )}
                </div>
                {/* Service Registration Number */}
                <div>
                  <label className="block text-sm font-semibold  mb-2">
                    Service Registration Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="serviceRegNumber"
                      value={tempData.serviceRegNumber}
                      onChange={handleInputChange}
                      className="form-field"
                      placeholder="Enter your business registration number"
                    />
                  ) : (
                    <div className="form-field bg-gray-50">
                      {profileData.serviceRegNumber}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 rounded-xl border-2 border-[var(--blue-shade-light)] bg-[var(--blue-shade-light)]/10">
            <h3 className="text-base font-semibold text-[var(--blue-shade-dark)] mb-2">Profile Information</h3>
            <p className="text-sm text-[var(--blue-shade-dark)]">
              Keep your profile information up to date to ensure smooth operations and better communication with students and parents.
            </p>
          </div>
        </>
        )}

      {activeTab === 'security' && (
        <>
          <div className='p-8'>
            <div className='justify-between grid grid-cols-2 gap-3'>
              <FormInput
                label="Current Password"
                placeholder=''
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handleChange}
              />
            </div>
            <div className='justify-between grid grid-cols-2 gap-3'>
              <div>
                <FormInput
                  label="New Password"
                  name="newPassword"
                  placeholder=''
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                />
              </div>
              <div>
                <FormInput
                  label="Confirm New Password"
                  name="confirmNewPassword"
                  placeholder=''
                  type="password"
                  value={passwordData.confirmNewPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='mt-2'>
              <button
                className='btn-primary px-6 py-2 rounded-full shadow-md'
                onClick={handlePasswordUpdate}
              >
                Update Password
              </button>
            </div>
          </div>
        </>
      )}
      </div>
  );
};

export default ProfileDetailForm;