"use client";

import { useEffect, useState } from "react";
import CustomTable from "@/app/dashboardComponents/CustomTable";
import ViewVanApplication from "./ViewVanApplication";
import Swal from "sweetalert2";
import { FileText, FileCheck, FileX } from "lucide-react";
import { VanApplication } from "./types";
import { formatVanApplication } from "./utils";
import RejectionReasonModal from "./RejectionReasonModal";

export default function VanTab() {
  const [vans, setVans] = useState<VanApplication[]>([]);
  const [selectedVan, setSelectedVan] = useState<VanApplication | null>(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  // Fetch vans once on mount
  useEffect(() => {
    const fetchVans = async () => {
      try {
        const res = await fetch("/api/admin/applications/vans");
        const data = await res.json();
        const formatted = data.map(formatVanApplication);
        setVans(formatted);
      } catch (error) {
        console.error("Failed to fetch vans:", error);
        Swal.fire({
          icon: "error",
          title: "Error fetching data",
          text: "Could not load van applications.",
        });
      }
    };

    fetchVans();
  }, []);

  // Handle approve or reject
  const handleStatusUpdate = async (
    action: "approve" | "reject",
    id: string,
    reason?: string
  ) => {
    const van = vans.find((v) => v.id === id);

    if (!van) return;

    // Prevent duplicate approvals/rejections
    if (van.status === "Approved" && action === "approve") {
      Swal.fire({
        icon: "info",
        title: "Already Approved",
        text: "This van has already been approved.",
      });
      return;
    }

    if (van.status === "Rejected" && action === "reject") {
      Swal.fire({
        icon: "info",
        title: "Already Rejected",
        text: "This van has already been rejected.",
      });
      return;
    }

    // Confirm action
    const { isConfirmed } = await Swal.fire({
      title: `Confirm ${action === "approve" ? "Approval" : "Rejection"}`,
      text:
        action === "approve"
          ? "Do you want to approve this van application?"
          : "Do you want to reject this van application?",
      icon: action === "approve" ? "success" : "warning",
      showCancelButton: true,
      confirmButtonColor: action === "approve" ? "#22c55e" : "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${action}`,
    });

    if (!isConfirmed) return;

    try {
      const response = await fetch(`/api/admin/applications/vans/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vanID: id, reason }),
      });

      if (!response.ok) throw new Error("Request failed");

      // Update UI instantly
      setVans((prev) =>
        prev.map((v) =>
          v.id === id
            ? { ...v, status: action === "approve" ? "Approved" : "Rejected" }
            : v
        )
      );

      Swal.fire({
        icon: "success",
        title: `Van ${action === "approve" ? "Approved" : "Rejected"}`,
        text: `The van has been successfully ${action}ed.`,
      });

      setSelectedVan(null);
      setShowRejectionModal(false);
    } catch (err) {
      console.error(`Error ${action}ing van:`, err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to ${action} van. Please try again.`,
      });
    }
  };

  return (
    <>
      <CustomTable
        columns={[
          { key: "registrationNumber", label: "Reg. Number" },
          { key: "licensePlateNumber", label: "Plate Number" },
          { key: "makeAndModel", label: "Model" },
          { key: "seatingCapacity", label: "Seats" },
          { key: "createdAt", label: "Date" },
          { key: "status", label: "Status" },
        ]}
        data={vans}
        actions={[
          {
            type: "custom",
            label: "View",
            icon: <FileText size={16} color="blue" />,
            onClick: (row) => setSelectedVan(row as VanApplication),
          },
          {
            type: "custom",
            label: "Approve",
            icon: <FileCheck size={16} color="green" />,
            onClick: (row) =>
              handleStatusUpdate("approve", (row as VanApplication).id),
          },
          {
            type: "custom",
            label: "Reject",
            icon: <FileX size={16} color="red" />,
            onClick: (row) => {
              const van = row as VanApplication;
              if (van.status === "Rejected") {
                Swal.fire({
                  icon: "info",
                  title: "Already Rejected",
                  text: "This van application has already been rejected.",
                });
                return;
              }
              setSelectedVan(van);
              setShowRejectionModal(true);
            },
          },
        ]}
      />

      {/* View modal */}
      {selectedVan && !showRejectionModal && (
        <ViewVanApplication
          van={selectedVan}
          onApprove={() => handleStatusUpdate("approve", selectedVan.id)}
          onReject={() => setShowRejectionModal(true)}
          onClose={() => setSelectedVan(null)}
        />
      )}

      {/* Rejection reason modal */}
      {showRejectionModal && selectedVan && (
        <RejectionReasonModal
          open={showRejectionModal}
          onClose={() => {
            setShowRejectionModal(false);
            setSelectedVan(null);
          }}
          onConfirm={(reason) => {
            handleStatusUpdate("reject", selectedVan.id, reason);
          }}
          context="van"
        />
      )}
    </>
  );
}
