'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import { FaDownload, FaArrowLeft, FaStar } from 'react-icons/fa';
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { useDrivers } from '@/hooks/useDrivers';

const AssignDriver = () => {
    const searchParams = useSearchParams();
    const vanId = searchParams.get('vanId');
    const vanMakeAndModel = searchParams.get('vanMakeAndModel');
    const [vanDetails, setVanDetails] = useState<any>(null);

    const {
        searchQuery,
        setSearchQuery,
        selectedDistrict,
        setSelectedDistrict,
        availableDrivers,
        availableDistricts,
        pagination,
        loading,
        error,
        fetchDrivers,
        handlePageChange
    } = useDrivers();

    // Fetch van details if vanId is provided
    useEffect(() => {
        const fetchVanDetails = async () => {
            if (vanId) {
                try {
                    const response = await fetch(`/api/vanowner/vans/${vanId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setVanDetails(data.van);
                        console.log("van info", data)
                    }
                } catch (error) {
                    console.error('Error fetching van details:', error);
                }
            }
            console.log("van reuste")
        };

        fetchVanDetails();
    }, [vanId]);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
                <FaStar key={index} className={index < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'} />
        ));
    };

    const handleAssignDriver = (driverId: string, driverName: string) => {
        // Handle driver assignment logic here
        console.log(`Assigning driver ${driverName} (ID: ${driverId}) to van ${vanId}`);
        // You can add your API call or state management logic here
    };

    return (
        <div>
            {/* Van Information Banner (if vanId is provided) */}
            {/* {vanId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        Finding Driver for Van
                    </h3>
                    {vanDetails ? (
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-blue-700">
                                <p><span className="font-medium">Van ID:</span> {vanDetails.id}</p>
                                <p><span className="font-medium">Model:</span> {vanDetails.makeAndModel}</p>
                                <p><span className="font-medium">License Plate:</span> {vanDetails.licensePlateNumber}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-blue-700">Van ID: {vanMakeAndModel}</p>
                    )}
                </div>
            )} */}

            {/* Search Bar and Filters */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6 gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative w-full md:max-w-md">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or experience..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="w-full sm:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                        <div className="relative">
                            <select
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm cursor-pointer appearance-none shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-colors"
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                disabled={loading}
                            >
                                <option value="All">All Districts</option>
                                {availableDistricts.map(district => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <FaChevronDown className="h-3 w-3" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end">
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedDistrict('All');
                        }}
                        disabled={loading || (searchQuery === '' && selectedDistrict === 'All')}
                        className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm font-medium transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        onClick={() => fetchDrivers()}
                        disabled={loading}
                        className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 text-sm font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                        {loading ? (
                            <>
                                <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Refreshing...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Available Drivers */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Available Drivers
                            <span className="ml-2 text-primary font-bold">{pagination.totalCount}</span>
                        </h2>
                        {!loading && availableDrivers.length > 0 && (
                            <p className="text-sm text-gray-500 mt-1">
                                Showing <span className="font-medium">{((pagination.currentPage - 1) * pagination.limit) + 1}</span> to <span className="font-medium">{Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)}</span> of <span className="font-medium">{pagination.totalCount}</span> drivers
                            </p>
                        )}
                    </div>
                    <div className="hidden md:block">
                        <span className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Click on any driver card to view more details
                        </span>
                    </div>
                </div>
                
                {loading && (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center p-3 bg-primary/5 rounded-full mb-3">
                            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-gray-600 font-medium">Loading drivers...</p>
                        <p className="text-gray-500 text-sm mt-1">Please wait while we find available drivers</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Error Loading Drivers</h3>
                        <p className="text-red-500 mb-4">{error}</p>
                        <button 
                            onClick={() => fetchDrivers()}
                            className="px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium shadow-sm flex items-center gap-1.5 mx-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {availableDrivers.map((driver) => (
                            <div key={driver.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow bg-white relative overflow-hidden">
                                {/* Decorative element */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full"></div>
                                
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="relative">
                                        <Image
                                            src={driver.image}
                                            alt={driver.name}
                                            width={60}
                                            height={60}
                                            className="rounded-full ring-2 ring-primary/20 object-cover"
                                        />
                                        <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full ring-2 ring-white"></span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-base">{driver.name}</h3>
                                        <div className="flex items-center text-xs mt-1">
                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                {driver.experience} exp
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4 space-y-2">
                                    <div className="flex items-center space-x-1">
                                        {renderStars(driver.rating)}
                                        <span className="text-xs text-gray-600 ml-1 font-medium">
                                            {driver.rating.toFixed(1)}/5 {driver.ratingCount > 0 && `• ${driver.ratingCount} reviews`}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                        <div className="flex items-center gap-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-xs text-gray-700">{driver.district}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-2 mt-4">
                                    <button
                                        className="flex-1 bg-primary text-white py-2.5 px-3 rounded-lg hover:bg-primary/90 transition-all font-medium text-xs flex items-center justify-center gap-1 shadow-sm"
                                        onClick={() => handleAssignDriver(driver.id, driver.name)}
                                    >
                                        {/* {vanId ? 'Request for Van' : 'Request Driver'}
                                    </button>
                                    <Link href={`/vanowner/vehicles/driver/details/${driver.id}${driver.id ? `?vanId=${vanId}&vanMakeAndModel=${vanMakeAndModel ?? ''}` : ''}`}>
                                        <button className="flex-1 border border-primary text-primary text-xs py-2 px-3 rounded-lg hover:bg-primary/10 transition-colors"> */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Request Driver
                                    </button>
                                    <Link href={`/vanowner/vehicles/driver/details/${driver.id}${driver.id ? `?vanId=${vanId}&vanMakeAndModel=${vanMakeAndModel ?? ''}` : ''}`}>
                                        <button className="flex-1 border border-primary text-primary py-2.5 px-3 rounded-lg hover:bg-primary/5 transition-all font-medium text-xs flex items-center justify-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && availableDrivers.length === 0 && (
                    <div className="text-center py-12 px-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No drivers found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">We couldn&apos;t find any drivers matching your search criteria. Try adjusting your filters or search terms.</p>
                        <button 
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedDistrict('All');
                                fetchDrivers();
                            }}
                            className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                        >
                            Reset filters
                        </button>
                    </div>
                )}

                {/* Pagination Controls */}
                {!loading && !error && pagination.totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-center items-center mt-8 gap-3">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={!pagination.hasPrevPage}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                        </button>
                        
                        <div className="flex gap-2">
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                let pageNum;
                                if (pagination.totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (pagination.currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                                    pageNum = pagination.totalPages - 4 + i;
                                } else {
                                    pageNum = pagination.currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-10 h-10 flex items-center justify-center text-sm border rounded-lg ${
                                            pageNum === pagination.currentPage
                                                ? 'bg-primary text-white border-primary font-medium shadow-sm'
                                                : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={!pagination.hasNextPage}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
                        >
                            Next
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        <span className="ml-1 text-sm text-gray-500">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignDriver;