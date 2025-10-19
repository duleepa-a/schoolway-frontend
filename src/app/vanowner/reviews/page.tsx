'use client';

import { useState, useEffect } from 'react';
import { FaStar, FaUser, FaBus, FaCalendarAlt, FaComment, FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import TopBarContent from '../../dashboardComponents/TopBarContent';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  Child: {
    id: number;
    name: string;
    UserProfile: {
      firstname: string;
      lastname: string;
      dp: string;
    } | null;
  };
  UserProfile?: {
    id: string;
    firstname: string;
    lastname: string;
    dp: string;
    driverProfile?: {
      averageRating: number;
    } | null;
  };
  Van: {
    id: number;
    registrationNumber: string;
    makeAndModel: string;
  };
}

interface ReviewsData {
  vanReviews: Review[];
  vanServiceReviews: Review[];
  totalVanReviews: number;
  totalVanServiceReviews: number;
  averageVanRating: number;
  averageVanServiceRating: number;
  ownerVans: Array<{
    id: number;
    registrationNumber: string;
    makeAndModel: string;
  }>;
  filters?: {
    search: string;
    minRating: number | null;
    maxRating: number | null;
    startDate: string | null;
    endDate: string | null;
    sortBy: string;
    sortOrder: string;
    reviewType: string;
  };
}

interface FilterState {
  search: string;
  minRating: number | null;
  maxRating: number | null;
  startDate: string;
  endDate: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  reviewType: 'all' | 'van' | 'service';
  selectedVan: string;
  selectedDriver: string;
}

const ReviewsPage = () => {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'van' | 'service'>('van');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    minRating: null,
    maxRating: null,
    startDate: '',
    endDate: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    reviewType: 'all',
    selectedVan: '',
    selectedDriver: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [filters]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.minRating !== null) params.append('minRating', filters.minRating.toString());
      if (filters.maxRating !== null) params.append('maxRating', filters.maxRating.toString());
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.selectedVan) params.append('selectedVan', filters.selectedVan);
      if (filters.selectedDriver) params.append('selectedDriver', filters.selectedDriver);
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);
      params.append('reviewType', filters.reviewType);

      console.log('Fetching reviews with params:', Object.fromEntries(params));
      const response = await fetch(`/api/vanowner/reviews?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Reviews data received:', data);
        setReviewsData(data);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch reviews:', errorData);
        // Set empty data to prevent crashes
        setReviewsData({
          vanReviews: [],
          vanServiceReviews: [],
          totalVanReviews: 0,
          totalVanServiceReviews: 0,
          averageVanRating: 0,
          averageVanServiceRating: 0,
          ownerVans: []
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`text-sm ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      minRating: null,
      maxRating: null,
      startDate: '',
      endDate: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      reviewType: 'all',
      selectedVan: '',
      selectedDriver: ''
    });
  };

  const handleTabChange = (tab: 'van' | 'service') => {
    setActiveTab(tab);
    
    // Clear van-specific filters when switching to service reviews
    if (tab === 'service') {
      setFilters(prev => ({
        ...prev,
        reviewType: 'service',
        selectedVan: '',
        selectedDriver: ''
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        reviewType: 'van'
      }));
    }
  };

  const renderReviewCard = (review: Review, type: 'van' | 'service') => (
    <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            {review.Child.UserProfile?.dp ? (
              <img
                src={review.Child.UserProfile.dp}
                alt="Parent"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <FaUser className="text-gray-500" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {review.Child.UserProfile ? 
                `${review.Child.UserProfile.firstname} ${review.Child.UserProfile.lastname}` : 
                'Anonymous Parent'
              }
            </h4>
            <p className="text-sm text-gray-600">Parent of {review.Child.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {renderStars(review.rating)}
          <span className="ml-2 text-sm font-medium text-gray-700">
            {review.rating}/5
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <FaBus className="text-blue-500" />
          <span className="font-medium">Van:</span>
          <span>{review.Van.registrationNumber} - {review.Van.makeAndModel}</span>
        </div>
        
        {type === 'van' && review.UserProfile && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <FaUser className="text-green-500" />
            <span className="font-medium">Driver:</span>
            <span>{review.UserProfile.firstname} {review.UserProfile.lastname}</span>
            {review.UserProfile.driverProfile?.averageRating && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                Avg: {review.UserProfile.driverProfile.averageRating.toFixed(1)}/5
              </span>
            )}
          </div>
        )}

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FaCalendarAlt className="text-purple-500" />
          <span>{formatDate(review.createdAt)}</span>
        </div>
      </div>

      {review.comment && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <FaComment className="text-gray-400 mt-1" />
            <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <section className="p-6 md:p-10 min-h-screen w-full bg-page-background">
        <TopBarContent heading="Reviews" serverSession={null} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </section>
    );
  }

  if (!reviewsData) {
    return (
      <section className="p-6 md:p-10 min-h-screen w-full bg-page-background">
        <TopBarContent heading="Reviews" serverSession={null} />
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load reviews. Please try again.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6 md:p-10 min-h-screen w-full bg-page-background">
      <TopBarContent heading="Reviews" serverSession={null} />

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews by parent name, child name, driver, van, or comment..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Van Filter Dropdown - Only show for van reviews */}
          {activeTab === 'van' && (
            <div className="flex items-center gap-2">
              <FaBus className="text-gray-400" />
              <select
                value={filters.selectedVan}
                onChange={(e) => handleFilterChange('selectedVan', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
              >
                <option value="">All Vans</option>
                {reviewsData?.ownerVans.map((van) => (
                  <option key={van.id} value={van.id.toString()}>
                    {van.registrationNumber} - {van.makeAndModel}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Driver Filter Dropdown - Only show for van reviews */}
          {activeTab === 'van' && (
            <div className="flex items-center gap-2">
              <FaUser className="text-gray-400" />
              <select
                value={filters.selectedDriver}
                onChange={(e) => handleFilterChange('selectedDriver', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
              >
                <option value="">All Drivers</option>
                {reviewsData?.vanReviews
                  .filter((review, index, self) => 
                    review.UserProfile && 
                    self.findIndex(r => r.UserProfile?.id === review.UserProfile?.id) === index
                  )
                  .map((review) => (
                    <option key={review.UserProfile?.id} value={review.UserProfile?.id}>
                      {review.UserProfile?.firstname} {review.UserProfile?.lastname}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FaFilter className="text-gray-600" />
            <span className="text-sm font-medium">Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <FaSort className="text-gray-400" />
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="rating-desc">Highest Rating</option>
              <option value="rating-asc">Lowest Rating</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Rating Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
                <select
                  value={filters.minRating || ''}
                  onChange={(e) => handleFilterChange('minRating', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Rating</label>
                <select
                  value={filters.maxRating || ''}
                  onChange={(e) => handleFilterChange('maxRating', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Van Reviews</p>
              <p className="text-2xl font-bold text-blue-600">{reviewsData.totalVanReviews}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaBus className="text-blue-600 text-xl" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            {renderStars(Math.round(reviewsData.averageVanRating))}
            <span className="ml-2 text-sm text-gray-600">
              {reviewsData.averageVanRating.toFixed(1)}/5
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Service Reviews</p>
              <p className="text-2xl font-bold text-green-600">{reviewsData.totalVanServiceReviews}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaStar className="text-green-600 text-xl" />
            </div>
          </div>
          <div className="mt-2 flex items-center">
            {renderStars(Math.round(reviewsData.averageVanServiceRating))}
            <span className="ml-2 text-sm text-gray-600">
              {reviewsData.averageVanServiceRating.toFixed(1)}/5
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-purple-600">
                {reviewsData.totalVanReviews + reviewsData.totalVanServiceReviews}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaComment className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Your Vans</p>
              <p className="text-2xl font-bold text-orange-600">{reviewsData.ownerVans.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FaBus className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => handleTabChange('van')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'van'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Van Reviews ({reviewsData.totalVanReviews})
            </button>
            <button
              onClick={() => handleTabChange('service')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'service'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Service Reviews ({reviewsData.totalVanServiceReviews})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'van' ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reviews for Your Vans' Drivers
              </h3>
              {reviewsData.vanReviews.length === 0 ? (
                <div className="text-center py-12">
                  <FaBus className="text-gray-300 text-4xl mx-auto mb-4" />
                  <p className="text-gray-500">No van reviews yet</p>
                  <p className="text-sm text-gray-400">Reviews for your vans' drivers will appear here</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviewsData.vanReviews.map((review) => renderReviewCard(review, 'van'))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reviews for Your Van Service
              </h3>
              {reviewsData.vanServiceReviews.length === 0 ? (
                <div className="text-center py-12">
                  <FaStar className="text-gray-300 text-4xl mx-auto mb-4" />
                  <p className="text-gray-500">No service reviews yet</p>
                  <p className="text-sm text-gray-400">Reviews for your van service will appear here</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviewsData.vanServiceReviews.map((review) => renderReviewCard(review, 'service'))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewsPage;
