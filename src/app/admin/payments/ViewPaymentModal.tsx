"use client";

import React, { useRef, useEffect } from "react";
import {
  FileText,
  User,
  Truck,
  Calendar,
  CreditCard,
  X,
  BadgeCheck,
  Clock,
} from "lucide-react";

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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "paid":
      case "success":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "paid":
      case "success":
        return <BadgeCheck className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-lg border border-gray-100 overflow-y-autos"
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
            <div className="p-3 bg-blue-100 rounded-xl">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Payment Details
              </h3>
              <p className="text-gray-600 text-md mt-1">
                Complete payment information and transaction details
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Main Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Parent Information */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                Parent Information
              </h4>
              <div className="space-y-3 text-md">
                <div>
                  <p className="text-sm uppercase text-gray-400 mb-1">
                    Full Name
                  </p>
                  <p className="font-medium text-gray-800">
                    {payment.FullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase text-gray-400 mb-1">
                    Parent ID
                  </p>
                  <p className="font-medium text-gray-800">
                    {payment.ParentID}
                  </p>
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-500" />
                Service Information
              </h4>
              <div className="space-y-3 text-md">
                <div>
                  <p className="text-sm uppercase text-gray-400 mb-1">Van ID</p>
                  <p className="font-medium text-gray-800">{payment.VanID}</p>
                </div>
                {payment.ChildId && (
                  <div>
                    <p className="text-sm uppercase text-gray-400 mb-1">
                      Child ID
                    </p>
                    <p className="font-medium text-gray-800">
                      {payment.ChildId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" />
              Payment Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm uppercase text-gray-400 mb-1">
                    Payment ID
                  </p>
                  <p className="font-medium text-gray-800 text-md">
                    {payment.PaymentID}
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase text-gray-400 mb-1">Amount</p>
                  <p className="text-lg font-bold text-gray-800">
                    {payment.Amount !== undefined
                      ? `$${payment.Amount.toFixed(2)}`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase text-gray-400 mb-1">Month</p>
                  <p className="font-medium text-gray-800">
                    {payment.Month ?? "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm uppercase text-gray-400 mb-1">Status</p>
                  <div
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      payment.Status
                    )}`}
                  >
                    {getStatusIcon(payment.Status)}
                    <span>{payment.Status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm uppercase text-gray-400 mb-1">
                    Payment Date
                  </p>
                  <p className="font-medium text-gray-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    {payment.Date ?? "N/A"}
                  </p>
                </div>
                {payment.PaidAt && (
                  <div>
                    <p className="text-sm uppercase text-gray-400 mb-1">
                      Paid At
                    </p>
                    <p className="font-medium text-gray-800">
                      {payment.PaidAt}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {payment.PaymentType && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm uppercase text-gray-400 mb-1">
                  Payment Type
                </p>
                <p className="font-medium text-gray-800">
                  {payment.PaymentType}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 left-0 bg-white py-4 px-6 border-t border-gray-100 rounded-b-xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 font-medium"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
