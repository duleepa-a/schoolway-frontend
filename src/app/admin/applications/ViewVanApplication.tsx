'use client';

import React, { useEffect, useRef } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { VanApplication } from './types';

interface Props {
  van: VanApplication;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

export default function ViewVanApplication({
  van,
  onApprove,
  onReject,
  onClose,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl relative overflow-y-auto max-h-[90vh] border border-gray-200"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-yellow-500 text-xl"
        >
          ✖
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-500">
          Van Application
        </h2>

        <div className="space-y-8 text-sm text-gray-700 bg-white">
          {/* Vehicle Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
              Vehicle Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <p><span className="font-semibold">Registration Number:</span> {van.registrationNumber}</p>
              <p><span className="font-semibold">License Plate:</span> {van.licensePlateNumber}</p>
              <p><span className="font-semibold">Make & Model:</span> {van.makeAndModel}</p>
              <p><span className="font-semibold">Seating Capacity:</span> {van.seatingCapacity}</p>
              <p><span className="font-semibold">AC Available:</span> {van.acCondition ? 'Yes' : 'No'}</p>
              <p><span className="font-semibold">Route:</span> {van.routeStart || '-'} → {van.routeEnd || '-'}</p>
              <p><span className="font-semibold">Submitted At:</span> {van.createdAt}</p>
            </div>
          </div>

          {/* Van Photo */}
          {van.photoUrl && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Van Photo</h3>
              <a href={van.photoUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={van.photoUrl}
                  alt="Van"
                  className="h-40 w-full object-cover rounded-md border border-gray-300 hover:scale-105 transition-transform"
                />
              </a>
            </div>
          )}

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Documents</h3>
            <div className="grid grid-cols-2 gap-3 text-yellow-600">
              <a href={van.rBookUrl} target="_blank" className="underline hover:text-yellow-700">View R Book</a>
              <a href={van.revenueLicenseUrl} target="_blank" className="underline hover:text-yellow-700">View Revenue License</a>
              <a href={van.fitnessCertificateUrl} target="_blank" className="underline hover:text-yellow-700">View Fitness Certificate</a>
              <a href={van.insuranceCertificateUrl} target="_blank" className="underline hover:text-yellow-700">View Insurance Certificate</a>
            </div>
          </div>

          {/* Owner Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Owner Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <p><span className="font-semibold">Name:</span> {van.ownerName}</p>
              <p><span className="font-semibold">Email:</span> {van.ownerEmail}</p>
              <p><span className="font-semibold">Mobile:</span> {van.ownerMobile}</p>
              <p><span className="font-semibold">District:</span> {van.ownerDistrict || '-'}</p>
              <p><span className="font-semibold">Address:</span> {van.address || '-'}</p>
            </div>
          </div>

          {/* Service Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Van Service Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <p><span className="font-semibold">Service Name:</span> {van.serviceName}</p>
              <p><span className="font-semibold">Service Reg No:</span> {van.serviceRegNumber}</p>
              <p><span className="font-semibold">Contact:</span> {van.serviceContact}</p>
              {van.businessDocument && (
                <a
                  href={van.businessDocument}
                  target="_blank"
                  className="text-yellow-600 underline hover:text-yellow-700"
                >
                  View Business Document
                </a>
              )}
            </div>
          </div>

          {/* Approve / Reject Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button onClick={onReject} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
              <XCircle size={18} /> Reject
            </button>
            <button onClick={onApprove} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
              <CheckCircle size={18} /> Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
