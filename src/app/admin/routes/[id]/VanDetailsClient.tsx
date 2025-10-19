"use client";

import { useEffect, useState } from "react";
import { Truck } from "lucide-react";

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
    return <div className="text-center">Loading van details...</div>;
  }

  if (error || !van) {
    return <div className="text-red-600">{error || "Van not found"}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-[#0099cc]">
        <Truck className="h-6 w-6" />
        Van Summary
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-6 text-gray-700">
        {[
          { label: "Registration", value: van.registrationNumber },
          { label: "Make & Model", value: van.makeAndModel },
          {
            label: "Driver Name",
            value: van.driverName || "N/A",
          },
          { label: "Seating Capacity", value: van.seatingCapacity },
          {
            label: "Status",
            value: van.UserProfile?.VanService?.status ?? "Pending",
            valueClass:
              van.UserProfile?.VanService?.status === "Active"
                ? "text-green-600"
                : van.UserProfile?.VanService?.status === "Inactive"
                ? "text-red-600"
                : "text-yellow-600",
          },
          {
            label: "Owner",
            value: van.ownerName || "N/A",
          },
        ].map(({ label, value, valueClass }) => (
          <div key={label} className="flex flex-col">
            <p className="uppercase text-xs tracking-wide text-[#0099cc] mb-1 text-md font-semibold">
              {label}
            </p>
            <p className={`text-md ${valueClass || "text-gray-800"}`}>
              {value}
            </p>
            <div className="mt-1 h-1 w-10 bg-[#0099cc] rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
