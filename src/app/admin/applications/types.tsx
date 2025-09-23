export interface ApplicationData {
  id: string;
  name: string;
  email: string;
  mobile: string;
  dob: string;
  address: string;
  drivingLicense: string;
  licenseExpiry: string;
  nic: string;
  policeReport: string;
  medicalReport?: string;
  bio?: string;
  languages?: string[];
  licenseType?: string[];
  profilePicture?: string;
  policeReportDocument?: string;
  medicalReportDocument?: string;
  licenseFront?: string;
  licenseBack?: string;
  status?: string;
  date?: string;
}

export type VanApplication = {
  id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  registrationNumber: string;
  licensePlateNumber: string;
  makeAndModel: string;
  seatingCapacity: number;
  acCondition: boolean;
  routeStart: string;
  routeEnd: string;
  rBookUrl: string;
  revenueLicenseUrl: string;
  fitnessCertificateUrl: string;
  insuranceCertificateUrl: string;
  photoUrl: string;
  status: string;
  createdAt: string;

  ownerName: string;
  ownerEmail: string;
  ownerMobile: string;
  ownerDistrict: string;

  serviceName: string;
  serviceRegNumber: string;
  serviceContact: string;
  businessDocument: string;
};
