'use client';

import Image from 'next/image';
import React from 'react';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import Link from "next/link";
import { useDrivers } from '@/hooks/useDrivers';

const AssignDriver = () => {
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

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index < rating ? 'text-yellow-500' : 'text-gray-300'}>
        ⭐
      </span>
        ));
    };

    const handleAssignDriver = (driverId: string, driverName: string) => {
        // Handle driver assignment logic here
        console.log(`Assigning driver ${driverName} (ID: ${driverId}) to van`);
        // You can add your API call or state management logic here
    };

    return (
        <div>
            {/* Search Bar and Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
                <div className="relative w-full md:w-1/3">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search drivers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-search-bar-bg"
                        disabled={loading}
                    />
                </div>
                <div className="relative w-full md:w-48">
                    <select
                        className="w-full px-4 py-3 bg-search-bar-bg rounded-md text-sm cursor-pointer appearance-none"
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        disabled={loading}
                    >
                        <option value="All">All Districts</option>
                        {availableDistricts.map(district => (
                            <option key={district} value={district}>{district}</option>
                        ))}
                    </select>
                    <FaChevronDown className="ml-2 absolute top-3.5 left-40 cursor-pointer" />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fetchDrivers()}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 text-sm"
                    >
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* Available Drivers */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">
                        Available Drivers ({pagination.totalCount})
                        {!loading && availableDrivers.length > 0 && (
                            <span className="text-sm text-gray-500 font-normal ml-2">
                                Showing {((pagination.currentPage - 1) * pagination.limit) + 1}-{Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)}
                            </span>
                        )}
                    </h2>
                </div>
                
                {loading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-gray-500 mt-2">Loading drivers...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-8">
                        <p className="text-red-500">{error}</p>
                        <button 
                            onClick={() => fetchDrivers()}
                            className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {availableDrivers.map((driver) => (
                            <div key={driver.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-4 mb-3">
                                    <Image
                                        src={driver.image}
                                        alt={driver.name}
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-sm">{driver.name}</h3>
                                        <p className="text-xs text-gray-500">License: {driver.licenseId}</p>
                                        <p className="text-xs text-gray-500">Experience: {driver.experience}</p>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="flex items-center space-x-1 mb-1">
                                        {renderStars(driver.rating)}
                                        <span className="text-xs text-gray-500 ml-1">
                                            ({driver.rating}/5) {driver.ratingCount > 0 && `- ${driver.ratingCount} reviews`}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">District: {driver.district}</p>
                                    <p className="text-xs text-gray-500">Contact: {driver.contact}</p>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        className="flex-1 bg-primary text-white text-xs py-2 px-3 rounded-lg hover:bg-primary/90 transition-colors"
                                        onClick={() => handleAssignDriver(driver.id, driver.name)}
                                    >
                                        Request Driver
                                    </button>
                                    <Link href={'/vanowner/vehicles/driver/details'}>
                                        <button className="flex-1 border border-primary text-primary text-xs py-2 px-3 rounded-lg hover:bg-primary/10 transition-colors">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && availableDrivers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p>No drivers found matching your search criteria.</p>
                    </div>
                )}

                {/* Pagination Controls */}
                {!loading && !error && pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6 gap-2">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={!pagination.hasPrevPage}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        
                        <div className="flex gap-1">
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
                                        className={`px-3 py-2 text-sm border rounded-md ${
                                            pageNum === pagination.currentPage
                                                ? 'bg-primary text-white border-primary'
                                                : 'border-gray-300 hover:bg-gray-50'
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
                            className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>

                        <span className="ml-4 text-sm text-gray-500">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignDriver;