"use client";

import { useEffect, useState } from "react";
import CustomTable from "@/app/dashboardComponents/CustomTable";
import { useRouter } from "next/navigation";
import ViewVanDetails from "./ViewVanDetails";
import { FileText, FileCheck } from "lucide-react";

import { VanDetails } from "./types";
import { formatVanDetails } from "./utils";
import SearchFilter from "@/app/dashboardComponents/SearchFilter";

export default function RoutesPageContent() {
  const [vans, setVans] = useState<VanDetails[]>([]);
  const [selectedVan, setSelectedVan] = useState<VanDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const fetchVans = async () => {
      try {
        const res = await fetch("/api/admin/routes/vans");
        if (!res.ok) {
          console.error("Failed to fetch vans. Status:", res.status);
          return;
        }

        const json = await res.json();
        console.log(json);
        const list = Array.isArray(json)
          ? json
          : json && json.success && Array.isArray(json.data)
          ? json.data
          : null;

        if (Array.isArray(list)) {
          const formatted = list.map(formatVanDetails);
          setVans(formatted);
        } else {
          console.error("Unexpected API response:", json);
        }
      } catch (error) {
        console.error("Failed to fetch vans:", error);
      }
    };
    fetchVans();
  }, []);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
  };

  const filteredVans = vans.filter((van) => {
    const matchesSearch = searchTerm
      ? [
          van.serviceName,
          van.ownerName,
          van.email,
          van.contact,
          van.licensePlateNumber,
          van.registrationNumber,
        ]
          .filter(Boolean)
          .some((field) =>
            String(field).toLowerCase().includes(searchTerm.toLowerCase())
          )
      : true;

    const matchesStatus = selectedStatus
      ? van.isApproved === selectedStatus
      : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <SearchFilter
        onSearchChange={setSearchTerm}
        onStatusChange={setSelectedStatus}
        onRoleChange={() => {}}
        onDateChange={() => {}}
        onClearFilters={handleClearFilters}
        config={{
          SearchBarCss: "min-w-[400px] sm:min-w-[500px] ml-",
          searchPlaceholder:
            "Search vans... (service, owner, email, contact, plate)",
          roleOptions: undefined,
          statusOptions: [
            { value: "", label: "Status" },
            { value: "Approved", label: "Approved" },
            { value: "Rejected", label: "Rejected" },
            { value: "Pending", label: "Pending" },
          ],
          showDateFilter: false,
          showAddButton: false,
          showClearButton: true,
        }}
      />
      <div className="flex h-5"></div>

      <CustomTable
        columns={[
          { key: "serviceName", label: "Van Service Name" },
          { key: "ownerName", label: "Owner Name" },
          { key: "id", label: "Van ID" },
          { key: "email", label: "Email" },
          { key: "contact", label: "Contact No" },
          { key: "isApproved", label: "Status" },
        ]}
        data={filteredVans}
        renderCell={(column, value, row) => {
          if (column === "serviceName") {
            return (
              <div className="flex items-center gap-2">
                <img
                  src={row.photoUrl || "/images/user__.png"}
                  alt={row.name}
                  className="w-8 h-8 rounded-full  border border-[#0099cc]"
                />
                <span>{row.name}</span>
              </div>
            );
          }

          return value; // default for other cells
        }}
        actions={[
          {
            type: "custom",
            label: "View",
            icon: <FileText size={16} color="blue" />,
            onClick: (row) => setSelectedVan(row as VanDetails),
          },
          {
            type: "custom",
            label: "Routes",
            icon: <FileCheck size={16} color="green" />,
            onClick: (row) => router.push(`/admin/routes/${row.id}`),
          },
        ]}
      />

      {selectedVan && (
        <ViewVanDetails
          van={selectedVan}
          onClose={() => setSelectedVan(null)}
        />
      )}
    </>
  );
}
