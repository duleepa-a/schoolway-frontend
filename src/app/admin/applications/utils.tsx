import { ApplicationData } from './types';

export function formatDriverApplication(app: any): ApplicationData {
  return {
    id: app.id,
    name: `${app.firstname || ''} ${app.lastname || ''}`.trim(),
    email: app.email || '',
    nic: app.nic || '',
    contact: app.mobile || '',
    dob: app.birthDate ? new Date(app.birthDate).toLocaleDateString() : '',
    address: app.address || '',
    drivingLicense: app.driverProfile?.licenseId || '',
    licenseExpiry: app.driverProfile?.licenseExpiry
      ? new Date(app.driverProfile.licenseExpiry).toLocaleDateString()
      : '',
    policeReport: app.driverProfile?.policeReport ? 'Uploaded' : 'Missing',
    medicalReport: app.driverProfile?.medicalReport || '',
    medicalReportDocument: app.driverProfile?.medicalReport || '',
    bio: app.driverProfile?.bio || '',
    languages: app.driverProfile?.languages || [],
    licenseType: app.driverProfile?.licenseType || [],
    profilePicture: app.dp || '',
    policeReportDocument: app.driverProfile?.policeReport || '',
    licenseFront: app.driverProfile?.licenseFront || '',
    licenseBack: app.driverProfile?.licenseBack || '',
    status:
      app.driverProfile?.status === 2
        ? 'Pending'
        : app.driverProfile?.status === 1
        ? 'Approved'
        : 'Rejected',
    date: new Date(app.createdAt).toLocaleDateString(),
  };
}

import { VanApplication } from './types';

export function formatVanApplication(van: any): VanApplication {
  const user = van.user || {};
  const vanService = user.vanService || {};

  return {
    id: van.id,
    name: `${user.firstname || ''} ${user.lastname || ''}`.trim(),
    email: user.email || '',
    contact: user.mobile || '',
    address: user.address || '',
    registrationNumber: van.registrationNumber || '',
    licensePlateNumber: van.licensePlateNumber || '',
    makeAndModel: van.makeAndModel || '',
    seatingCapacity: van.seatingCapacity || 0,
    acCondition: van.acCondition || false,
    routeStart: van.routeStart || '',
    routeEnd: van.routeEnd || '',
    rBookUrl: van.rBookUrl || '',
    revenueLicenseUrl: van.revenueLicenseUrl || '',
    fitnessCertificateUrl: van.fitnessCertificateUrl || '',
    insuranceCertificateUrl: van.insuranceCertificateUrl || '',
    photoUrl: van.photoUrl || '',
    isApproved: van.isApproved || false,
    createdAt: new Date(van.createdAt).toLocaleDateString(),

    ownerName: `${user.firstname || ''} ${user.lastname || ''}`.trim(),
    ownerEmail: user.email || '',
    ownerMobile: user.mobile || '',
    ownerDistrict: user.district || '',

    serviceName: vanService.serviceName || '',
    serviceRegNumber: vanService.serviceRegNumber || '',
    serviceContact: vanService.contactNo || '',
    businessDocument: vanService.businessDocument || '',
  };
}
