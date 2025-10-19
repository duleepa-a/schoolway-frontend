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
import StatCard from "../dashboardComponents/StatCard";
import ActivityFeed from "../dashboardComponents/ActivityFeed";
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
      {/* Earnings Chart and Activity Feed side by side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Earnings Chart - takes up 2/3 of the space */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4 border border-gray-200">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              icon={<FaChartBar className="text-xl" />}
              text="Van Drivers"
              number={driversCount}
            />
            <StatCard
              icon={<FaBus className="text-xl" />}
              text="Van Owners"
              number={vanOwnersCount}
            />
            <StatCard
              icon={<FaUser className="text-xl" />}
              text="Parents"
              number={parentsCount}
            />
            <StatCard
              icon={<FaUserShield className="text-xl" />}
              text="Children"
              number={childrenCount}
            />
            <StatCard
              icon={<FaMoneyBill className="text-xl" />}
              text="Total Earnings"
              number={Number(totalRevenue.toFixed(2))}
            />
            <StatCard
              icon={<FaCalendar className="text-xl" />}
              text="Monthly Revenue"
              number={
                chartData?.length ? chartData[chartData.length - 1].earnings : 0
              }
            />
          </div>

          <h2 className="text-lg font-semibold mb-4">Earnings Chart</h2>
          <EarningsChart data={chartData} />
        </div>

        {/* Activity Feed */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <ActivityFeed />
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPageContent;
