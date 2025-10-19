'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import TopBarContent from '@/app/dashboardComponents/TopBarContent';
import { FaMoneyBillWave, FaBus, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import { TbMoneybag } from 'react-icons/tb';

interface RevenueData {
  totalRevenue: number;
  totalPayments: number;
  revenueByVan: Array<{
    van: {
      id: number;
      makeAndModel: string;
      licensePlateNumber: string;
      registrationNumber: string;
    };
    totalRevenue: number;
    paymentCount: number;
    payments: any[];
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    paymentCount: number;
  }>;
  vans: Array<{
    id: number;
    makeAndModel: string;
    licensePlateNumber: string;
    registrationNumber: string;
    status: number;
  }>;
  payments: any[];
}

const RevenuePage = () => {
  const { data: session, status } = useSession();
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  const fetchRevenueData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedMonth) params.append('month', selectedMonth);
      if (selectedYear) params.append('year', selectedYear);
      
      const response = await fetch(`/api/vanowner/revenue?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch revenue data');
      }
      
      const result = await response.json();
      setRevenueData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchRevenueData();
    }
  }, [session, selectedMonth, selectedYear]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCurrentMonthYear = () => {
    const now = new Date();
    return {
      month: (now.getMonth() + 1).toString(),
      year: now.getFullYear()
    };
  };

  const { month: currentMonth, year: currentYear } = getCurrentMonthYear();

  if (status === 'loading' || isLoading) {
    return (
      <section className="p-6 md:p-10 min-h-screen w-full bg-page-background">
        <TopBarContent heading="Revenue" serverSession={null} />
        <div className="flex items-center justify-center h-64">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'rgba(0, 212, 170, 0.1)' }}>
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent" style={{ borderColor: '#00d4aa' }}></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-6 md:p-10 min-h-screen w-full bg-page-background">
        <TopBarContent heading="Revenue" serverSession={null} />
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchRevenueData}
            className="mt-4 px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-white"
            style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}
            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0.95)'}
            onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6 md:p-10 min-h-screen w-full bg-page-background">
      <TopBarContent heading="Revenue" serverSession={null} />
      
      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(90deg, #0099cc 0%, #00bcd4 60%, #00d4aa 100%)' }}>
            <FaFilter className="text-white text-lg" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Filter Revenue Data</h3>
        </div>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white"
              style={{ '--tw-ring-color': '#00d4aa' } as React.CSSProperties}
              onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <option value="">All Months</option>
              {Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                return (
                  <option key={month} value={month.toString()}>
                    {new Date(2024, i).toLocaleDateString('en-US', { month: 'long' })}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 transition-all duration-200 bg-gray-50 focus:bg-white"
              style={{ '--tw-ring-color': '#00d4aa' } as React.CSSProperties}
              onFocus={(e) => e.target.style.borderColor = '#00d4aa'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <option value="">All Years</option>
              {Array.from({ length: 5 }, (_, i) => {
                const year = currentYear - i;
                return (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            onClick={() => {
              setSelectedMonth('');
              setSelectedYear('');
            }}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold border border-gray-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-200">
          <div className="p-3 rounded-full" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
            <TbMoneybag className="text-xl text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-800">
              {revenueData ? formatCurrency(revenueData.totalRevenue) : 'Rs. 0'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-200">
          <div className="p-3 rounded-full" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
            <FaMoneyBillWave className="text-xl text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Payments</p>
            <p className="text-2xl font-bold text-gray-800">
              {revenueData?.totalPayments || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-200">
          <div className="p-3 rounded-full" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
            <FaBus className="text-xl text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Active Vans</p>
            <p className="text-2xl font-bold text-gray-800">
              {revenueData?.vans.filter(van => van.status === 1).length || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-200">
          <div className="p-3 rounded-full" style={{ background: 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' }}>
            <FaMoneyBillWave className="text-xl text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Avg. Payment</p>
            <p className="text-2xl font-bold text-gray-800">
              {revenueData && revenueData.totalPayments > 0 
                ? formatCurrency(revenueData.totalRevenue / revenueData.totalPayments)
                : 'Rs. 0'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Payment History</h2>
              <p className="text-sm text-gray-600 mt-1">Detailed view of all payments received</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchRevenueData}
                className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                title="Refresh Data"
              >
                <FaMoneyBillWave className="text-gray-600" />
              </button>
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <FaMoneyBillWave style={{ color: '#00d4aa' }} size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'linear-gradient(90deg, #0099cc 0%, #00bcd4 60%, #00d4aa 100%)' }}>
                <th className="px-4 py-3 text-left font-semibold text-white">Van Details</th>
                <th className="px-4 py-3 text-left font-semibold text-white">Student</th>
                <th className="px-4 py-3 text-left font-semibold text-white">Parent</th>
                <th className="px-4 py-3 text-left font-semibold text-white">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-white">Month</th>
                <th className="px-4 py-3 text-left font-semibold text-white">Payment Date</th>
                <th className="px-4 py-3 text-left font-semibold text-white">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {revenueData?.payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No payments available.
                  </td>
                </tr>
              ) : (
                revenueData?.payments.slice(0, 10).map((payment, index) => (
                  <tr
                    key={payment.id}
                    className={`transition-colors hover:bg-blue-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-800">{payment.van.makeAndModel}</p>
                        <p className="text-xs text-gray-500">{payment.van.licensePlateNumber}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800">{payment.child.name}</p>
                        <p className="text-xs text-gray-500">Grade {payment.child.grade}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800">
                          {payment.UserProfile.firstname} {payment.UserProfile.lastname}
                        </p>
                        <p className="text-xs text-gray-500">{payment.UserProfile.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold" style={{ color: '#00d4aa' }}>
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{payment.month}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'Not Paid'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'PAID' ? 'text-white' :
                        payment.status === 'PENDING' ? 'text-white' :
                        'text-white'
                      }`} style={{
                        background: payment.status === 'PAID' ? 'linear-gradient(90deg, #4fb3d9 0%, #5bc0de 60%, #6dd5a8 100%)' :
                                   payment.status === 'PENDING' ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)' :
                                   'linear-gradient(90deg, #ef4444 0%, #f87171 100%)'
                      }}>
                        {payment.status === 'PAID' ? 'Paid' :
                         payment.status === 'PENDING' ? 'Pending' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
};

export default RevenuePage;