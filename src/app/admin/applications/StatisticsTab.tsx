"use client";

import StatCard from "@/app/dashboardComponents/StatCard";
import DriverOverviewChart from "@/app/dashboardComponents/DriverOverviewChart";
import DriverRatingChart from "@/app/dashboardComponents/DriverRatingChart";
import {
  FaFileAlt,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { Users, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type CountSet = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  resubmitted: number;
};

type OverviewItem = { name: string; value: number; color?: string };
type RatingItem = { rating: string; count: number };
type ActivityItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  userName: string;
  userId: string;
  timestamp: string;
  status?: string;
};

type Stats = {
  drivers: CountSet;
  vans: CountSet;
  driverOverview?: OverviewItem[];
  ratingDistribution?: RatingItem[];
  activityFeed?: ActivityItem[];
};

export default function StatisticsTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch_stats_data = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/applications/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        Swal.fire({
          icon: "error",
          title: "Error fetching data",
          text: "Could not load stats",
        });
      } finally {
        setLoading(false);
      }
    };

    fetch_stats_data();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0099cc]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        {/* Driver Applications Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-[#0099cc]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Driver Applications
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              icon={<FaFileAlt className="text-xl text-[#0099cc]" />}
              text="Total Received"
              number={stats?.drivers?.total ?? 0}
              gradient="from-blue-50 to-cyan-50"
              borderColor="border-blue-100"
            />
            <StatCard
              icon={<FaHourglassHalf className="text-xl text-yellow-500" />}
              text="Pending Review"
              number={stats?.drivers?.pending ?? 0}
              gradient="from-yellow-50 to-amber-50"
              borderColor="border-yellow-100"
            />
            <StatCard
              icon={<FaCheckCircle className="text-xl text-green-500" />}
              text="Approved"
              number={stats?.drivers?.approved ?? 0}
              gradient="from-green-50 to-emerald-50"
              borderColor="border-green-100"
            />
            <StatCard
              icon={<FaTimesCircle className="text-xl text-red-500" />}
              text="Rejected"
              number={stats?.drivers?.rejected ?? 0}
              gradient="from-red-50 to-rose-50"
              borderColor="border-red-100"
            />
          </div>
        </div>

        {/* Van Applications Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Truck className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Van Applications
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              icon={<FaFileAlt className="text-xl text-purple-500" />}
              text="Total Received"
              number={stats?.vans?.total ?? 0}
              gradient="from-purple-50 to-violet-50"
              borderColor="border-purple-100"
            />
            <StatCard
              icon={<FaHourglassHalf className="text-xl text-yellow-500" />}
              text="Pending Review"
              number={stats?.vans?.pending ?? 0}
              gradient="from-yellow-50 to-amber-50"
              borderColor="border-yellow-100"
            />
            <StatCard
              icon={<FaCheckCircle className="text-xl text-green-500" />}
              text="Approved"
              number={stats?.vans?.approved ?? 0}
              gradient="from-green-50 to-emerald-50"
              borderColor="border-green-100"
            />
            <StatCard
              icon={<FaTimesCircle className="text-xl text-red-500" />}
              text="Rejected"
              number={stats?.vans?.rejected ?? 0}
              gradient="from-red-50 to-rose-50"
              borderColor="border-red-100"
            />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driver Overview Chart Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <DriverOverviewChart data={stats?.driverOverview ?? []} />
        </div>

        {/* Driver Rating Chart Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <DriverRatingChart data={stats?.ratingDistribution ?? []} />
        </div>
      </div>
    </div>
  );
}
