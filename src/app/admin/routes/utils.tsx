import { VanDetails } from "./types";

type RawVanService = {
  serviceName?: string;
  serviceRegNumber?: string;
  contactNo?: string;
  contact?: string;
  businessDocument?: string;
};

type RawUserProfile = {
  firstname?: string;
  lastname?: string;
  email?: string;
  mobile?: string;
  address?: string;
  district?: string;
  VanService?: RawVanService;
  vanService?: RawVanService;
};

type RawVan = {
  id?: string | number;
  UserProfile?: RawUserProfile;
  registrationNumber?: string;
  licensePlateNumber?: string;
  makeAndModel?: string;
  seatingCapacity?: number;
  acCondition?: boolean | number;
  routeStart?: string | number;
  routeEnd?: string | number;
  rBookUrl?: string;
  revenueLicenseUrl?: string;
  fitnessCertificateUrl?: string;
  insuranceCertificateUrl?: string;
  photoUrl?: string;
  status?: number;
  createdAt?: string | number | Date;
};

// Convert a raw Prisma Van object into the UI-friendly VanDetails shape.
export function formatVanDetails(van: RawVan): VanDetails {
  const user = van.UserProfile || {};
  // Prisma relation on UserProfile is named `VanService` in the schema.
  const vanService = user.VanService || user.vanService || {};

  return {
    id: String(van.id),
    name: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
    email: user.email || "",
    contact: user.mobile || "",
    address: user.address || "",
    registrationNumber: van.registrationNumber || "",
    licensePlateNumber: van.licensePlateNumber || "",
    makeAndModel: van.makeAndModel || "",
    seatingCapacity: van.seatingCapacity || 0,
    acCondition: Boolean(van.acCondition),
    routeStart: van.routeStart ? String(van.routeStart) : "",
    routeEnd: van.routeEnd ? String(van.routeEnd) : "",
    rBookUrl: van.rBookUrl || "",
    revenueLicenseUrl: van.revenueLicenseUrl || "",
    fitnessCertificateUrl: van.fitnessCertificateUrl || "",
    insuranceCertificateUrl: van.insuranceCertificateUrl || "",
    photoUrl: van.photoUrl || "",
    isApproved:
      van.status === 1 ? "Approved" : van.status === 0 ? "Rejected" : "Pending",
    createdAt: van.createdAt
      ? new Date(van.createdAt).toISOString()
      : undefined,

    ownerName: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
    ownerDistrict: user.district || "",

    serviceName: vanService.serviceName || "",
    serviceRegNumber: vanService.serviceRegNumber || "",
    serviceContact: vanService.contactNo || vanService.contact || "",
    businessDocument: vanService.businessDocument || "",
  };
}
