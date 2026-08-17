<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { CheckCircle2, FileText, ImageIcon, PlayCircle, XCircle } from 'lucide-vue-next';

import { getEstablishments, verifyEstablishment } from '@/api/establishments.api';
import PageHeader from '@/components/common/PageHeader.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Establishment, ListingStatus, PaginatedResponse } from '@/types/api';

const filters = reactive({
  search: '',
  city: '',
  listingStatus: 'pending' as ListingStatus,
});

const loading = ref(false);
const updatingId = ref<string | null>(null);
const errorMessage = ref('');
const successMessage = ref('');
const establishments = ref<Establishment[]>([]);
const pagination = ref<PaginatedResponse<Establishment>['meta'] | null>(null);
const rejectionNotes = reactive<Record<string, string>>({});

function galleryImages(item: Establishment) {
  return item.media?.filter((media) => media.type === 'image') ?? [];
}

function locationVideo(item: Establishment) {
  return item.media?.find((media) => media.type === 'video') ?? null;
}

function statusVariant(status: ListingStatus) {
  if (status === 'verified') return 'default';
  if (status === 'rejected') return 'destructive';
  if (status === 'draft') return 'outline';
  return 'secondary';
}

async function load() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await getEstablishments({
      listingStatus: filters.listingStatus,
      search: filters.search || undefined,
      city: filters.city || undefined,
      page: 1,
      pageSize: 30,
    });

    establishments.value = response.data;
    pagination.value = response.meta;
    response.data.forEach((item) => {
      rejectionNotes[item.id] = item.statusNote || '';
    });
  } catch {
    errorMessage.value = 'Failed to load establishments.';
  } finally {
    loading.value = false;
  }
}

async function verify(id: string, status: 'verified' | 'rejected') {
  updatingId.value = id;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    await verifyEstablishment(id, status, status === 'rejected' ? rejectionNotes[id]?.trim() : undefined);
    successMessage.value = `Establishment has been ${status}.`;
    await load();
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message || 'Failed to update listing status.';
  } finally {
    updatingId.value = null;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <PageHeader
      title="Establishment Verification"
      subtitle="Review permit details, gallery images, location media, and give clear rejection reasons."
    />

    <Card class="mb-5 shadow-panel">
      <CardContent class="grid gap-3 p-4 md:grid-cols-4">
        <Input v-model="filters.search" class="h-11" placeholder="Search by name, address, or city" />
        <Input v-model="filters.city" class="h-11" placeholder="Filter by city" />
        <select v-model="filters.listingStatus" class="h-11 rounded-md border bg-background px-3 text-base">
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
        <Button class="h-11 text-base" @click="load">Apply Filters</Button>
      </CardContent>
    </Card>

    <div v-if="errorMessage" class="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      {{ errorMessage }}
    </div>

    <div v-if="successMessage" class="mb-3 rounded-lg border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
      {{ successMessage }}
    </div>

    <div v-if="loading" class="rounded-lg border bg-muted/40 p-8 text-center text-muted-foreground">Loading...</div>
    <div v-else-if="!establishments.length" class="rounded-lg border bg-muted/40 p-8 text-center text-muted-foreground">No records found.</div>

    <div v-else class="grid gap-5">
      <Card v-for="item in establishments" :key="item.id" class="shadow-panel">
        <CardHeader>
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle class="text-xl">{{ item.name }}</CardTitle>
              <p class="mt-1 text-sm text-muted-foreground">{{ item.city }} • {{ item.address }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <Badge :variant="statusVariant(item.listingStatus)">{{ item.listingStatus }}</Badge>
              <Badge variant="outline" class="capitalize">{{ item.category.replace('_', ' ') }}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent class="space-y-5">
          <div class="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
            <div class="rounded-lg border bg-muted/20 p-4">
              <div class="mb-3 flex items-center gap-2">
                <FileText class="h-5 w-5 text-secondary" />
                <h3 class="font-semibold">Registration Details</h3>
              </div>
              <div class="grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <p class="text-muted-foreground">Business Permit / BIR Number</p>
                  <p class="font-medium">{{ item.businessPermitNumber || 'Missing' }}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">Contact</p>
                  <p class="font-medium">{{ item.contactNumber || 'No contact' }}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">Email</p>
                  <p class="font-medium">{{ item.email || 'No email' }}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">Hours</p>
                  <p class="font-medium">{{ item.opensAt || 'N/A' }} - {{ item.closesAt || 'N/A' }}</p>
                </div>
              </div>
              <p v-if="item.description" class="mt-4 text-sm text-muted-foreground">{{ item.description }}</p>
            </div>

            <div class="rounded-lg border bg-muted/20 p-4">
              <h3 class="font-semibold">Requirement Check</h3>
              <div class="mt-3 space-y-3 text-sm">
                <div class="flex items-center gap-2">
                  <component :is="item.requirements.hasBusinessPermitNumber ? CheckCircle2 : XCircle" class="h-5 w-5" :class="item.requirements.hasBusinessPermitNumber ? 'text-success' : 'text-destructive'" />
                  <span>Permit / BIR number</span>
                </div>
                <div class="flex items-center gap-2">
                  <component :is="item.requirements.galleryImageCount >= item.requirements.minGalleryImages ? CheckCircle2 : XCircle" class="h-5 w-5" :class="item.requirements.galleryImageCount >= item.requirements.minGalleryImages ? 'text-success' : 'text-destructive'" />
                  <span>{{ item.requirements.galleryImageCount }}/{{ item.requirements.maxGalleryImages }} gallery images</span>
                </div>
                <div class="flex items-center gap-2 text-muted-foreground">
                  <PlayCircle class="h-5 w-5 text-secondary" />
                  <span>{{ item.requirements.hasLocationVideo ? 'Location video uploaded' : 'No optional video' }}</span>
                </div>
              </div>
              <p v-if="item.requirements.missing.length" class="mt-3 text-sm text-destructive">
                Missing: {{ item.requirements.missing.join(', ') }}.
              </p>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <ImageIcon class="h-5 w-5 text-secondary" />
              <h3 class="font-semibold">Gallery Images</h3>
            </div>
            <div v-if="galleryImages(item).length" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <a v-for="media in galleryImages(item)" :key="media.id" :href="media.url" target="_blank" rel="noreferrer" class="block overflow-hidden rounded-lg border bg-background hover:opacity-90">
                <img :src="media.url" alt="Gallery image" class="h-32 w-full object-cover" />
              </a>
            </div>
            <div v-else class="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No gallery images uploaded.</div>
          </div>

          <div v-if="locationVideo(item)" class="space-y-3">
            <h3 class="font-semibold">Location / Landmark Video</h3>
            <video :src="locationVideo(item)!.url" controls class="max-h-80 w-full rounded-lg border bg-black" />
          </div>

          <div class="rounded-lg border p-4">
            <label class="text-sm font-medium">Rejection reason</label>
            <Textarea v-model="rejectionNotes[item.id]" class="mt-2 min-h-[90px]" placeholder="Explain what the owner needs to fix if rejecting." />
            <div class="mt-4 flex flex-wrap justify-end gap-3">
              <Button
                class="h-10"
                :disabled="updatingId === item.id || item.listingStatus === 'verified'"
                @click="verify(item.id, 'verified')"
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                class="h-10"
                :disabled="updatingId === item.id || item.listingStatus === 'rejected'"
                @click="verify(item.id, 'rejected')"
              >
                Reject
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <p v-if="pagination" class="mt-3 text-sm text-muted-foreground">
      Showing {{ establishments.length }} of {{ pagination.total }} record(s)
    </p>
  </div>
</template>
