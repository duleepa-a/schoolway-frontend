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
