'use client';

import React, { useState } from 'react';
import { Edit2, Save, X, Camera, User} from 'lucide-react';
import Image from 'next/image';
import FormInput from '../../components/FormInput';

const ProfileDetailForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personalInfo');

  const [profileData, setProfileData] = useState({
    name: 'Duleepa Edirisinghe',
    contactNo: '+94 71 234 5678',
    businessRegNo: 'BR/2024/001234',
    profilePic: null
  });

  const [tempData, setTempData] = useState(profileData);

  const handleEdit = () => {
    setTempData(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = () => {
    
  };

  const handleImageUpload = (event: React.FormEvent) => {
   
  };

  return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
         <div className="flex gap-6 border-b border-border-bold-shade mb-4">
            <button
              onClick={() => setActiveTab('personalInfo')}
              className={`pb-2 font-medium cursor-pointer 
                
                ${activeTab === 'personalInfo'
                  ? 'border-b-2 border-primary text-active-text'
                  : 'text-inactive-text'
              }`}

            >
              Personal Infomation
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-2 font-medium cursor-pointer 
                
                ${activeTab === 'security'
                  ? 'border-b-2 border-primary text-active-text'
                  : 'text-inactive-text'
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
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-yellow-600 transition-colors cursor-pointer"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          <div className='grid grid-cols-4 gap-4'>
          {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                  <div className="w-25 h-25 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-gray-300">
                  {(isEditing ? tempData.profilePic : profileData.profilePic) ? (
                      <Image
                      src = {""}
                      alt = "Profile"
                      className = "w-full h-full object-cover"
                      />
                  ) : (
                      <User size={40} className="text-gray-400" />
                  )}
                  </div>
                  {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
                      <Camera size={16} />
                      <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      />
                  </label>
                  )}
              </div>
              {isEditing && (
                  <p className="text-sm text-gray-600 text-center">
                  Click the camera icon to upload a new profile picture
                  </p>
              )}
              </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.name}
                  onChange={(e) => handleInputChange()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  {profileData.name}
                </div>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={tempData.contactNo}
                  onChange={(e) => handleInputChange()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your contact number"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  {profileData.contactNo}
                </div>
              )}
            </div>

            {/* Business Registration Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Registration Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.businessRegNo}
                  onChange={(e) => handleInputChange()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your business registration number"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  {profileData.businessRegNo}
                </div>
              )}
            </div>
          
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Profile Information</h3>
            <p className="text-sm text-blue-700">
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
                    name="currentPassword"
                    placeholder=''
                    type='password'
                    value={tempData.name}
                    onChange={(e) =>{}}
                  />
                </div>
                <div className='justify-between grid grid-cols-2 gap-3'>
                  <div>
                    <FormInput
                      label="New Password"
                      name="newPassword"
                      placeholder=''
                      type='password'
                      value={tempData.name}
                      onChange={(e) =>{}}
                    />
                  </div>
                  <div>
                    <FormInput
                      label="Confirm New Password"
                      name="confirmNewPassword"
                      placeholder=''
                      type='password'
                      value={tempData.name}
                      onChange={(e) =>{}}
                    />
                  </div>                  
                </div>
                <div className='mt-2'>
                  <button
                    className='btn-primary px-4 py-2'
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