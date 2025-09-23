"use client";
import { useEffect, useState } from "react";
import CustomTable from "@/app/dashboardComponents/CustomTable";
import ViewApplication from "./ViewApplication";
import Swal from "sweetalert2";
import { FileText, FileCheck, FileX } from "lucide-react";
import { ApplicationData } from "./types";
import { formatDriverApplication } from "./utils";
import RejectionReasonModal from "./RejectionReasonModal";

export default function DriverTab() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [selectedApp, setSelectedApp] = useState<ApplicationData | null>(null);

  // Shared rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectUserId, setRejectUserId] = useState<string | null>(null);
  const [rejectInitialReason, setRejectInitialReason] = useState<string>("");
  //fetch driver details
  useEffect(() => {
    const fetchDrivers = async () => {
      const res = await fetch("/api/admin/applications/drivers");
      const data = await res.json();
      //console.log(data);
      const formatted = data.map(formatDriverApplication); //format data for viewing
      setApplications(formatted);
    };
    fetchDrivers();
  }, []);

  // Common status update function with confirmation wit swal
  const handleStatusUpdate = async (
    action: "approve" | "reject",
    userId: string,
    reason?: string
  ) => {
    const { isConfirmed } = await Swal.fire({
      title: `Are you sure you want to ${action} this driver?`,
      icon: action === "approve" ? "success" : "warning",
      showCancelButton: true,
      confirmButtonColor: action === "approve" ? "#22c55e" : "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${action}`,
    });

    if (!isConfirmed) return;
    await fetch(`/api/admin/applications/drivers/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        ...(action === "reject" ? { reason } : {}),
      }),
    });

    setSelectedApp(null);
    setApplications((prev) => prev.filter((a) => a.id !== userId));
    setRejectModalOpen(false);
    setRejectUserId(null);
    setRejectInitialReason("");
    window.location.reload();
  };

  // Open rejection modal from table reject button
  const onRejectClick = (userId: string) => {
    setRejectUserId(userId);
    setRejectInitialReason("");
    setRejectModalOpen(true);
  };

  // Open rejection modal from ViewApplication reject button (passes initial reason optional)
  const onViewAppRejectClick = (userId: string, initialReason?: string) => {
    setRejectUserId(userId);
    setRejectInitialReason(initialReason || "");
    setRejectModalOpen(true);
  };

  // Confirm rejection from modal
  const confirmReject = (reason?: string) => {
    if (rejectUserId) {
      handleStatusUpdate("reject", rejectUserId, reason);
    }
  };

  // Cancel rejection modal
  const cancelReject = () => {
    setRejectModalOpen(false);
    setRejectUserId(null);
    setRejectInitialReason("");
  };

  return (
    <>
      <CustomTable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "nic", label: "NIC" },
          { key: "date", label: "Date" },
          { key: "status", label: "Status" },
        ]}
        data={applications}
        actions={[
          {
            type: "custom",
            label: "View",
            icon: <FileText size={16} color="blue" />,
            onClick: (row) => setSelectedApp(row as ApplicationData),
          },
          {
            type: "custom",
            label: "Approve",
            icon: <FileCheck size={16} color="green" />,
            onClick: (row) =>
              handleStatusUpdate("approve", (row as ApplicationData).id),
          },
          {
            type: "custom",
            label: "Reject",
            icon: <FileX size={16} color="red" />,
            onClick: (row) => onRejectClick((row as ApplicationData).id),
          },
        ]}
      />

      {selectedApp && (
        <ViewApplication
          application={selectedApp}
          onApprove={() => handleStatusUpdate("approve", selectedApp.id)}
          onReject={() => onViewAppRejectClick(selectedApp.id)}
          onClose={() => setSelectedApp(null)}
        />
      )}

      <RejectionReasonModal
        open={rejectModalOpen}
        onClose={cancelReject}
        onConfirm={confirmReject}
        initialReason={rejectInitialReason}
        context="driver"
      />
    </>
  );
}
