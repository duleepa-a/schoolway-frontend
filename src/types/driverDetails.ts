export interface DriverDetails {
  id: string;
  name: string;
  profilePic: string;
  city: string;
  district: string;
  contactNumber: string;
  nic: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  experience: string;
  rating: number;
  totalReviews: number;
  email: string;
  hasVan: boolean;  // Add this field
  documents: {
    driverLicense: string;
    policeReport: string;
    medicalReport: string;
  };
}

export interface DriverDetailsResponse {
  driver: DriverDetails;
}