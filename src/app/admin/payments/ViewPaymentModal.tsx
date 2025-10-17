"use client";

import React, { useRef, useEffect } from "react";
import { FileText } from "lucide-react";

type PaymentItem = {
  PaymentID: string;
  ParentID: string;
  FullName: string;
  VanID: string;
  Date: string | null;
  Status: string;
  Amount?: number;
  Month?: string;
  PaidAt?: string | null;
  PaymentType?: string;
  ChildId?: number;
};

interface ViewPaymentModalProps {
  payment: PaymentItem;
  onClose: () => void;
}

export default function ViewPaymentModal({
  payment,
  onClose,
}: ViewPaymentModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const parentDetail = {
    label: "Parent",
    value: `${payment.FullName} (${payment.ParentID})`,
  };
  const vanDetail = { label: "Van ID", value: payment.VanID };

  const otherDetails = [
    { label: "Payment ID", value: payment.PaymentID },
    { label: "Status", value: payment.Status },
    {
      label: "Amount",
      value:
        payment.Amount !== undefined ? `$${payment.Amount.toFixed(2)}` : "N/A",
    },
    { label: "Month", value: payment.Month ?? "N/A" },
    { label: "Paid At", value: payment.PaidAt ?? "N/A" },
    { label: "Date", value: payment.Date ?? "N/A" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop also closes via click-outside handler */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-3xl bg-white rounded-lg shadow-xl p-8 animate-slideUp"
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-[#0099cc] font-bold"
        >
          &times;
        </button>

        {/* Header */}
        <h3 className="text-2xl font-semibold text-[#6a6c6c] mb-6 flex items-center gap-2">
          <FileText size={22} /> Payment Details
        </h3>

        {/* Parent & Van */}
        <div className="space-y-4 border-b border-gray-200 pb-6 mb-6 text-sm">
          {[parentDetail, vanDetail].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-[#0099cc] font-medium">{label}</span>
              <span className="text-gray-900 font-semibold">{value}</span>
            </div>
          ))}
        </div>

        {/* Other Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
          {otherDetails.map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-[#0099cc] font-medium">{label}</span>
              <span className="text-gray-900 font-semibold">{value}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0099cc] hover:bg-[#007aaf] text-white rounded-md font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
