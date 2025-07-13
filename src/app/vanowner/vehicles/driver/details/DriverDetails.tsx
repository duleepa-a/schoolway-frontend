'use client';

import Image from 'next/image';
import React from 'react';
import { FaDownload, FaArrowLeft, FaStar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const DriverDetails = () => {
    const router = useRouter();

    // Sample driver data - you can replace this with props or API data
    const driver = {
        id: 'D001',
        name: 'Duleepa Edirisinghe',
        profilePic: '/Images/male_pro_pic_placeholder.png',
        address: '123 Main Street, Colombo 07, Sri Lanka',
        contactNumber: '+94 77 123 4567',
        nic: '199012345678',
        licenseNumber: 'DL-2019-123456',
        licenseExpiryDate: 'March 15, 2026',
        experience: '6 years',
        rating: 4.8,
        totalReviews: 45,
        documents: {
            driverLicense: '/documents/driver_license_D001.pdf',
            policeReport: '/documents/police_report_D001.pdf',
            medicalReport: '/documents/medical_report_D001.pdf'
        },
        pastExperience: [
            {
                company: 'Lanka Transport Services',
                position: 'Van Driver',
                duration: '2019 - 2023',
                description: 'Responsible for school transportation routes covering Colombo district'
            },
            {
                company: 'City Express Tours',
                position: 'Tour Guide Driver',
                duration: '2017 - 2019',
                description: 'Provided transportation services for tourists and conducted city tours'
            }
        ],
        reviews: [
            {
                customerName: 'Saman Perera',
                rating: 5,
                comment: 'Excellent driver! Very punctual and friendly with children.',
                date: 'June 15, 2025'
            },
            {
                customerName: 'Priya Fernando',
                rating: 4,
                comment: 'Good driving skills and maintains the vehicle well.',
                date: 'May 20, 2025'
            },
            {
                customerName: 'Ravi Silva',
                rating: 5,
                comment: 'Highly recommended! Safe driver and very reliable.',
                date: 'April 10, 2025'
            }
        ]
    };

    const handleDownload = (documentType: string, filePath: string) => {
        // Handle document download logic here
        console.log(`Downloading ${documentType} from ${filePath}`);
        // You can implement actual download functionality here
    };

    const handleBackClick = () => {
        router.back();
    };

    const handleAssignDriver = () => {
        // Handle driver assignment logic here
        console.log(`Assigning driver ${driver.name} (ID: ${driver.id})`);
        // You can implement actual assignment functionality here
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <FaStar key={index} className={index < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'} />
        ));
    };

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={handleBackClick}
                className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
            >
                <FaArrowLeft />
                <span>Back to Driver List</span>
            </button>

            {/* Driver Profile Header */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-8 flex-1">
                        <div className="mb-6 md:mb-0">
                            <Image
                                src={driver.profilePic}
                                alt={driver.name}
                                width={150}
                                height={150}
                                className="rounded-full mx-auto md:mx-0"
                            />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">{driver.name}</h1>
                            <p className="text-gray-600 mb-2">Driver ID: {driver.id}</p>
                            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                                <div className="flex space-x-1">
                                    {renderStars(driver.rating)}
                                </div>
                                <span className="text-gray-600">
                    {driver.rating} ({driver.totalReviews} reviews)
                  </span>
                            </div>
                            <p className="text-gray-600 mb-2">Experience: {driver.experience}</p>
                        </div>
                    </div>

                    {/* Assign Driver Button */}
                    <div className="mt-6 lg:mt-0 lg:ml-8">
                        <button
                            onClick={handleAssignDriver}
                            className="w-full lg:w-auto bg-primary text-white px-40 py-4 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        >
                            Assign Driver
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Personal Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <p className="text-gray-600">{driver.address}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                            <p className="text-gray-600">{driver.contactNumber}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
                            <p className="text-gray-600">{driver.nic}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Driver's License</label>
                            <p className="text-gray-600">{driver.licenseNumber}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry Date</label>
                            <p className="text-gray-600">{driver.licenseExpiryDate}</p>
                        </div>
                    </div>
                </div>

                {/* Documents */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Documents</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <span className="text-gray-700">Driver's License</span>
                            <button
                                onClick={() => handleDownload('Driver License', driver.documents.driverLicense)}
                                className="flex items-center space-x-2 bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                            >
                                <FaDownload className="text-xs" />
                                <span>Download</span>
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <span className="text-gray-700">Police Report</span>
                            <button
                                onClick={() => handleDownload('Police Report', driver.documents.policeReport)}
                                className="flex items-center space-x-2 bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                            >
                                <FaDownload className="text-xs" />
                                <span>Download</span>
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <span className="text-gray-700">Medical Report</span>
                            <button
                                onClick={() => handleDownload('Medical Report', driver.documents.medicalReport)}
                                className="flex items-center space-x-2 bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                            >
                                <FaDownload className="text-xs" />
                                <span>Download</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Past Experience */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Past Experience</h2>
                <div className="space-y-4">
                    {driver.pastExperience.map((exp, index) => (
                        <div key={index} className="border-l-4 border-primary pl-4 pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                <h3 className="font-medium text-gray-800">{exp.position}</h3>
                                <span className="text-sm text-gray-500">{exp.duration}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{exp.company}</p>
                            <p className="text-sm text-gray-600">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Customer Reviews</h2>
                <div className="space-y-4">
                    {driver.reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                    <span className="font-medium text-gray-800">{review.customerName}</span>
                                    <div className="flex space-x-1">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <p className="text-gray-600 text-sm">{review.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DriverDetails;