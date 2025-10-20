"use client";

import { useEffect, useState } from "react";
import {
  Truck,
  User,
  Shield,
  Users,
  Car,
  BadgeCheck,
  Clock,
} from "lucide-react";

interface VanType {
  id: number;
  registrationNumber: string;
  makeAndModel: string;
  seatingCapacity: number;
  UserProfile: {
    firstName: string;
    lastName: string;
    VanService: {
      driverName: string | null;
      status: string;
    } | null;
  } | null;
  Child: any[];
  Path: any[];
  ownerName?: string | null;
  driverName?: string | null;
}

export default function VanDetailsClient({ vanId }: { vanId: string }) {
  const [van, setVan] = useState<VanType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVanDetails() {
      try {
        const id = parseInt(vanId);
        const res = await fetch(`/api/admin/routes/vans/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Van not found");
            return;
          }
          throw new Error("Failed to fetch van data");
        }
        const data = await res.json();
        console.log("Fetched data: ------------------------", data);
        if (data.van) {
          setVan(data.van);
        } else {
          throw new Error("Invalid data structure returned from API");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch van data"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchVanDetails();
  }, [vanId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !van) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
        <div className="text-red-500 text-lg font-medium">
          {error || "Van not found"}
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-600 bg-green-100";
      case "inactive":
        return "text-red-600 bg-red-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <BadgeCheck className="w-4 h-4" />;
      case "inactive":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const vanDetails = [
    {
      label: "Registration Number",
      value: van.registrationNumber,
      icon: <Shield className="w-5 h-5 text-blue-600" />,
      color: "blue",
    },
    {
      label: "Make & Model",
      value: van.makeAndModel,
      icon: <Car className="w-5 h-5 text-purple-600" />,
      color: "purple",
    },
    {
      label: "Driver Name",
      value: van.driverName || "Not Assigned",
      icon: <User className="w-5 h-5 text-green-600" />,
      color: "green",
    },
    {
      label: "Seating Capacity",
      value: `${van.seatingCapacity} seats`,
      icon: <Users className="w-5 h-5 text-orange-600" />,
      color: "orange",
    },
    {
      label: "Service Status",
      value: van.UserProfile?.VanService?.status ?? "Pending",
      icon: getStatusIcon(van.UserProfile?.VanService?.status ?? "Pending"),
      status: true,
      color:
        van.UserProfile?.VanService?.status?.toLowerCase() === "active"
          ? "green"
          : van.UserProfile?.VanService?.status?.toLowerCase() === "inactive"
          ? "red"
          : "yellow",
    },
    {
      label: "Owner Name",
      value: van.ownerName || "N/A",
      icon: <User className="w-5 h-5 text-cyan-600" />,
      color: "cyan",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-xl">
          <Truck className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Van Summary</h3>
          <p className="text-gray-600 text-sm">
            Vehicle information and service details
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {vanDetails.map((detail, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-2 border border-gray-100 hover:border-gray-200 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg bg-${detail.color}-100`}>
                {detail.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide truncate">
                  {detail.label}
                </p>
                {detail.status ? (
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(
                      detail.value
                    )}`}
                  >
                    {getStatusIcon(detail.value)}
                    <span>{detail.value}</span>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-gray-800 truncate mt-1">
                    {detail.value}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
