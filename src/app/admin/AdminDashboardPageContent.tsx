"use client";

import { useEffect, useState } from "react";
import {
  FaChartBar,
  FaBus,
  FaUser,
  FaMoneyBill,
  FaCalendar,
  FaUserShield,
} from "react-icons/fa";
import EarningsChart from "./components/EarningsChart";

const AdminDashboardPageContent = () => {
  type ChartItem = {
    month: string;
    earnings: number;
  };

  type DashboardData = {
    driversCount: number;
    vanOwnersCount: number;
    parentsCount: number;
    childrenCount: number;
    totalRevenue: number;
    chartData: ChartItem[];
  };
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    driversCount: 0,
    vanOwnersCount: 0,
    parentsCount: 0,
    childrenCount: 0,
    totalRevenue: 0,
    chartData: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        } else {
          console.error("Failed to load dashboard data");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  const {
    driversCount,
    vanOwnersCount,
    parentsCount,
    childrenCount,
    totalRevenue,
    chartData,
  } = dashboardData;

  return (
    <>
      {/* Earnings Chart and Stats Section */}
      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Van Drivers
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    {driversCount}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaUser className="text-xl text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">
                    Van Owners
                  </p>
                  <p className="text-2xl font-bold text-purple-700">
                    {vanOwnersCount}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaBus className="text-xl text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Parents</p>
                  <p className="text-2xl font-bold text-green-700">
                    {parentsCount}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaUserShield className="text-xl text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">
                    Children
                  </p>
                  <p className="text-2xl font-bold text-orange-700">
                    {childrenCount}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FaUser className="text-xl text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-teal-600">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-bold text-teal-700">
                    ${Number(totalRevenue.toFixed(2)).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-teal-100 rounded-lg">
                  <FaMoneyBill className="text-xl text-teal-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600">
                    Monthly Revenue
                  </p>
                  <p className="text-2xl font-bold text-indigo-700">
                    $
                    {chartData?.length
                      ? chartData[
                          chartData.length - 1
                        ].earnings.toLocaleString()
                      : 0}
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <FaCalendar className="text-xl text-indigo-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Earnings Chart Card */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaChartBar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Revenue Performance
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Monthly earnings overview and trends
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {chartData?.length || 0} months data
              </div>
            </div>

            <EarningsChart data={chartData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPageContent;
