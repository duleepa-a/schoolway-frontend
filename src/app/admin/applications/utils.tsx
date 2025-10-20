import { ApplicationData } from "./types";

export function formatDriverApplication(app: any): ApplicationData {
  return {
    id: app.id,
    name: `${app.firstname || ""} ${app.lastname || ""}`.trim(),
    email: app.email || "",
    nic: app.nic || "N/A",
    mobile: app.mobile || "N/A",
    dob: app.birthDate ? new Date(app.birthDate).toLocaleDateString() : "N/A",
    address: app.address || "N/A",
    drivingLicense: app.DriverProfile?.licenseId || "N/A",
    licenseExpiry: app.DriverProfile?.licenseExpiry
      ? new Date(app.DriverProfile.licenseExpiry).toLocaleDateString()
      : "",
    policeReport: app.DriverProfile?.policeReport ? "" : "",
    medicalReport: app.DriverProfile?.medicalReport || "",
    medicalReportDocument: app.DriverProfile?.medicalReport || "",
    bio: app.DriverProfile?.bio || "",
    languages: app.DriverProfile?.languages || [],
    licenseType: app.DriverProfile?.licenseType || [],
    profilePicture: app.dp || "",
    policeReportDocument: app.DriverProfile?.policeReport || "",
    licenseFront: app.DriverProfile?.licenseFront || "",
    licenseBack: app.DriverProfile?.licenseBack || "",
    status:
      app.DriverProfile?.status === 2
        ? "Pending"
        : app.DriverProfile?.status === 1
        ? "Approved"
        : "Rejected",
    date: new Date(app.createdAt).toLocaleDateString(),
  };
}

import { VanApplication } from "./types";

export function formatVanApplication(van: any): VanApplication {
  const user = van.UserProfile || {};
  const vanService = user.vanService || {};

  return {
    id: van.id,
    name: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
    email: user.email || "",
    contact: user.mobile || "N/A",
    address: user.address || "N/A",
    registrationNumber: van.registrationNumber || "N/A",
    licensePlateNumber: van.licensePlateNumber || "N/A",
    makeAndModel: van.makeAndModel || "N/A",
    seatingCapacity: van.seatingCapacity || 0,
    acCondition: van.acCondition || false,
    // routeStart: van.routeStart || "",
    routeEnd: van.routeEnd || "",
    rBookUrl: van.rBookUrl || "",
    revenueLicenseUrl: van.revenueLicenseUrl || "",
    fitnessCertificateUrl: van.fitnessCertificateUrl || "",
    insuranceCertificateUrl: van.insuranceCertificateUrl || "",
    photoUrl: van.photoUrl || "",
    status:
      van.status === 2 ? "Pending" : van.status === 1 ? "Approved" : "Rejected",
    // isApproved: van.isApproved || false,
    createdAt: new Date(van.createdAt).toLocaleDateString(),

    ownerName: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
    ownerEmail: user.email || "",
    ownerMobile: user.mobile || "",
    ownerDistrict: user.district || "",

    serviceName: vanService.serviceName || "",
    serviceRegNumber: vanService.serviceRegNumber || "",
    serviceContact: vanService.contactNo || "",
    businessDocument: vanService.businessDocument || "",
  };
}
