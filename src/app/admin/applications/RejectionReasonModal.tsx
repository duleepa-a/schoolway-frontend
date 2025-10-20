"use client";

import React, { useEffect, useRef, useState } from "react";
import { XCircle, X, FileText, Mail } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className="relative w-full p-2 max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-100"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-xl">
              <XCircle size={24} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Reject {context === "van" ? "Van" : "Driver"} Application
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Provide rejection details and preview notification email
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200">
          <div className="flex gap-8 text-base">
            <button
              onClick={() => setTab("reason")}
              className={`pb-4 font-medium transition-colors flex items-center gap-2 ${
                tab === "reason"
                  ? "border-b-2 border-[#0099cc] text-[#0099cc]"
                  : "text-gray-500 hover:text-[#0099cc]"
              }`}
            >
              <FileText className="w-4 h-4" />
              Rejection Reason
            </button>
            <button
              onClick={() => setTab("emailPreview")}
              className={`pb-4 font-medium transition-colors flex items-center gap-2 ${
                tab === "emailPreview"
                  ? "border-b-2 border-[#0099cc] text-[#0099cc]"
                  : "text-gray-500 hover:text-[#0099cc]"
              }`}
            >
              <Mail className="w-4 h-4" />
              Email Preview
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Reason Tab */}
          {tab === "reason" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="radio"
                    name="reject-mode"
                    checked={useNoneReason}
                    onChange={() => setUseNoneReason(true)}
                    className="accent-[#0099cc] mt-1 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="block text-gray-800 font-medium text-sm">
                      No specific reason
                    </span>
                    <p className="text-gray-500 text-sm mt-1">
                      Send a standard rejection notification without additional
                      details
                    </p>
                  </div>
                </label>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="radio"
                    name="reject-mode"
                    checked={!useNoneReason}
                    onChange={() => setUseNoneReason(false)}
                    className="accent-[#0099cc] mt-1 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="block text-gray-800 font-medium text-sm mb-2">
                      Provide detailed reason
                    </span>
                    <p className="text-gray-500 text-sm mb-3">
                      This reason will be included in the rejection email sent
                      to the applicant
                    </p>
                    <textarea
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0099cc] focus:border-transparent transition-all ${
                        useNoneReason
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-800"
                      }`}
                      placeholder="Write a detailed rejection reason that will help the applicant understand the decision..."
                      disabled={useNoneReason}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={4}
                    />
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Email Preview Tab */}
          {tab === "emailPreview" && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <div className="space-y-4 text-sm text-gray-700">
                  {context === "van" ? (
                    <>
                      <p>Dear Applicant,</p>
                      <p>
                        Thank you for submitting your van service application to
                        SchoolWay. After careful review, we regret to inform you
                        that your application has been <strong>rejected</strong>
                        .
                      </p>
                      {!useNoneReason && rejectionReason && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                          <p className="font-medium text-yellow-800 mb-1">
                            Reason provided:
                          </p>
                          <p className="text-yellow-700">{rejectionReason}</p>
                        </div>
                      )}
                      <p>
                        We appreciate your interest in joining our
                        transportation network and encourage you to review our
                        requirements for future applications.
                      </p>
                      <p>
                        Best regards,
                        <br />
                        <strong>The SchoolWay Team</strong>
                      </p>
                    </>
                  ) : (
                    <>
                      <p>Dear Applicant,</p>
                      <p>
                        Thank you for your interest in becoming a driver with
                        SchoolWay. After reviewing your application, we regret
                        to inform you that we are unable to approve your
                        application at this time.
                      </p>
                      {!useNoneReason && rejectionReason && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                          <p className="font-medium text-yellow-800 mb-1">
                            Reason provided:
                          </p>
                          <p className="text-yellow-700">{rejectionReason}</p>
                        </div>
                      )}
                      <p>
                        We encourage you to review our driver requirements and
                        consider reapplying in the future if your circumstances
                        change.
                      </p>
                      <p>
                        Thank you for your understanding.
                        <br />
                        <strong>The SchoolWay Team</strong>
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#0099cc]" />
                  <div>
                    <p className="text-sm font-medium text-[#0099cc]">
                      Email Notification
                    </p>
                    <p className="text-xs text-[#0099cc]">
                      This email will be sent automatically to the applicant
                      upon rejection
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 left-0 bg-white py-4 px-6 border-t border-gray-100 rounded-b-xl">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                onConfirm(useNoneReason ? undefined : rejectionReason.trim())
              }
              className="flex items-center gap-2 px-5 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              <XCircle size={18} />
              Reject Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
