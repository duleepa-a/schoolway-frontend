'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { FaDownload, FaArrowLeft, FaStar, FaCheck, FaPaperPlane } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { DriverDetails as DriverDetailsType, DriverDetailsResponse } from '@/types/driverDetails';
import JobOfferModal from '@/app/dashboardComponents/JobOfferModal';

interface DriverDetailsProps {
  driverId: string;
}

export default function Driverinf({ driverId }: DriverDetailsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vanId = searchParams.get('vanId');
    const vanMakeAndModel = searchParams.get('vanMakeAndModel');

    const [driver, setDriver] = useState<DriverDetailsType | null>(null);
    const [vanDetails, setVanDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [requestLoading, setRequestLoading] = useState(false);
    const [showJobOfferModal, setShowJobOfferModal] = useState(false);
    const [hasExistingOffer, setHasExistingOffer] = useState(false);
    const [checkingOffer, setCheckingOffer] = useState(true);

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

    // Fetch van details if vanId is provided
    useEffect(() => {
        const fetchVanDetails = async () => {
            if (vanId) {
                try {
                    const response = await fetch(`/api/vanowner/vans/${vanId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setVanDetails(data.van);
                    }
                } catch (error) {
                    console.error('Error fetching van details:', error);
                }
            }
        };

        fetchVanDetails();
    }, [vanId]);

    // Check for existing job offer
    useEffect(() => {
        const checkExistingOffer = async () => {
            
            if (!driver?.id || !vanId) return;
            console.log('Checking existing job offer for driver:', driver.id, 'and van:', vanId);

            try {
                setCheckingOffer(true);
                const response = await fetch(
                    `/api/van_service/job_offer?driverId=${driver.id}&vanId=${vanId}`
                );

                if (response.ok) {
                    const data = await response.json();
                    setHasExistingOffer(data.hasExistingRequest);
                }
            } catch (error) {
                console.error('Error checking existing offer:', error);
            } finally {
                setCheckingOffer(false);
            }
        };

        checkExistingOffer();
    }, [driver?.id, vanId]);

    const handleDownload = (documentType: string, filePath: string) => {
        // Handle document download logic here
        console.log(`Downloading ${documentType} from ${filePath}`);
        // You can implement actual download functionality here
    };

    const handleBackClick = () => {
        router.back();
    };

    const handleSendJobOffer = () => {
        setShowJobOfferModal(true);
    };

    const handleConfirmJobOffer = async () => {
        if (!driver || !vanId) {
            alert('Missing required information. Please try again.');
            return;
        }

        try {
            setRequestLoading(true);
            
            const requestPayload = {
                driverId: driver.id,
                vanId: parseInt(vanId),
                message: `Job offer for ${vanDetails?.makeAndModel || 'your van'}`,
                proposedSalary: vanDetails?.salaryPercentage || 25.0,
                turn: vanDetails?.shiftDetails || 'To be discussed'
            };

            console.log('Sending job offer:', requestPayload);

            const response = await fetch('/api/van_service/job_offer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestPayload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send job offer');
            }

            setShowJobOfferModal(false);
            
            // Show success message
            alert(`Job offer sent successfully!\n\nDriver: ${driver.name}\nVan: ${vanDetails?.makeAndModel || vanId}\n\nThe driver will receive a notification and can accept or decline the offer.`);
            
            // Navigate back to van details or driver list
            router.push(`/vanowner/vehicles/${vanId}`);
            
        } catch (error) {
            console.error('Error sending job offer:', error);
            alert(error instanceof Error ? error.message : 'Failed to send job offer. Please try again.');
        } finally {
            setRequestLoading(false);
        }
    };

    const handleCloseModal = () => {
        if (!requestLoading) {
            setShowJobOfferModal(false);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <FaStar key={index} className={index < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'} />
        ));
    };

    const renderJobOfferButton = () => {
        if (checkingOffer) {
            return (
                <button 
                disabled = {true}
                className='w-full lg:w-auto bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed'>
                    <div className="flex items-center justify-center">
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading...
                    </div>
                </button>
            )
        }

        if (hasExistingOffer) {
            return (
                <button 
                disabled = {true}
                className='flex w-full lg:w-auto bg-primary text-white px-8 py-4 rounded-lg  transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed items-center justify-center space-x-2 '>
                    <FaCheck className="text-green-400" />
                    <div className="flex items-center justify-center">                        
                        Already Sent
                    </div>
                </button>
            );
        }

        return (
            <button 
            onClick={handleSendJobOffer}
            className="flex w-full lg:w-auto bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 items-center justify-center space-x-2 hover:cursor-pointer"
            >
            <FaPaperPlane />
            <span>Send Job Offer</span>
            </button>
        );
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
            {/* Van Information Banner (if vanId is provided) */}
            {vanId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        Request {driver.name} for Van
                    </h3>
                    {vanDetails ? (
                        <div className="text-sm text-blue-700">
                            <p><span className="font-medium">Van ID:</span> {vanDetails.id}</p>
                            <p><span className="font-medium">Model:</span> {vanDetails.makeAndModel}</p>
                            <p><span className="font-medium">License Plate:</span> {vanDetails.licensePlateNumber}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-blue-700">Van : {vanMakeAndModel}</p>
                    )}
                </div>
            )}

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

                    {/* Request Driver Button */}
                    <div className="mt-6 lg:mt-0 lg:ml-8">
                        {renderJobOfferButton()}
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
                            <p className="text-gray-600">{driver.district}, {driver.city}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                            <p className="text-gray-600">{driver.contactNumber}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <p className="text-gray-600">{driver.email}</p>
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

            {/* Job Offer Modal */}
            <JobOfferModal
                isOpen={showJobOfferModal}
                onClose={handleCloseModal}
                onConfirm={handleConfirmJobOffer}
                driverName={driver?.name || ''}
                vanModel={vanMakeAndModel || ''}
                isLoading={requestLoading}
            />
        </div>
    );
};