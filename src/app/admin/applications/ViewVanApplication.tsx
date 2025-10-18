"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  User,
  FileText,
  Phone,
  Mail,
} from "lucide-react";
import { VanApplication } from "./types";

interface Props {
  van: VanApplication;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

export default function ViewVanApplication({
  van,
  onApprove,
  onReject,
  onClose,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"about" | "documents">("about");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Helper to safely render document link
  const renderDocumentLink = (
    url: string | undefined | null,
    label: string,
    icon: React.ReactNode
  ) => {
    if (!url) return null;

    // Ensure URL is absolute or has protocol
    const safeUrl = url.startsWith("http") ? url : `https://${url}`;

    return (
      <a
        href={safeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[#0099cc] hover:underline hover:text-[#007aa3] transition-colors p-2 rounded border border-transparent hover:border-[#0099cc]/30"
        aria-label={`Open ${label} in new tab`}
      >
        {icon} {label}
      </a>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl p-6"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 text-gray-500 hover:text-[#0099cc] text-2xl focus:outline-none"
        >
          ✖
        </button>

        <div className="grid grid-cols-3 gap-8 p-6">
          {/* Left Panel */}
          <aside className="col-span-1 border-r border-gray-200 pr-6">
            {/* Van Photo */}
            <div className="flex flex-col items-center">
              {van.photoUrl ? (
                <img
                  src={van.photoUrl}
                  alt="Van photo"
                  className="h-36 w-36 rounded-full object-cover border shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='144' height='144' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M12 8v4'%3E%3C/path%3E%3Ccircle cx='12' cy='16' r='1'%3E%3C/circle%3E%3C/svg%3E";
                  }}
                />
              ) : (
                <div className="h-36 w-36 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                  <User size={40} />
                </div>
              )}
              <h2 className="mt-4 text-lg font-bold text-gray-800">
                {van.makeAndModel || "Unknown Model"}
              </h2>
              <p className="text-sm text-gray-500">Van Applicant</p>
            </div>

            {/* Quick Info */}
            <div className="mt-6 space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1 text-[#0099cc]">
                  Reg. Number
                </h4>
                <p className="text-[#0099cc]">
                  {van.registrationNumber || "-"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">License Plate</h4>
                <p className="text-[#0099cc]">
                  {van.licensePlateNumber || "-"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Seating Capacity</h4>
                <p>{van.seatingCapacity || "-"}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">AC Available</h4>
                <p>{van.acCondition ? "Yes" : "No"}</p>
              </div>
            </div>
          </aside>

          {/* Right Panel */}
          <main className="col-span-2 pl-4">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-6 text-base">
              <button
                onClick={() => setTab("about")}
                className={`pb-3 font-medium transition-colors ${
                  tab === "about"
                    ? "border-b-3 border-[#0099cc] text-[#0099cc]"
                    : "text-gray-500 hover:text-[#0099cc]"
                }`}
                aria-selected={tab === "about"}
              >
                About
              </button>
              <button
                onClick={() => setTab("documents")}
                className={`pb-3 font-medium transition-colors ${
                  tab === "documents"
                    ? "border-b-3 border-[#0099cc] text-[#0099cc]"
                    : "text-gray-500 hover:text-[#0099cc]"
                }`}
                aria-selected={tab === "documents"}
              >
                Documents
              </button>
            </div>

            {/* About Tab */}
            {tab === "about" && (
              <div className="space-y-6 text-sm">
                {/* Owner Info */}
                <div>
                  <h4 className="font-semibold mb-2">Owner</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-[#0099cc]" />{" "}
                      {van.ownerName || "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-[#0099cc]" />{" "}
                      {van.ownerEmail || "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-[#0099cc]" />{" "}
                      {van.ownerMobile || "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#0099cc]" />{" "}
                      {van.ownerDistrict || "-"}
                    </div>
                    <p>{van.address || "-"}</p>
                  </div>
                </div>

                {/* Service Info */}
                <div>
                  <h4 className="font-semibold mb-2">Service</h4>
                  <p>
                    <span className="font-semibold">Name:</span>{" "}
                    {van.serviceName || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Reg No:</span>{" "}
                    {van.serviceRegNumber || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Contact:</span>{" "}
                    {van.serviceContact || "-"}
                  </p>
                  {renderDocumentLink(
                    van.businessDocument,
                    "Business Document",
                    <FileText size={16} />
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Submitted</h4>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#0099cc]" />{" "}
                    {van.createdAt
                      ? new Date(van.createdAt).toLocaleDateString()
                      : "-"}
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {tab === "documents" && (
              <div className="space-y-5 text-sm mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderDocumentLink(
                    van.rBookUrl,
                    "R Book",
                    <FileText size={16} />
                  )}
                  {renderDocumentLink(
                    van.revenueLicenseUrl,
                    "Revenue License",
                    <FileText size={16} />
                  )}
                  {renderDocumentLink(
                    van.fitnessCertificateUrl,
                    "Fitness Certificate",
                    <FileText size={16} />
                  )}
                  {renderDocumentLink(
                    van.insuranceCertificateUrl,
                    "Insurance Certificate",
                    <FileText size={16} />
                  )}
                </div>

                {/* Fallback message if no documents */}
                {!van.rBookUrl &&
                  !van.revenueLicenseUrl &&
                  !van.fitnessCertificateUrl &&
                  !van.insuranceCertificateUrl && (
                    <p className="text-gray-500 italic py-4 text-center">
                      No documents uploaded yet.
                    </p>
                  )}
              </div>
            )}
          </main>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 left-0 -mx-6 -mb-6 flex justify-end gap-3 bg-white py-4 px-6 border-t border-gray-200">
          <button
            onClick={onReject}
            className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-600 rounded-sm hover:bg-red-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Reject application"
          >
            <XCircle size={18} /> Reject
          </button>
          <button
            onClick={onApprove}
            className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 border border-green-600 rounded-sm hover:bg-green-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Approve application"
          >
            <CheckCircle size={18} /> Approve
          </button>
        </div>
      </div>
    </div>
  );
}
