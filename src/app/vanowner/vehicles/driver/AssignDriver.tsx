'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import TablePagination from '@/app/components/TablePagination';
import Link from "next/link";

const AssignDriver = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('All');

    const availableDrivers = [
        {
            id: 'D001',
            name: 'Duleepa Edirisinghe',
            experience: '6 years',
            rating: 5,
            image: '/Images/male_pro_pic_placeholder.png',
            district: 'Colombo',
            contact: '+94 77 123 4567'
        },
        {
            id: 'D002',
            name: 'Kamal Perera',
            experience: '8 years',
            rating: 4,
            image: '/Images/male_pro_pic_placeholder.png',
            district: 'Gampaha',
            contact: '+94 77 234 5678'
        },
        {
            id: 'D003',
            name: 'Sunil Fernando',
            experience: '5 years',
            rating: 4,
            image: '/Images/male_pro_pic_placeholder.png',
            district: 'Kalutara',
            contact: '+94 77 345 6789'
        },
        {
            id: 'D004',
            name: 'Ravi Silva',
            experience: '10 years',
            rating: 5,
            image: '/Images/male_pro_pic_placeholder.png',
            district: 'Colombo',
            contact: '+94 77 456 7890'
        },
        {
            id: 'D005',
            name: 'Nimal Jayasinghe',
            experience: '4 years',
            rating: 3,
            image: '/Images/male_pro_pic_placeholder.png',
            district: 'Gampaha',
            contact: '+94 77 567 8901'
        },
        {
            id: 'D006',
            name: 'Chaminda Rathnayake',
            experience: '7 years',
            rating: 4,
            image: '/Images/male_pro_pic_placeholder.png',
            district: 'Kalutara',
            contact: '+94 77 678 9012'
        }
    ];

    const filteredDrivers = availableDrivers.filter(driver => {
        const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDistrict = selectedDistrict === 'All' || driver.district === selectedDistrict;
        return matchesSearch && matchesDistrict;
    });

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
                    />
                </div>
                <div className="relative w-full md:w-48">
                    <select
                        className="w-full px-4 py-3 bg-search-bar-bg rounded-md text-sm cursor-pointer appearance-none"
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                    >
                        <option value="All">All Districts</option>
                        <option value="Colombo">Colombo</option>
                        <option value="Gampaha">Gampaha</option>
                        <option value="Kalutara">Kalutara</option>
                    </select>
                    <FaChevronDown className="ml-2 absolute top-3.5 left-40 cursor-pointer" />
                </div>

                <TablePagination totalPages={5} />
            </div>

            {/* Available Drivers */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Available Drivers ({filteredDrivers.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredDrivers.map((driver) => (
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
                                    <p className="text-xs text-gray-500">ID: {driver.id}</p>
                                    <p className="text-xs text-gray-500">Experience: {driver.experience}</p>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="flex items-center space-x-1 mb-1">
                                    {renderStars(driver.rating)}
                                    <span className="text-xs text-gray-500 ml-1">({driver.rating}/5)</span>
                                </div>
                                <p className="text-xs text-gray-500">District: {driver.district}</p>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    className="flex-1 bg-primary text-white text-xs py-2 px-3 rounded-lg hover:bg-primary/90 transition-colors"
                                    onClick={() => handleAssignDriver(driver.id, driver.name)}
                                >
                                    Assign Driver
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

                {filteredDrivers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p>No drivers found matching your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignDriver;