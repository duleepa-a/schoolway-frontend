"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  X,
  MapPin,
  Mail,
  Phone,
  FileText,
  Truck,
  Calendar,
  User,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl p-6 animate-slideUp"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-[#0099cc] text-2xl"
        >
          ✖
        </button>

        {/* Layout Grid */}
        <div className="grid grid-cols-3 gap-8 p-10">
          {/* Left panel */}
          <aside className="col-span-1 border-r dark:border-neutral-700 pr-6">
            <div className="flex flex-col items-center">
              <div className="h-36 w-36 rounded-full bg-[#0099cc]/10 flex items-center justify-center text-[#0099cc] border shadow-md">
                <Truck size={56} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-gray-800 dark:text-gray-200">
                {van.serviceName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Van Service
              </p>
            </div>

            {/* Quick Info */}
            <div className="mt-6 space-y-4 text-m">
              <div>
                <h4 className="font-semibold mb-1 text-[#0099cc]">
                  Owner Name
                </h4>
                <p>{van.ownerName}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Email</h4>
                <p className="text-[#0099cc]">{van.email}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Contact</h4>
                <p className="text-[#0099cc]">{van.contact}</p>
              </div>
            </div>
          </aside>

          {/* Right panel */}
          <main className="col-span-2 pl-4">
            {/* Tabs */}
            <div className="flex gap-6 border-b mb-4 dark:border-neutral-700 text-lg">
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
                    : "text-gray-500 hover:text-[#0099cc]"
                }`}
              >
                Documents
              </button>
            </div>

            {/* About Tab */}
            {tab === "about" && (
              <div className="space-y-4 text-m mt-10">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#0099cc]" /> {van.address}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#0099cc]" />{" "}
                  {new Date(van.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-[#0099cc]" /> Status:{" "}
                  <span
                    className={`font-semibold ml-1 ${
                      van.isApproved === "approved"
                        ? "text-green-600"
                        : van.isApproved === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {van.isApproved}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  <Detail
                    label="Registration No"
                    value={van.registrationNumber}
                  />
                  <Detail
                    label="License Plate"
                    value={van.licensePlateNumber}
                  />
                  <Detail label="Make & Model" value={van.makeAndModel} />
                  <Detail
                    label="Seating Capacity"
                    value={String(van.seatingCapacity)}
                  />
                  <Detail label="A/C" value={van.acCondition ? "Yes" : "No"} />
                  <Detail label="Route Start" value={van.routeStart} />
                  <Detail label="Route End" value={van.routeEnd} />
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {tab === "documents" && (
              <div className="space-y-5 text-m mt-10">
                <DetailLink label="R Book" url={van.rBookUrl} />
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
                <DetailLink
                  label="Business Document"
                  url={van.businessDocument}
                />
              </div>
            )}
          </main>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 left-0 -mt-10 flex justify-end bg-white py-2 pr-6 border-t">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-400 rounded-sm hover:bg-gray-100 transition-colors"
          >
            <X size={18} /> Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <h4 className="font-semibold mb-1 text-gray-700">{label}</h4>
      <p className="text-gray-600">{value || "N/A"}</p>
    </div>
  );
}

function DetailLink({ label, url }: { label: string; url?: string }) {
  const hasUrl = Boolean(url);
  return (
    <div>
      <h4 className="font-semibold mb-1 text-gray-700">{label}</h4>
      {hasUrl ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-2 text-[#0099cc] hover:underline"
        >
          <FileText size={16} /> View Document
        </a>
      ) : (
        <p className="text-gray-500">Not uploaded</p>
      )}
    </div>
  );
}
