import { VanDetails } from './types';

export function formatVanDetails(van: any): VanDetails {
  const user = van.UserProfile || {};
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
    isApproved:
      van.status === 2
      ? 'Pending'
      : van.status === 1
      ? 'Approved'
      : 'Rejected',
    // createdAt: new Date(van.createdAt).toLocaleDateString(),

    ownerName: `${user.firstname || ''} ${user.lastname || ''}`.trim(),
    ownerDistrict: user.district || '',

    serviceName: vanService.serviceName || '',
    serviceRegNumber: vanService.serviceRegNumber || '',
    serviceContact: vanService.contactNo || '',
    businessDocument: vanService.businessDocument || '',
  };
}