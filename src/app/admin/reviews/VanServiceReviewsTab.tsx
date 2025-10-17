'use client';

import { useEffect, useState } from 'react';
import { FaStar, FaBuilding, FaBus, FaCalendar, FaUser } from 'react-icons/fa';

interface VanServiceReview {
  id: string;
  childId: number;
  reviewType: 'VAN_SERVICE';
  targetId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  vanId: number;
  Child: {
    id: number;
    name: string;
  };
  UserProfile: {
    id: string;
    firstname: string | null;
    lastname: string | null;
    dp: string | null;
    mobile: string | null;
  };
  Van: {
    id: number;
    registrationNumber: string;
    makeAndModel: string;
    ownerId: string;
    serviceName?: string;
  };
}

export default function VanServiceReviewsTab() {
  const [reviews, setReviews] = useState<VanServiceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  useEffect(() => {
    fetchVanServiceReviews();
  }, []);

  const fetchVanServiceReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews?reviewType=VAN_SERVICE');
      
      if (!response.ok) {
        throw new Error('Failed to fetch van service reviews');
      }
      
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (!searchTerm && ratingFilter === null) return true;
    
    const matchesSearch = !searchTerm || (
      review.UserProfile.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.UserProfile.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.Child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.Van.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.Van.makeAndModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesRating = ratingFilter === null || review.rating === ratingFilter;
    
    return matchesSearch && matchesRating;
  });

  // Group reviews by service owner and van service
  const groupedReviews = filteredReviews.reduce((acc, review) => {
    const ownerKey = `${review.UserProfile.firstname} ${review.UserProfile.lastname}`;
    const serviceName = review.Van.serviceName || 'Unknown Service';
    
    if (!acc[ownerKey]) {
      acc[ownerKey] = {
        owner: review.UserProfile,
        serviceName: serviceName,
        reviews: [],
        averageRating: 0,
        totalReviews: 0
      };
    }
    acc[ownerKey].reviews.push(review);
    acc[ownerKey].totalReviews++;
    acc[ownerKey].averageRating = acc[ownerKey].reviews.reduce((sum, r) => sum + r.rating, 0) / acc[ownerKey].totalReviews;
    return acc;
  }, {} as Record<string, {
    owner: any;
    serviceName: string;
    reviews: VanServiceReview[];
    averageRating: number;
    totalReviews: number;
  }>);

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#0099cc' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-600 font-medium">Error: {error}</p>
        <button 
          onClick={fetchVanServiceReviews}
          className="mt-3 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by van service owner, child, van, or comment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <select
            value={ratingFilter || ''}
            onChange={(e) => setRatingFilter(e.target.value ? parseInt(e.target.value) : null)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all duration-200"
          >
            <option value="">All Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
            <option value="4">⭐⭐⭐⭐ 4 Stars</option>
            <option value="3">⭐⭐⭐ 3 Stars</option>
            <option value="2">⭐⭐ 2 Stars</option>
            <option value="1">⭐ 1 Star</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-xl mr-4" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
              <FaBuilding className="text-xl text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Reviews</p>
              <p className="text-3xl font-bold" style={{ color: '#2b3674' }}>{reviews.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-xl mr-4" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
              <FaUser className="text-xl text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Unique Services</p>
              <p className="text-3xl font-bold" style={{ color: '#2b3674' }}>
                {new Set(reviews.map(review => review.targetId)).size}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-xl mr-4" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
              <FaCalendar className="text-xl text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">This Month</p>
              <p className="text-3xl font-bold" style={{ color: '#2b3674' }}>
                {reviews.filter(review => {
                  const reviewDate = new Date(review.createdAt);
                  const now = new Date();
                  return reviewDate.getMonth() === now.getMonth() && 
                         reviewDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100" style={{ background: 'linear-gradient(90deg, #0099cc 0%, #00bcd4 60%, #00d4aa 100%)' }}>
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-white/20 mr-3">
              <FaBuilding className="text-lg text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Van Service Reviews ({filteredReviews.length}) - {Object.keys(groupedReviews).length} Service Owners</h3>
          </div>
        </div>
        
        {Object.keys(groupedReviews).length === 0 ? (
          <div className="p-12 text-center">
            <div className="p-4 rounded-full bg-gray-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaBuilding className="text-2xl text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {searchTerm || ratingFilter ? 'No reviews match your filters.' : 'No van service reviews found.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedReviews).map(([ownerName, group]) => (
              <div key={ownerName} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                {/* Service Owner Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-14 w-14">
                        {group.owner.dp ? (
                          <img
                            src={group.owner.dp}
                            alt={ownerName}
                            className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-200"
                                 onError={(e) => {
                                   e.currentTarget.style.display = 'none';
                                   const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                                   if (nextSibling) {
                                     nextSibling.style.display = 'flex';
                                   }
                                 }}
                          />
                        ) : null}
                        <div className={`h-14 w-14 rounded-full flex items-center justify-center ring-2 ring-gray-200 ${group.owner.dp ? 'hidden' : ''}`} style={{ background: 'linear-gradient(90deg, #0099cc 0%, #00bcd4 60%, #00d4aa 100%)' }}>
                          <FaBuilding className="text-white text-xl" />
                        </div>
                      </div>
                      <div className="ml-6">
                        <div className="flex items-center mb-1">
                          <div className="text-lg font-bold text-gray-900 mr-4" style={{ color: '#2b3674' }}>
                            {group.serviceName}
                          </div>
                          <div className="text-sm font-medium text-gray-700 mr-3">
                            {ownerName}
                          </div>
                          <div className="flex items-center mr-3">
                            {renderStars(group.averageRating)}
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {group.averageRating.toFixed(1)}/5
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {group.owner.mobile && (
                            <div className="mb-2">
                              <a 
                                href={`tel:${group.owner.mobile}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center"
                                title="Click to call"
                              >
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                </svg>
                                {group.owner.mobile}
                              </a>
                            </div>
                          )}
                          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium" style={{ color: '#2b3674' }}>
                            {group.totalReviews} review{group.totalReviews !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Reviews Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Child
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Van
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Comment
                        </th>
                        <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {group.reviews.map((review, index) => (
                        <tr key={review.id} className={`hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded-full inline-block">
                              {review.Child.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">ID: {review.Child.id}</div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div className="font-medium">{review.Van.makeAndModel}</div>
                              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block mt-1">{review.Van.registrationNumber}</div>
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex mr-2">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm font-bold px-2 py-1 rounded-full" style={{ color: '#2b3674', backgroundColor: '#f0f9ff' }}>
                                {review.rating}/5
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className={`p-3 rounded-xl max-w-xs ${review.comment ? 'bg-gray-50' : 'bg-gray-100 text-gray-500 italic'}`}>
                              <div className="text-sm text-gray-900">
                                {review.comment || 'No comment'}
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="text-sm text-gray-600">
                              <div className="font-medium">{formatDate(review.createdAt)}</div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
