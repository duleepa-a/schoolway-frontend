"use client";

import { VanDetails } from './types';
import { X } from 'lucide-react';

type ViewVanDetailsProps = {
  van: VanDetails;
  onClose: () => void;
};

export default function ViewVanDetails({ van, onClose }: ViewVanDetailsProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">Van Details</h3>
          <button onClick={onClose} className="rounded p-1 hover:bg-gray-100" aria-label="Close details">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
          <Detail label="Service Name" value={van.serviceName} />
          <Detail label="Owner Name" value={van.ownerName} />
          <Detail label="Email" value={van.email} />
          <Detail label="Contact" value={van.contact} />
          <Detail label="Address" value={van.address} />
          <Detail label="Status" value={van.isApproved} />
          <Detail label="Created" value={van.createdAt} />

          <Detail label="Registration No" value={van.registrationNumber} />
          <Detail label="License Plate" value={van.licensePlateNumber} />
          <Detail label="Make & Model" value={van.makeAndModel} />
          <Detail label="Seating Capacity" value={String(van.seatingCapacity)} />
          <Detail label="A/C" value={van.acCondition ? 'Yes' : 'No'} />

          <Detail label="Route Start" value={van.routeStart} />
          <Detail label="Route End" value={van.routeEnd} />

          <DetailLink label="R Book" url={van.rBookUrl} />
          <DetailLink label="Revenue License" url={van.revenueLicenseUrl} />
          <DetailLink label="Fitness Certificate" url={van.fitnessCertificateUrl} />
          <DetailLink label="Insurance Certificate" url={van.insuranceCertificateUrl} />
          <DetailLink label="Business Document" url={van.businessDocument} />
        </div>

        <div className="flex items-center justify-end gap-3 border-t p-4">
          <button onClick={onClose} className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium break-words">{value || '-'}</div>
    </div>
  );
}

function DetailLink({ label, url }: { label: string; url?: string }) {
  const hasUrl = Boolean(url);
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-gray-500">{label}</div>
      {hasUrl ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="text-sm font-medium text-blue-600 hover:underline break-all"
        >
          View document
        </a>
      ) : (
        <div className="text-sm font-medium">-</div>
      )}
    </div>
  );
}

