"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  XCircle,
  User,
  FileText,
  Phone,
  Mail,
} from "lucide-react";
import { ApplicationData } from "./types";

interface Props {
  application: ApplicationData;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

export default function ViewApplication({
  application,
  onApprove,
  onReject,
  onClose,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"about" | "documents">("about");

  useEffect(() => {
    console.log("Application data:", application);
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

  const renderDocumentLink = (
    url: string | undefined | null,
    label: string,
    icon: React.ReactNode
  ) => {
    if (!url) return null;
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
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl p-6"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 text-gray-500 hover:text-[#0099cc] text-2xl focus:outline-none"
        >
          ✖
        </button>

        <div className="grid grid-cols-3 gap-8 p-6">
          <aside className="col-span-1 border-r border-gray-200 pr-6">
            <div className="flex flex-col items-center">
              {application.profilePicture ? (
                <img
                  src={application.profilePicture}
                  alt="Profile"
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
                {application.name || "Unknown"}
              </h2>
              <p className="text-sm text-gray-500">Driver Applicant</p>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1 text-[#0099cc]">Contact</h4>
                <p className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-[#0099cc]" />{" "}
                  {application.mobile || "-"}
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-[#0099cc]" />{" "}
                  {application.email || "-"}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">NIC</h4>
                <p className="text-[#0099cc]">{application.nic || "-"}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">Started Driving</h4>
                <p>{application.date || "-"}</p>
              </div>
            </div>
          </aside>

          <main className="col-span-2 pl-4">
            <div className="flex gap-6 border-b border-gray-200 mb-6 text-base">
              <button
                onClick={() => setTab("about")}
                className={`pb-3 font-medium transition-colors ${
                  tab === "about"
                    ? "border-b-3 border-[#0099cc] text-[#0099cc]"
                    : "text-gray-500 hover:text-[#0099cc]"
                }`}
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
              >
                Documents
              </button>
            </div>

            {tab === "about" && (
              <div className="space-y-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Profile</h4>
                  <p className="mb-2">{application.bio || "-"}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-xs uppercase text-gray-400">
                        License ID
                      </h5>
                      <p className="font-semibold">
                        {application.drivingLicense || "-"}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-xs uppercase text-gray-400">
                        License Expiry
                      </h5>
                      <p className="font-semibold">
                        {application.licenseExpiry || "-"}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-xs uppercase text-gray-400">
                        Languages
                      </h5>
                      <p>{(application.languages || []).join(", ") || "-"}</p>
                    </div>

                    {/* bank/account info not always available in ApplicationData type; omit if absent */}
                  </div>
                </div>
              </div>
            )}

            {tab === "documents" && (
              <div className="space-y-5 text-sm mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderDocumentLink(
                    application.policeReportDocument ||
                      application.policeReport,
                    "Police Report",
                    <FileText size={16} />
                  )}
                  {renderDocumentLink(
                    application.licenseFront,
                    "License Front",
                    <FileText size={16} />
                  )}
                  {renderDocumentLink(
                    application.licenseBack,
                    "License Back",
                    <FileText size={16} />
                  )}
                  {renderDocumentLink(
                    application.medicalReportDocument ||
                      application.medicalReport,
                    "Medical Report",
                    <FileText size={16} />
                  )}
                </div>

                {!(
                  application.policeReportDocument ||
                  application.licenseFront ||
                  application.licenseBack ||
                  application.medicalReportDocument
                ) && (
                  <p className="text-gray-500 italic py-4 text-center">
                    No documents uploaded yet.
                  </p>
                )}
              </div>
            )}
          </main>
        </div>

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
