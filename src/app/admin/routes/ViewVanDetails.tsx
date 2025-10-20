"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  X,
  MapPin,
  FileText,
  Truck,
  Calendar,
  Car,
  Building,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { VanDetails } from "./types";

type ViewVanDetailsProps = {
  van: VanDetails;
  onClose: () => void;
};

export default function ViewVanDetails({ van, onClose }: ViewVanDetailsProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"about" | "documents">("about");

  // Close modal when clicking outside
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
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
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Sidebar - Styled as cards */}
          <aside className="col-span-1 space-y-6">
            {/* Van Service Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
              <div className="flex flex-col items-center">
                <img
                  src={van.photoUrl || "/images/user__.png"}
                  alt={van.name}
                  className="w-35 h-35 rounded-full  border border-[#0099cc]"
                />

                <h2 className="mt-4 text-xl font-bold text-gray-800">
                  {van.serviceName}
                </h2>
                <p className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full mt-1">
                  Van Service
                </p>
                <div
                  className={`mt-3 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    van.isApproved
                  )}`}
                >
                  {van.isApproved?.charAt(0).toUpperCase() +
                    van.isApproved?.slice(1) || "Pending"}
                </div>
              </div>
            </div>

            {/* Owner Information Card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                Owner Information
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <User className="w-4 h-4 text-[#0099cc]" />
                  <span className="font-medium">{van.ownerName}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-4 h-4 text-[#0099cc]" />
                  <span className="break-all">{van.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-4 h-4 text-[#0099cc]" />
                  <span>{van.contact}</span>
                </div>
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
                Vehicle Details
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
                {/* Basic Information Card */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Car className="w-4 h-4 text-[#0099cc]" />
                    </div>
                    Vehicle Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Detail
                        label="Registration Number"
                        value={van.registrationNumber}
                      />
                      <Detail
                        label="License Plate"
                        value={van.licensePlateNumber}
                      />
                      <Detail label="Make & Model" value={van.makeAndModel} />
                    </div>
                    <div className="space-y-4">
                      <Detail
                        label="Seating Capacity"
                        value={String(van.seatingCapacity)}
                      />
                      <Detail
                        label="A/C Condition"
                        value={van.acCondition ? "Available" : "Not Available"}
                      />
                      <Detail
                        label="Registration Date"
                        value={
                          van.createdAt
                            ? new Date(van.createdAt).toLocaleDateString()
                            : "N/A"
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Route Information Card */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    Route Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Detail label="Route Start" value={van.routeStart} />
                    <Detail label="Route End" value={van.routeEnd} />
                  </div>
                  {van.address && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[#0099cc] mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{van.address}</p>
                      </div>
                    </div>
                  )}
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
                    Vehicle Documents
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <DetailLink label="R Book Document" url={van.rBookUrl} />
                    <DetailLink
                      label="Revenue License"
                      url={van.revenueLicenseUrl}
                    />
                    <DetailLink
                      label="Fitness Certificate"
                      url={van.fitnessCertificateUrl}
                    />
                    <DetailLink
                      label="Insurance Certificate"
                      url={van.insuranceCertificateUrl}
                    />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 left-0 bg-white py-4 px-6 border-t border-gray-100 rounded-b-xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 font-medium"
            >
              <X size={18} />
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-gray-400 mb-1">{label}</p>
      <p className="font-medium text-gray-800 text-sm">
        {value || "Not Provided"}
      </p>
    </div>
  );
}

function DetailLink({ label, url }: { label: string; url?: string }) {
  const hasUrl = Boolean(url);
  return (
    <div>
      <p className="text-xs uppercase text-gray-400 mb-2">{label}</p>
      {hasUrl ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-3 px-4 py-3 text-[#0099cc] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-transparent hover:border-blue-200"
        >
          <FileText size={18} />
          <span className="font-medium">View Document</span>
        </a>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          <FileText size={18} />
          <span className="font-medium">Not Uploaded</span>
        </div>
      )}
    </div>
  );
}
