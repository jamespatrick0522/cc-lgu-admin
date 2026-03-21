import { http } from './http';
import type { Announcement, Establishment, ReportItem } from '@/types/api';

export interface DashboardResponse {
  generatedAt: string;
  metrics: {
    pendingEstablishments: number;
    verifiedEstablishments: number;
    openReports: number;
    activeAnnouncements: number;
  };
  recent: {
    pendingEstablishments: Establishment[];
    openReports: ReportItem[];
    announcements: Announcement[];
  };
}

export interface DashboardParams {
  city?: string;
  recentLimit?: number;
}

export async function getDashboard(params: DashboardParams = {}): Promise<DashboardResponse> {
  const { data } = await http.get<DashboardResponse>('/admin/dashboard', { params });
  return data;
}

