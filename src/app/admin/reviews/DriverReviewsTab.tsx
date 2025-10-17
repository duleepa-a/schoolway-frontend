'use client';

import { useEffect, useState } from 'react';
import { FaStar, FaUser, FaBus, FaCalendar, FaEye } from 'react-icons/fa';

interface DriverReview {
  id: string;
  childId: number;
  reviewType: 'DRIVER';
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
    driverProfile: {
      averageRating: number;
    } | null;
  };
  Van: {
    id: number;
    registrationNumber: string;
    makeAndModel: string;
  };
}

export default function DriverReviewsTab() {
  const [reviews, setReviews] = useState<DriverReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  useEffect(() => {
    fetchDriverReviews();
  }, []);

  const fetchDriverReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews?reviewType=DRIVER');
      
      if (!response.ok) {
        throw new Error('Failed to fetch driver reviews');
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
          onClick={fetchDriverReviews}
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
                placeholder="Search by driver, child, van, or comment..."
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
              <FaUser className="text-xl text-white" />
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
              <FaBus className="text-xl text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Unique Drivers</p>
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
              <FaUser className="text-lg text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Driver Reviews ({filteredReviews.length})</h3>
          </div>
        </div>
        
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center">
            <div className="p-4 rounded-full bg-gray-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaUser className="text-2xl text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {searchTerm || ratingFilter ? 'No reviews match your filters.' : 'No driver reviews found.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Driver
                  </th>
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
                {filteredReviews.map((review, index) => (
                  <tr key={review.id} className={`hover:bg-gray-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {review.UserProfile.dp ? (
                            <img
                              src={review.UserProfile.dp}
                              alt={`${review.UserProfile.firstname} ${review.UserProfile.lastname}`}
                              className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-200"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (nextSibling) {
                                      nextSibling.style.display = 'flex';
                                    }
                                  }}
                            />
                          ) : null}
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center ring-2 ring-gray-200 ${review.UserProfile.dp ? 'hidden' : ''}`} style={{ background: 'linear-gradient(90deg, #0099cc 0%, #00bcd4 60%, #00d4aa 100%)' }}>
                            <FaUser className="text-white text-lg" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center mb-1">
                            <div className="text-sm font-semibold text-gray-900 mr-2">
                              {review.UserProfile.firstname} {review.UserProfile.lastname}
                            </div>
                            {review.UserProfile.driverProfile?.averageRating && (
                              <>
                                <div className="flex items-center mr-2">
                                  {renderStars(review.UserProfile.driverProfile.averageRating)}
                                </div>
                                <span className="text-xs font-medium text-gray-600">
                                  {review.UserProfile.driverProfile.averageRating.toFixed(1)}/5
                                </span>
                              </>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
                            {review.UserProfile.mobile ? (
                              <a 
                                href={`tel:${review.UserProfile.mobile}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 inline-flex items-center"
                                title="Click to call"
                              >
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                </svg>
                                {review.UserProfile.mobile}
                              </a>
                            ) : (
                              <span className="text-gray-400 italic">No contact</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
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
        )}
      </div>
    </div>
  );
}
