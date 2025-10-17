'use client';

import { useEffect, useState } from 'react';
import { FaStar, FaChartBar, FaUsers, FaBus, FaCalendar } from 'react-icons/fa';

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
  monthlyReviews: { [key: string]: number };
  driverReviews: number;
  vanServiceReviews: number;
  uniqueDrivers: number;
  uniqueVanServices: number;
  recentReviews: number;
}

export default function StatisticsTab() {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // Fetch all reviews
      const response = await fetch('/api/reviews');
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      const reviews = data.reviews || [];
      
      // Calculate statistics
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews 
        : 0;
      
      // Rating distribution
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews.forEach((review: any) => {
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
      });
      
      // Monthly reviews
      const monthlyReviews: { [key: string]: number } = {};
      reviews.forEach((review: any) => {
        const date = new Date(review.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyReviews[monthKey] = (monthlyReviews[monthKey] || 0) + 1;
      });
      
      const driverReviews = reviews.filter((review: any) => review.reviewType === 'DRIVER').length;
      const vanServiceReviews = reviews.filter((review: any) => review.reviewType === 'VAN_SERVICE').length;
      
      const uniqueDrivers = new Set(reviews.filter((review: any) => review.reviewType === 'DRIVER').map((review: any) => review.targetId)).size;
      const uniqueVanServices = new Set(reviews.filter((review: any) => review.reviewType === 'VAN_SERVICE').map((review: any) => review.targetId)).size;
      
      // Recent reviews (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentReviews = reviews.filter((review: any) => new Date(review.createdAt) > thirtyDaysAgo).length;
      
      setStats({
        totalReviews,
        averageRating,
        ratingDistribution,
        monthlyReviews,
        driverReviews,
        vanServiceReviews,
        uniqueDrivers,
        uniqueVanServices,
        recentReviews
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`text-sm ${
          index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderRatingBar = (rating: number, count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return (
      <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200">
        <div className="flex items-center w-16">
          <span className="text-base font-bold text-gray-800">{rating}</span>
          <FaStar className="text-amber-400 text-base ml-1" />
        </div>
        <div className="flex-1 bg-gray-200 rounded-full h-3 shadow-inner">
          <div 
            className="h-3 rounded-full transition-all duration-500 shadow-sm"
            style={{ 
              width: `${percentage}%`,
              background: 'linear-gradient(90deg, #0099cc 0%, #00bcd4 60%, #00d4aa 100%)'
            }}
          ></div>
        </div>
        <span className="text-base font-bold w-12 text-right" style={{ color: '#2b3674' }}>{count}</span>
      </div>
    );
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={fetchStatistics}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-xl mr-6" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
              <FaChartBar className="text-xl text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Reviews</p>
              <p className="text-3xl font-bold" style={{ color: '#2b3674' }}>{stats.totalReviews}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-xl mr-6" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
              <FaStar className="text-xl text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Average Rating</p>
              <div className="flex items-center">
                <p className="text-3xl font-bold mr-2" style={{ color: '#2b3674' }}>{stats.averageRating.toFixed(1)}</p>
                <div className="flex">{renderStars(stats.averageRating)}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-xl mr-6" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
              <FaUsers className="text-xl text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Driver Reviews</p>
              <p className="text-3xl font-bold" style={{ color: '#2b3674' }}>{stats.driverReviews}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-3 rounded-xl mr-6" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
              <FaBus className="text-xl text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Van Service Reviews</p>
              <p className="text-3xl font-bold" style={{ color: '#2b3674' }}>{stats.vanServiceReviews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rating Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-lg mr-3" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
              <FaChartBar className="text-lg text-white" />
            </div>
            <h3 className="text-xl font-bold" style={{ color: '#2b3674' }}>Rating Distribution</h3>
          </div>
          <div className="space-y-4">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="group">
                {renderRatingBar(rating, stats.ratingDistribution[rating], stats.totalReviews)}
              </div>
            ))}
          </div>
        </div>

        {/* Review Types */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-lg mr-3" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
              <FaUsers className="text-lg text-white" />
            </div>
            <h3 className="text-xl font-bold" style={{ color: '#2b3674' }}>Review Breakdown</h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 rounded-lg mr-3" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
                  <FaUsers className="text-sm text-white" />
                </div>
                <span className="font-medium text-gray-700">Driver Reviews</span>
              </div>
              <span className="text-xl font-bold" style={{ color: '#2b3674' }}>{stats.driverReviews}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 rounded-lg mr-3" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
                  <FaBus className="text-sm text-white" />
                </div>
                <span className="font-medium text-gray-700">Van Service Reviews</span>
              </div>
              <span className="text-xl font-bold" style={{ color: '#2b3674' }}>{stats.vanServiceReviews}</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg mr-3" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
                    <FaUsers className="text-sm text-white" />
                  </div>
                  <span className="font-medium text-gray-700">Unique Drivers</span>
                </div>
                <span className="text-xl font-bold" style={{ color: '#2b3674' }}>{stats.uniqueDrivers}</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-gray-200 mt-3">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg mr-3" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
                    <FaBus className="text-sm text-white" />
                  </div>
                  <span className="font-medium text-gray-700">Unique Van Services</span>
                </div>
                <span className="text-xl font-bold" style={{ color: '#2b3674' }}>{stats.uniqueVanServices}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Reviews Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-3 rounded-xl mr-4" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
            <FaCalendar className="text-2xl text-white" />
          </div>
          <h3 className="text-xl font-bold" style={{ color: '#2b3674' }}>Reviews This Month</h3>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <p className="text-5xl font-bold" style={{ color: '#2b3674' }}>{stats.recentReviews}</p>
              <p className="text-gray-600 font-medium mt-2">Reviews in the last 30 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      {Object.keys(stats.monthlyReviews).length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-lg mr-3" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
              <FaCalendar className="text-lg text-white" />
            </div>
            <h3 className="text-xl font-bold" style={{ color: '#2b3674' }}>Monthly Review Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-left py-4 px-2 font-semibold text-gray-700">Month</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-700">Reviews</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-700">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.monthlyReviews)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .slice(0, 12)
                  .map(([month, count], index) => {
                    const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                    const [year, monthNum] = month.split('-');
                    const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    });
                    
                    return (
                      <tr key={month} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <td className="py-4 px-2 font-medium text-gray-900">{monthName}</td>
                        <td className="py-4 px-2 font-bold" style={{ color: '#2b3674' }}>{count}</td>
                        <td className="py-4 px-2 font-medium text-gray-600">{percentage.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
