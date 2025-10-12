"use client";

import React, { useEffect, useRef } from "react";
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

  // Parent and Van details as separate full width rows
  const parentDetail = {
    label: "Parent",
    value: `${payment.FullName} (${payment.ParentID})`,
  };
  const vanDetail = {
    label: "Van ID",
    value: payment.VanID,
  };

  // Other details in two columns
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
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl p-10 animate-slideUp"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 text-gray-400 hover:text-[#0099cc] text-3xl font-semibold"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-3xl font-semibold text-[#6a6c6c] mb-8 flex items-center gap-3">
          <FileText size={28} />
          Payment Details
        </h2>

        {/* Parent & Van - Full width rows */}
        <div className="space-y-6 border-b border-gray-200 pb-6 mb-8">
          {[parentDetail, vanDetail].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-[#0099cc] semi-bold uppercase tracking-wide font-medium">
                {label}
              </span>
              <span className="font-semibold text-gray-900">{value}</span>
            </div>
          ))}
        </div>

        {/* Other details in two columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
          {otherDetails.map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-[#0099cc] semi-bold font-medium tracking-wide">
                {label}
              </span>
              <span className="font-semibold text-gray-900">{value}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#0099cc] hover:bg-[#007aaf] text-white font-semibold rounded-md transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
