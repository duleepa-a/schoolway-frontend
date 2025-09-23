"use client";

import React, { useEffect, useRef, useState } from "react";
import { XCircle } from "lucide-react";

interface RejectionReasonModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  initialReason?: string;
  context: "van" | "driver";
}

export default function RejectionReasonModal({
  open,
  onClose,
  onConfirm,
  initialReason = "",
  context,
}: RejectionReasonModalProps) {
  const [rejectionReason, setRejectionReason] = useState(initialReason);
  const [useNoneReason, setUseNoneReason] = useState(true);
  const [tab, setTab] = useState<"reason" | "emailPreview">("reason");
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setRejectionReason(initialReason);
      setUseNoneReason(initialReason.trim() === "");
      setTab("reason");
    }
  }, [open, initialReason]);

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
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md animate-fadeIn">
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-md bg-white shadow-2xl p-20 animate-slideUp"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-[#0099cc] text-2xl transition-colors"
        >
          ✖
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <XCircle size={28} className="text-red-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Reject Application
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b mb-4 text-lg">
          <button
            onClick={() => setTab("reason")}
            className={`pb-3 font-medium ${
              tab === "reason"
                ? "border-b-3 border-[#0099cc] text-[#0099cc]"
                : "text-gray-500 hover:text-[#0099cc]"
            }`}
          >
            Reason
          </button>
          <button
            onClick={() => setTab("emailPreview")}
            className={`pb-3 font-medium ${
              tab === "emailPreview"
                ? "border-b-3 border-[#0099cc] text-[#0099cc]"
                : "text-gray-500 hover:text-[#0099cc]"
            }`}
          >
            Email Preview
          </button>
        </div>

        {/* Reason Tab */}
        {tab === "reason" && (
          <div className="space-y-6 mb-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="reject-mode"
                checked={useNoneReason}
                onChange={() => setUseNoneReason(true)}
                className="accent-[#0099cc] cursor-pointer"
              />
              <span className="text-gray-700 text-lg">No reason (default)</span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="reject-mode"
                checked={!useNoneReason}
                onChange={() => setUseNoneReason(false)}
                className="accent-[#0099cc] mt-2 cursor-pointer"
              />
              <div className="flex-1">
                <span className="block text-gray-800 font-medium mb-2 text-lg">
                  Provide a reason
                </span>
                <p className="text-gray-500 mb-2 text-sm">
                  This reason will be included in the rejection email.
                </p>
                <textarea
                  className={`w-full border rounded-md p-3 min-h-28 transition focus:ring-2 focus:ring-[#0099cc] focus:border-[#0099cc] ${
                    useNoneReason
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-800"
                  }`}
                  placeholder="Write a detailed rejection reason..."
                  disabled={useNoneReason}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            </label>
          </div>
        )}

        {/* Email Preview Tab */}
        {tab === "emailPreview" && (
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold">Email Preview</h3>
            <div className="border rounded-md p-4 bg-gray-50">
              {context === "van" ? (
                <>
                  <p className="text-gray-800">Hi {"Applicant"},</p>
                  <p className="text-gray-800 mt-4">
                    Your van application has been <strong>rejected</strong>.
                  </p>
                  {!useNoneReason && (
                    <p className="text-gray-800 mt-4">
                      <strong>Reason:</strong> {rejectionReason || "N/A"}
                    </p>
                  )}
                  <p className="text-gray-800 mt-4">Thank you,</p>
                  <p className="text-gray-800">— SchoolWay Team</p>
                </>
              ) : (
                <>
                  <p className="text-gray-800">Hi {"Applicant"},</p>
                  <p className="text-gray-800 mt-4">
                    We appreciate your interest in joining SchoolWay. After
                    review, your application was <strong>not approved</strong>
                    at this time.
                  </p>
                  {!useNoneReason && (
                    <p className="text-gray-800 mt-4">
                      <strong>Reason:</strong> {rejectionReason || "N/A"}
                    </p>
                  )}
                  <p className="text-gray-800 mt-4">
                    You may update your information and re-apply in the future.
                  </p>
                  <p className="text-gray-800 mt-4">Thank you,</p>
                  <p className="text-gray-800">— SchoolWay Team</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4 border-t pt-5">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-md border border-black text-black hover:bg-black hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onConfirm(useNoneReason ? undefined : rejectionReason.trim())
            }
            className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-600 rounded-sm hover:bg-red-600 hover:text-white transition-colors"
          >
            <XCircle size={20} /> Reject
          </button>
        </div>
      </div>
    </div>
  );
}
