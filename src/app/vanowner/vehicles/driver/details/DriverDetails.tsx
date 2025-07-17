'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaStar } from 'react-icons/fa';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DriverDetails as DriverDetailsType, DriverDetailsResponse } from '@/types/driverDetails';

interface DriverDetailsProps {
  driverId: string;
}

const DriverDetails = ({ driverId }: DriverDetailsProps) => {
    const router = useRouter();
    const [driver, setDriver] = useState<DriverDetailsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Mock data for fields not in database
    const mockData = {
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

    useEffect(() => {
        const fetchDriverDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`/api/van_service/drivers/${driverId}`);
                
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Driver not found');
                    }
                    throw new Error('Failed to fetch driver details');
                }
                
                const data: DriverDetailsResponse = await response.json();
                setDriver(data.driver);
            } catch (error) {
                console.error('Error fetching driver details:', error);
                setError(error instanceof Error ? error.message : 'Failed to load driver details');
            } finally {
                setLoading(false);
            }
        };

        if (driverId) {
            fetchDriverDetails();
        }
    }, [driverId]);

    const handleBackClick = () => {
        router.back();
    };

    const handleAssignDriver = () => {
        if (driver) {
            console.log(`Assigning driver ${driver.name} (ID: ${driver.id})`);
            // You can implement actual assignment functionality here
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <FaStar key={index} className={index < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'} />
        ));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-gray-500 mt-2 ml-4">Loading driver details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                    onClick={handleBackClick}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!driver) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Driver not found</p>
                <button 
                    onClick={handleBackClick}
                    className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                    Go Back
                </button>
            </div>
        );
    }

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
                            Request Driver
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                            <p className="text-gray-600">{driver.district}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <p className="text-gray-600">{driver.city}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                            <p className="text-gray-600">{driver.contactNumber}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <p className="text-gray-600">{driver.email}</p>
                        </div>
                        
                    </div>
                </div>

                {/* Documents */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Documents</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900">Driver&apos;s License</h4>
                            </div>
                            <p className="text-sm text-gray-600">Status: Approved</p>
                            <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Verified
                            </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900">Police Report</h4>
                            </div>
                            <p className="text-sm text-gray-600">Status: Approved</p>
                            <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Verified
                            </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900">Medical Report</h4>
                            </div>
                            <p className="text-sm text-gray-600">Status: Approved</p>
                            <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Verified
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Past Experience - Keep as mock data */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Past Experience</h2>
                <div className="space-y-4">
                    {mockData.pastExperience.map((exp, index) => (
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

            {/* Reviews - Keep as mock data */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Customer Reviews</h2>
                <div className="space-y-4">
                    {mockData.reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                    <span className="font-medium text-gray-800">{review.customerName}</span>
                                    
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <div className="flex space-x-1 mt-0 mb-3">
                                {renderStars(review.rating)}
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