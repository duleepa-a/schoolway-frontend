export interface Driver {
  id: string;
  name: string;
  experience: string;
  rating: number;
  image: string;
  district: string;
  contact: string;
  licenseId: string;
  licenseExpiry: string;
  ratingCount: number;
  email: string;
}

export interface DriverResponse {
  drivers?: Driver[];
  error?: string;
}
