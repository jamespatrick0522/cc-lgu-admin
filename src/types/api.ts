export type UserRole = 'tourist' | 'establishment' | 'lgu_admin';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string | null;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  user: AuthUser;
}

export type ListingStatus = 'draft' | 'pending' | 'verified' | 'rejected';

export interface EstablishmentMedia {
  id: string;
  establishmentId: string;
  type: 'image' | 'video';
  url: string;
  publicId: string | null;
  format: string | null;
  bytes: number | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface EstablishmentRequirements {
  hasBusinessPermitNumber: boolean;
  galleryImageCount: number;
  minGalleryImages: number;
  maxGalleryImages: number;
  hasLocationVideo: boolean;
  canSubmitForApproval: boolean;
  missing: string[];
}

export interface Establishment {
  id: string;
  ownerUserId: string | null;
  city: string;
  name: string;
  category: 'tourist_spot' | 'restaurant' | 'clinic_hospital' | 'mall' | 'other';
  address: string;
  description: string | null;
  services: string | null;
  businessPermitNumber: string | null;
  contactNumber: string | null;
  email: string | null;
  opensAt: string | null;
  closesAt: string | null;
  listingStatus: ListingStatus;
  businessStatus: 'open' | 'closed' | 'temporarily_closed';
  isOpenNow: boolean;
  coverPhotoUrl?: string | null;
  statusNote: string | null;
  latitude: string | null;
  longitude: string | null;
  media: EstablishmentMedia[];
  requirements: EstablishmentRequirements;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ReportItem {
  id: string;
  reporterUserId: string | null;
  establishmentId: string;
  reason: string;
  details: string | null;
  status: 'open' | 'resolved';
  resolvedByUserId: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

export interface Announcement {
  id: string;
  city: string;
  title: string;
  content: string;
  publishedByUserId: string;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
}
