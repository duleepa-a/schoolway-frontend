"use client";

import { useState, useEffect, useMemo } from "react";
import SearchFilter from "@/app/dashboardComponents/SearchFilter";
import DataTable from "@/app/dashboardComponents/CustomTable";
import {
  FileText,
  FileCheck,
  Mail,
  User,
  Calendar,
  Tag,
  MessageSquare,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

const columns = [
  { key: "FullName", label: "Full Name" },
  { key: "Subject", label: "Subject" },
  { key: "Role", label: "Role" },
  { key: "Type", label: "Request Type" },
  { key: "Date", label: "Date" },
  { key: "Status", label: "Status" },
];

interface Inquiry {
  id: number;
  FullName: string;
  Subject: string;
  Status: string;
  Role: string;
  Type: string;
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
  const [modalType, setModalType] = useState<"view" | "reply" | null>(null);

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

        type ContactUsRow = {
          id: number;
          name: string;
          subject: string;
          message: string;
          email: string;
          userType: string;
          Type: string;
          status: string;
          createdAt: string;
        };

        const mapped: Inquiry[] = (data as ContactUsRow[]).map((d) => ({
          id: d.id,
          FullName: d.name,
          Subject: d.subject,
          Status: d.status,
          Role:
            d.userType.charAt(0).toUpperCase() +
            d.userType.slice(1).toLowerCase(),
          Type: d.Type
            ? d.Type.split("_")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")
            : "",
          Email: d.email,
          Date: new Date(d.createdAt).toISOString().split("T")[0],
          Message: d.message,
        }));
        setInquiriesData(mapped);
      } catch (err) {
        console.error(err);
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
        inquiry.Subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.Type.toLowerCase().includes(searchTerm.toLowerCase());

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
    setReplyBody(`Hello ${row.FullName},\n\nThank you for contacting us. `);
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

      setInquiriesData((prev) =>
        prev.map((i) =>
          i.id === selectedInquiry.id ? { ...i, Status: "Reviewed" } : i
        )
      );

      setModalType(null);
      setSelectedInquiry(null);
      setReplySubject("");
      setReplyBody("");

      Swal.fire({
        icon: "success",
        title: "Reply Sent",
        text: "Your reply was sent and the inquiry has been marked as reviewed.",
        confirmButtonColor: "#0099cc",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong while sending the reply. Please try again.",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedRole("");
    setSelectedStatus("");
  };

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

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5">
        {/* Search and Filter */}

        <SearchFilter
          onSearchChange={setSearchTerm}
          onRoleChange={setSelectedRole}
          onStatusChange={setSelectedStatus}
          onDateChange={() => {}}
          onClearFilters={handleClearFilters}
          config={{
            SearchBarCss: "min-w-[350px] sm:min-w-[400px]",
            showAddButton: false,
            searchPlaceholder: "Search by name, subject, or request type...",
            addButtonText: "",
            statusOptions: [
              { value: "", label: "All Status" },
              { value: "Pending", label: "Pending" },
              { value: "Reviewed", label: "Reviewed" },
            ],
            roleOptions: [
              { value: "", label: "All Roles" },
              { value: "Driver", label: "Driver" },
              { value: "Parent", label: "Parent" },
              { value: "Guest", label: "Guest" },
              { value: "Van Owner", label: "Van Owner" },
            ],
          }}
        />
      </div>

      {/* Data Table Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
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
      </div>

      {/* View Inquiry Modal */}
      {selectedInquiry && modalType === "view" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-100">
            {/* Close Button */}
            <button
              onClick={() => {
                setModalType(null);
                setSelectedInquiry(null);
              }}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-[#0099cc]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Inquiry Details
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Complete inquiry information and message
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Inquiry Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <User className="w-4 h-4 text-[#0099cc]" />
                    <h4 className="font-semibold text-gray-800">
                      Contact Information
                    </h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium text-gray-800">
                        {selectedInquiry.FullName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium text-gray-800">
                        {selectedInquiry.Email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Role:</span>
                      <span className="font-medium text-gray-800">
                        {selectedInquiry.Role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <Tag className="w-4 h-4 text-[#0099cc]" />
                    <h4 className="font-semibold text-gray-800">
                      Request Details
                    </h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date:</span>
                      <span className="font-medium text-gray-800">
                        {selectedInquiry.Date}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium text-gray-800">
                        {selectedInquiry.Type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${selectedInquiry.Status}`}
                      >
                        {selectedInquiry.Status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#0099cc]" />
                  Subject
                </h4>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-gray-800">
                  {selectedInquiry.Subject || "No subject provided"}
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#0099cc]" />
                  Message
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-gray-800 whitespace-pre-line">
                  {selectedInquiry.Message || "No message provided"}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 left-0 bg-white py-4 px-6 border-t border-gray-100 rounded-b-xl">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setModalType(null);
                    setSelectedInquiry(null);
                  }}
                  className="flex items-center gap-2 px-5 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setModalType("reply");
                    setReplySubject(`Re: ${selectedInquiry.Subject}`);
                    setReplyBody(
                      `Hello ${selectedInquiry.FullName},\n\nThank you for contacting us. `
                    );
                  }}
                  className="flex items-center gap-2 px-5 py-2 text-white bg-[#0099cc] rounded-lg hover:bg-[#007bbd] transition-colors font-medium shadow-sm hover:shadow-md"
                >
                  <Mail className="w-4 h-4" />
                  Reply to Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {selectedInquiry && modalType === "reply" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-100">
            {/* Close Button */}
            <button
              onClick={() => {
                setModalType(null);
                setSelectedInquiry(null);
                setReplySubject("");
                setReplyBody("");
              }}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Send Reply
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Compose and send response to inquiry
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Recipient Info */}
              <div className="bg-blue-50 rounded-lg p-4 border border-[#0099cc] mb-6">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-[#0099cc]" />
                  <div>
                    <p className="text-sm font-medium text-[#0099cc]">
                      Replying to
                    </p>
                    <p className="text-sm text-[#0099cc]">
                      {selectedInquiry.FullName} &lt;{selectedInquiry.Email}&gt;
                    </p>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0099cc] focus:border-transparent transition-all"
                  placeholder="Enter email subject..."
                />
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={8}
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0099cc] focus:border-transparent transition-all resize-none"
                  placeholder="Type your response message here..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 left-0 bg-white py-4 px-6 border-t border-gray-100 rounded-b-xl">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setModalType(null);
                    setSelectedInquiry(null);
                    setReplySubject("");
                    setReplyBody("");
                  }}
                  className="flex items-center gap-2 px-5 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={sendReply}
                  className="flex items-center gap-2 px-5 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow-md"
                >
                  <Mail className="w-4 h-4" />
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesPageContent;
