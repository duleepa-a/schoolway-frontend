"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import { ApplicationData } from "./types";

interface ViewApplicationProps {
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
}: ViewApplicationProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"about" | "documents">("about");

  // Close on outside click
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl p-6 animate-slideUp"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-[#0099cc] text-2xl"
        >
          ✖
        </button>

        <div className="grid grid-cols-3 gap-8 p-10">
          {/* Left Panel */}
          <aside className="col-span-1 border-r dark:border-neutral-700 pr-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              {application.profilePicture ? (
                <img
                  src={application.profilePicture}
                  alt="Profile"
                  className="h-36 w-36 rounded-full object-cover border shadow-md"
                />
              ) : (
                <div className="h-36 w-36 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                  <User size={40} />
                </div>
              )}
              <h2 className="mt-4 text-lg font-bold text-gray-800 dark:text-gray-200">
                {application.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Driver Applicant
              </p>
            </div>

            {/* Quick Info */}
            <div className="mt-6 space-y-4 text-m">
              <div>
                <h4 className="font-semibold mb-1 text-[#0099cc]">
                  License No
                </h4>
                <p className="text-[#0099cc]">{application.drivingLicense}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Expiry</h4>
                <p className="text-[#0099cc]">
                  {new Date(application.licenseExpiry).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Types</h4>
                <p>{application.licenseType?.join(", ") || "N/A"}</p>
              </div>
            </div>
          </aside>

          {/* Right Panel */}
          <main className="col-span-2 pl-4">
            {/* Tabs */}
            <div className="flex gap-6 border-b  mb-4  dark:border-neutral-700 text-lg">
              <button
                onClick={() => setTab("about")}
                className={`pb-3 font-medium ${
                  tab === "about"
                    ? "border-b-3 border-[#0099cc] text-[#0099cc]"
                    : "text-gray-500 hover:text-[#0099cc]"
                }`}
              >
                About
              </button>
              <button
                onClick={() => setTab("documents")}
                className={`pb-3 font-medium ${
                  tab === "documents"
                    ? "border-b-3 border-[#0099cc] text-[#0099cc]"
                    : "text-gray-500 hover:text-[#171718]"
                }`}
              >
                Documents
              </button>
            </div>

            {/* About Tab */}
            {tab === "about" && (
              <div className="space-y-4 text-m mt-10">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-[#0099cc]" />{" "}
                  {application.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-[#0099cc]" />{" "}
                  {application.mobile}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#0099cc]" />{" "}
                  {application.address}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#0099cc]" />{" "}
                  {application.dob}
                </div>

                <div>
                  <h4 className="font-semibold mt-3">Bio</h4>
                  <p>{application.bio || "N/A"}</p>
                </div>

                <div>
                  <h4 className="font-semibold mt-3">Languages</h4>
                  <p>{application.languages?.join(", ") || "N/A"}</p>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {tab === "documents" && (
              <div className="space-y-5 text-m mt-10">
                {application.policeReportDocument && (
                  <a
                    href={application.policeReportDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#0099cc] hover:underline"
                  >
                    <FileText size={16} /> Police Report
                  </a>
                )}
                {application.medicalReport && (
                  <a
                    href={application.medicalReport}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#0099cc] hover:underline"
                  >
                    <FileText size={16} /> Medical Report
                  </a>
                )}
                <div className="grid grid-cols-2 gap-8 mt-8">
                  {application.licenseFront && (
                    <div>
                      <h4 className="font-semibold mb-6">License Front</h4>
                      <img
                        src={application.licenseFront}
                        alt="License Front"
                        className="h-42 w-full object-cover rounded-md border hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  {application.licenseBack && (
                    <div>
                      <h4 className="font-semibold mb-6">License Back</h4>
                      <img
                        src={application.licenseBack}
                        alt="License Back"
                        className="h-42 w-full object-cover rounded-md border hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
        <div className="sticky bottom-0 left-0 -mt-10 flex justify-end gap-3  bg-white py-2">
          <button
            onClick={onReject}
            className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-600 rounded-sm hover:bg-red-600 hover:text-white transition-colors"
          >
            <XCircle size={18} /> Reject
          </button>
          <button
            onClick={onApprove}
            className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 border border-green-600 rounded-sm hover:bg-green-600  hover:text-white transition-colors"
          >
            <CheckCircle size={18} /> Approve
          </button>
        </div>

        {/* Footer Buttons */}
      </div>
    </div>
  );
}
