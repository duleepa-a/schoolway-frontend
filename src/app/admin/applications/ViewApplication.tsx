"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  XCircle,
  User,
  FileText,
  Phone,
  Mail,
  Shield,
  X,
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
        className="flex items-center gap-2 px-4 py-3 text-[#0099cc] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-transparent hover:border-[#0099cc]"
        aria-label={`Open ${label} in new tab`}
      >
        {icon}
        <span className="font-medium">{label}</span>
      </a>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-7">
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-100"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Sidebar - Styled as cards like your reference */}
          <aside className="col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center mb-2">
              <div className="flex flex-col items-center">
                {application.profilePicture ? (
                  <img
                    src={application.profilePicture}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M12 8v4'%3E%3C/path%3E%3Ccircle cx='12' cy='16' r='1'%3E%3C/circle%3E%3C/svg%3E";
                    }}
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-4 border-gray-50">
                    <User size={32} />
                  </div>
                )}
                <h2 className="mt-4 text-xl font-bold text-gray-800">
                  {application.name || "Unknown"}
                </h2>
                <p className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full mt-1">
                  Driver Applicant
                </p>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 mb-2">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Phone className="w-4 h-4 text-[#0099cc]" />
                </div>
                Contact Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-[#0099cc]" />
                  <span>{application.mobile || "-"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-[#0099cc]" />
                  <span className="break-all">{application.email || "-"}</span>
                </div>
              </div>
            </div>
            {/* Details Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                Driver Details
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">
                    NIC Number
                  </p>
                  <p className="font-medium text-gray-800">
                    {application.nic || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400 mb-1">
                    Started Driving
                  </p>
                  <p className="font-medium text-gray-800">
                    {application.date || "-"}
                  </p>
                </div>
                {application.languages && application.languages.length > 0 && (
                  <div>
                    <p className="text-xs uppercase text-gray-400 mb-1">
                      Languages
                    </p>
                    <p className="font-medium text-gray-800">
                      {(application.languages || []).join(", ") || "-"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-span-2">
            {/* Tabs - Styled like your reference */}
            <div className="flex gap-8 border-b border-gray-200 mb-6 text-base">
              <button
                onClick={() => setTab("about")}
                className={`pb-4 font-medium transition-colors ${
                  tab === "about"
                    ? "border-b-2 border-[#0099cc] text-[#0099cc]"
                    : "text-gray-500 hover:text-[#0099cc]"
                }`}
              >
                About Driver
              </button>
              <button
                onClick={() => setTab("documents")}
                className={`pb-4 font-medium transition-colors ${
                  tab === "documents"
                    ? "border-b-2 border-[#0099cc] text-[#0099cc]"
                    : "text-gray-500 hover:text-[#0099cc]"
                }`}
              >
                Documents
              </button>
            </div>

            {tab === "about" && (
              <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    Profile Summary
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {application.bio || "No profile summary provided."}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-xs uppercase text-gray-400 mb-2">
                          License ID
                        </h5>
                        <p className="font-semibold text-gray-800 text-xs">
                          {application.drivingLicense || "-"}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-xs uppercase text-gray-400 mb-2">
                          Languages
                        </h5>
                        <p className="font-semibold text-gray-800">
                          {(application.languages || []).join(", ") || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-xs uppercase text-gray-400 mb-2">
                          License Expiry
                        </h5>
                        <p className="font-semibold text-gray-800 text-xs">
                          {application.licenseExpiry || "-"}
                        </p>
                      </div>
                      <div>
                        <h5 className="text-xs uppercase text-gray-400 mb-2">
                          Experience
                        </h5>
                        <p className="font-semibold text-gray-800 text-xs">
                          {application.date ? `Since ${application.date}` : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "documents" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FileText className="w-4 h-4 text-orange-600" />
                    </div>
                    Application Documents
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {renderDocumentLink(
                      application.policeReportDocument ||
                        application.policeReport,
                      "Police Report",
                      <FileText size={18} />
                    )}
                    {renderDocumentLink(
                      application.licenseFront,
                      "License Front",
                      <FileText size={18} />
                    )}
                    {renderDocumentLink(
                      application.licenseBack,
                      "License Back",
                      <FileText size={18} />
                    )}
                    {renderDocumentLink(
                      application.medicalReportDocument ||
                        application.medicalReport,
                      "Medical Report",
                      <FileText size={18} />
                    )}
                  </div>

                  {!(
                    application.policeReportDocument ||
                    application.licenseFront ||
                    application.licenseBack ||
                    application.medicalReportDocument
                  ) && (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-xs">
                        No documents uploaded
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        This applicant hasn't uploaded any documents yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Action Buttons - Styled like your reference buttons */}
        <div className="sticky bottom-0 left-0 bg-white py-4 px-6 border-t border-gray-100 rounded-b-xl">
          <div className="flex justify-end gap-3">
            <button
              onClick={onReject}
              className="flex items-center gap-2 px-5 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-transparent hover:border-red-200 font-medium"
              aria-label="Reject application"
            >
              <XCircle size={18} />
              Reject Application
            </button>
            <button
              onClick={onApprove}
              className="flex items-center gap-2 px-5 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow-md"
              aria-label="Approve application"
            >
              <CheckCircle size={18} />
              Approve Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
