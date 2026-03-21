import { http } from './http';
import type { ReportItem } from '@/types/api';

export interface GetReportsParams {
  status?: 'open' | 'resolved';
  limit?: number;
}

export async function getReports(params: GetReportsParams): Promise<ReportItem[]> {
  const { data } = await http.get<ReportItem[]>('/reports', {
    params,
  });

  return data;
}

export async function resolveReport(id: string) {
  const { data } = await http.patch(`/reports/${id}/resolve`, {});
  return data;
}
