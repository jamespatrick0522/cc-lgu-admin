import { http } from './http';
import type { Establishment, PaginatedResponse } from '@/types/api';

export interface GetEstablishmentsParams {
  listingStatus?: 'pending' | 'verified' | 'rejected';
  search?: string;
  city?: string;
  page?: number;
  pageSize?: number;
}

export async function getEstablishments(
  params: GetEstablishmentsParams,
): Promise<PaginatedResponse<Establishment>> {
  const { data } = await http.get<PaginatedResponse<Establishment>>('/establishments', {
    params,
  });

  return data;
}

export async function verifyEstablishment(id: string, listingStatus: 'verified' | 'rejected') {
  const { data } = await http.patch(`/establishments/${id}/verify`, {
    listingStatus,
  });

  return data;
}
