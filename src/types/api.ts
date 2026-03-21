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

export interface Establishment {
  id: string;
  ownerUserId: string | null;
  city: string;
  name: string;
  category: 'tourist_spot' | 'restaurant' | 'clinic_hospital' | 'mall' | 'other';
  address: string;
  listingStatus: 'pending' | 'verified' | 'rejected';
  businessStatus: 'open' | 'closed' | 'temporarily_closed';
  isOpenNow: boolean;
  coverPhotoUrl?: string | null;
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
