import { useState, useEffect } from 'react';
import { Driver, DriverResponse, PaginationInfo } from '@/types/driver';

export const useDrivers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 6,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = async (page: number = pagination.currentPage) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(selectedDistrict !== 'All' && { district: selectedDistrict })
      });
      // console.log('Fetching drivers with params:', params.toString());
      const response = await fetch(`/api/van_service/drivers?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch drivers');
      }

      
      const data: DriverResponse = await response.json();
      
      // console.log('Fetching drivers with params:', data);
      setAvailableDrivers(data.drivers);
      setPagination(data.pagination);
      setAvailableDistricts(data.availableDistricts);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setError('Failed to load drivers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchDrivers(newPage);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDrivers();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDrivers(1); // Reset to page 1 when search changes
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedDistrict]);

  return {
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
  };
};
