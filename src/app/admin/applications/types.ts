export interface ApplicationData {
  id: string;
  name: string;
  email: string;
  contact: string;
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
