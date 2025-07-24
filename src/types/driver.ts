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

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface DriverResponse {
  drivers: Driver[];
  pagination: PaginationInfo;
  availableDistricts: string[];
}

export interface DriverSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  district?: string;
}
