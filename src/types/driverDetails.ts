export interface DriverDetails {
  id: string;
  name: string;
  profilePic: string;
  district: string;
  city : string;
  contactNumber: string;
  nic: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  experience: string;
  rating: number;
  totalReviews: number;
  email: string;
  documents: {
    driverLicense: string;
    policeReport: string;
    medicalReport: string;
  };
}

export interface DriverDetailsResponse {
  driver: DriverDetails;
}