import { http } from './http';
import type { Announcement } from '@/types/api';

export interface CreateAnnouncementPayload {
  city: string;
  title: string;
  content: string;
  startsAt?: string;
  endsAt?: string;
}

export async function getAnnouncements(city?: string, limit = 30): Promise<Announcement[]> {
  const { data } = await http.get<Announcement[]>('/announcements', {
    params: {
      city,
      limit,
    },
  });

  return data;
}

export async function createAnnouncement(payload: CreateAnnouncementPayload): Promise<Announcement> {
  const { data } = await http.post<Announcement>('/announcements', payload);
  return data;
}
