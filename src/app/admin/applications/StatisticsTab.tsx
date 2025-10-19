import StatCard from "@/app/dashboardComponents/StatCard";
import DriverOverviewChart from "@/app/dashboardComponents/DriverOverviewChart";
import ActivityFeed from "@/app/dashboardComponents/ActivityFeed";
import DriverRatingChart from "@/app/dashboardComponents/DriverRatingChart";
import {
  FaFileAlt,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaRedo,
} from "react-icons/fa";
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

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-md font-semibold tracking-wide text-[var(--blue-shade-dark)] relative">
          Driver Applications
          <span className="absolute left-0 -bottom-1 w-10 h-[3px] bg-[var(--blue-shade-light)] rounded"></span>
        </h2>
      </div>
      <div className="grid grid-cols-5 gap-4 ">
        {" "}
        <StatCard
          icon={<FaFileAlt className="text-xl" />}
          text="Total Recieved"
          number={loading ? 0 : stats?.drivers?.total ?? 0}
        />{" "}
        <StatCard
          icon={<FaHourglassHalf className="text-xl" />}
          text="Pending "
          number={loading ? 0 : stats?.drivers?.pending ?? 0}
        />{" "}
        <StatCard
          icon={<FaCheckCircle className="text-xl" />}
          text="Approved"
          number={loading ? 0 : stats?.drivers?.approved ?? 0}
        />{" "}
        <StatCard
          icon={<FaTimesCircle className="text-xl" />}
          text="Rejected"
          number={loading ? 0 : stats?.drivers?.rejected ?? 0}
        />{" "}
      </div>

      <div className="grid grid-cols-5 gap-4">{/* StatCards here */}</div>

      <div className="flex items-center gap-2 mt-4">
        <h2 className="text-md font-semibold tracking-wide text-[var(--blue-shade-dark)] relative">
          Van Applications
          <span className="absolute left-0 -bottom-1 w-10 h-[3px] bg-[var(--blue-shade-light)] rounded"></span>
        </h2>
      </div>
      <div className="grid grid-cols-5 gap-4 mt-4 ">
        {" "}
        <StatCard
          icon={<FaFileAlt className="text-xl" />}
          text="Total Recieved"
          number={loading ? 0 : stats?.vans?.total ?? 0}
        />{" "}
        <StatCard
          icon={<FaHourglassHalf className="text-xl" />}
          text="Pending "
          number={loading ? 0 : stats?.vans?.pending ?? 0}
        />{" "}
        <StatCard
          icon={<FaCheckCircle className="text-xl" />}
          text="Approved"
          number={loading ? 0 : stats?.vans?.approved ?? 0}
        />{" "}
        <StatCard
          icon={<FaTimesCircle className="text-xl" />}
          text="Rejected"
          number={loading ? 0 : stats?.vans?.rejected ?? 0}
        />{" "}
      </div>

      <div className="grid grid-cols-5 gap-4 mb-10">{/* StatCards here */}</div>

      <div className="grid grid-cols-4 gap-1">
        {/* 3-row section (left side) - Driver Overview Chart */}
        <div className="col-span-2 dashboard-section-card">
          <DriverOverviewChart data={stats?.driverOverview ?? []} />
        </div>

        {/* 2-row section (below it) */}
        <div className="col-span-2 dashboard-section-card">
          <DriverRatingChart data={stats?.ratingDistribution ?? []} />
        </div>

        {/* Full-height dense section (right column) */}
      </div>
    </div>
  );
}
