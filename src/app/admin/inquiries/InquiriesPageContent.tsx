"use client";

import { useState, useEffect, useMemo } from "react";
import SearchFilter from "@/app/dashboardComponents/SearchFilter";
import DataTable from "@/app/dashboardComponents/CustomTable";
import { inquiriesData as dummyData } from "../../../../public/dummy_data/inquiriesData";
import { FileText, FileCheck } from "lucide-react";

const columns = [
  { key: "FullName", label: "Full Name" },
  { key: "Subject", label: "Subject" },
  { key: "Status", label: "Status" },
  { key: "Role", label: "Role" },
  { key: "Date", label: "Date" },
];

interface Inquiry {
  id: number;
  FullName: string;
  Subject: string;
  Status: string;
  Role: string;
  Date: string;
  Message: string;
  Email: string;
}

const InquiriesPageContent = () => {
  const [inquiriesData, setInquiriesData] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [modalType, setModalType] = useState<"view" | "reply" | null>(null); // to handle the modal

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/Inquiries");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        console.log("Fetched inquiries:", data);
        // Map Prisma ContactUs to Inquiry shape
        type ContactUsRow = {
          id: number;
          name: string;
          subject: string;
          message: string;
          email: string;
          userType: string;
          status: string;
          createdAt: string;
        };
        const mapped: Inquiry[] = (data as ContactUsRow[]).map((d) => ({
          id: d.id,
          FullName: d.name,
          Subject: d.subject,
          Status: d.status,
          Role: d.userType,
          Email: d.email,
          Date: new Date(d.createdAt).toISOString().split("T")[0],
          Message: d.message,
        }));
        setInquiriesData(mapped);
        // console.log("Mapped inquiries:", mapped);
      } catch (err) {
        console.error(err);
        // fallback to dummy
        setInquiriesData(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const filteredData = useMemo(() => {
    return inquiriesData.filter((inquiry) => {
      const matchesSearch =
        searchTerm === "" ||
        inquiry.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.Subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole === "" || inquiry.Role === selectedRole;
      const matchesStatus =
        selectedStatus === "" || inquiry.Status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, selectedRole, selectedStatus, inquiriesData]);

  const handleView = (row: Inquiry) => {
    setSelectedInquiry(row);
    setModalType("view");
  };

  const handleResolve = (row: Inquiry) => {
    setSelectedInquiry(row);
    setReplySubject(`Re: ${row.Subject}`);
    setReplyBody(`Hello ${row.FullName},\n\n`);
    setModalType("reply");
  };

  const sendReply = async () => {
    if (!selectedInquiry) return;
    try {
      const res = await fetch("/api/admin/Inquiries/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          InquiryID: selectedInquiry.id,
          subject: replySubject,
          body: replyBody,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      // update local status
      setInquiriesData((prev) =>
        prev.map((i) =>
          i.id === selectedInquiry.id ? { ...i, Status: "Reviewed" } : i
        )
      );
      setModalType(null);
      setSelectedInquiry(null);
      setReplySubject("");
      setReplyBody("");

      alert("Reply sent and inquiry marked as Reviewed");
    } catch (err) {
      console.error(err);
      alert("Failed to send reply");
    }
    setModalType(null);
    setSelectedInquiry(null);
    setReplySubject("");
    setReplyBody("");
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedRole("");
    setSelectedStatus("");
  };

  return (
    <div className="p-4 space-y-4">
      <SearchFilter
        onSearchChange={setSearchTerm}
        onRoleChange={setSelectedRole}
        onStatusChange={setSelectedStatus}
        onDateChange={() => {}}
        onClearFilters={handleClearFilters}
        config={{
          showAddButton: false,
          searchPlaceholder: "Search by name or subject",
          addButtonText: "",
          statusOptions: [
            { value: "", label: "Status" },
            { value: "Pending", label: "Pending" },
            { value: "Reviewed", label: "Reviewed" },
          ],
          roleOptions: [
            { value: "", label: "Role" },
            { value: "Driver", label: "Driver" },
            { value: "Parent", label: "Parent" },
            { value: "Guest", label: "Guest" },
            { value: "Van Owner", label: "Van Owner" },
          ],
        }}
      />

      {loading ? (
        <div className="text-center py-10">Loading inquiries...</div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          actions={[
            {
              type: "custom",
              icon: <FileText size={16} color="blue" />,
              label: "View Inquiry",
              onClick: handleView,
            },
            {
              type: "custom",
              icon: <FileCheck size={16} color="green" />,
              label: "Resolve",
              onClick: handleResolve,
            },
          ]}
        />
      )}

      {/* View Inquiry Modal */}
      {selectedInquiry && modalType === "view" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            onClick={() => {
              setModalType(null);
              setSelectedInquiry(null);
            }}
          />

          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-3xl bg-white rounded-lg shadow-xl p-10 animate-slideUp">
            {/* Close Button (optional) */}
            <button
              onClick={() => {
                setModalType(null);
                setSelectedInquiry(null);
                setReplySubject("");
                setReplyBody("");
              }}
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-[#0099cc] font-bold"
              aria-label="Close"
            >
              &times;
            </button>

            {/* Header */}
            <h3 className="text-2xl font-semibold text-[#6a6c6c] mb-6 flex items-center gap-2">
              <span className="text-[#0099cc]">📩</span> Inquiry Details
            </h3>

            {/* Inquiry Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm border-b pb-6 mb-6">
              <div className="flex justify-between">
                <span className="text-[#0099cc] font-bold font-medium">
                  Name:
                </span>
                <span className="font-semibold text-gray-900 text-right">
                  {selectedInquiry.FullName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0099cc] font-bold font-medium">
                  Email:
                </span>
                <span className="font-semibold text-gray-900 text-right">
                  {selectedInquiry.Email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0099cc] font-bold font-medium">
                  Role:
                </span>
                <span className="font-semibold text-gray-900 text-right">
                  {selectedInquiry.Role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0099cc] font-bold font-medium">
                  Date:
                </span>
                <span className="font-semibold text-gray-900 text-right">
                  {selectedInquiry.Date}
                </span>
              </div>
            </div>
            {/* Subject */}
            <div className="mb-2">
              <h4 className="text-[#0099cc] font-bold font-medium mb-2">
                Subject
              </h4>
              <div className="border rounded p-3 bg-gray-50 text-gray-800 text-sm whitespace-pre-line">
                {selectedInquiry.Subject || "No subject provided."}
              </div>
            </div>
            {/* Message */}
            <div className="mb-6">
              <h4 className="text-[#0099cc] font-bold font-medium mb-2">
                Message
              </h4>
              <div className="border rounded p-4 bg-gray-50 text-gray-800 text-sm whitespace-pre-line">
                {selectedInquiry.Message || "No message provided."}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setModalType(null);
                  setSelectedInquiry(null);
                  setReplySubject("");
                  setReplyBody("");
                }}
                className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setModalType("reply");
                  setReplySubject(`Re: ${selectedInquiry.Subject}`);
                  setReplyBody(`Hello ${selectedInquiry.FullName},\n\n`);
                }}
                className="px-5 py-2 bg-[#0099cc] hover:bg-[#007aaf] text-white rounded-md font-semibold transition"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {selectedInquiry && modalType === "reply" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            onClick={() => {
              setModalType(null);
              setSelectedInquiry(null);
              setReplySubject("");
              setReplyBody("");
            }}
          />

          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-3xl bg-white rounded-lg shadow-xl p-8 animate-slideUp">
            {/* Close Button */}
            <button
              onClick={() => {
                setModalType(null);
                setSelectedInquiry(null);
              }}
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-[#0099cc] font-bold"
              aria-label="Close"
            >
              &times;
            </button>

            {/* Header */}
            <h3 className="text-2xl font-semibold text-[#6a6c6c] mb-6">
              Reply Email to Inquiry
            </h3>

            {/* Recipient */}
            <p className="text-sm mb-4 text-gray-700">
              <span className="font-bold font-medium text-[#0099cc]">To:</span>{" "}
              {selectedInquiry.Email}
            </p>

            {/* Subject */}
            <div className="mb-4">
              <label className="block text-sm font-bold font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                className="w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0099cc] transition"
              />
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-sm font-bold font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                rows={6}
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                className="w-full border rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0099cc] transition"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setModalType(null);
                  setSelectedInquiry(null);
                  setReplySubject("");
                  setReplyBody("");
                }}
                className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                className="px-5 py-2 bg-[#0099cc] hover:bg-[#007aaf] text-white rounded-md font-semibold transition"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesPageContent;
