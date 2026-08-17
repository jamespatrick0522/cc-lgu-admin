import { http } from './http';
import type { Establishment, ListingStatus, PaginatedResponse } from '@/types/api';

export interface GetEstablishmentsParams {
  listingStatus?: ListingStatus;
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

export async function verifyEstablishment(
  id: string,
  listingStatus: 'verified' | 'rejected',
  statusNote?: string,
) {
  const { data } = await http.patch(`/establishments/${id}/verify`, {
    listingStatus,
    statusNote,
  });

  return data;
}
