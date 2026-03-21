<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { getEstablishments, verifyEstablishment } from '@/api/establishments.api';
import PageHeader from '@/components/common/PageHeader.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Establishment, PaginatedResponse } from '@/types/api';

const filters = reactive({
  search: '',
  city: '',
  listingStatus: 'pending' as 'pending' | 'verified' | 'rejected',
});

const loading = ref(false);
const updatingId = ref<string | null>(null);
const errorMessage = ref('');
const successMessage = ref('');
const establishments = ref<Establishment[]>([]);
const pagination = ref<PaginatedResponse<Establishment>['meta'] | null>(null);

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
    await verifyEstablishment(id, status);
    successMessage.value = `Establishment has been ${status}.`;
    await load();
  } catch {
    errorMessage.value = 'Failed to update listing status.';
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
      subtitle="Approve legitimate listings and reject incomplete or suspicious submissions."
    />

    <Card class="mb-5 shadow-panel">
      <CardContent class="grid gap-3 p-4 md:grid-cols-4">
        <Input v-model="filters.search" class="h-11" placeholder="Search by name, address, or city" />
        <Input v-model="filters.city" class="h-11" placeholder="Filter by city" />
        <select
          v-model="filters.listingStatus"
          class="h-11 rounded-md border bg-background px-3 text-base"
        >
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

    <Card class="shadow-panel">
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="loading">
              <TableCell colspan="5" class="py-8 text-center text-muted-foreground">Loading...</TableCell>
            </TableRow>
            <TableRow v-else-if="!establishments.length">
              <TableCell colspan="5" class="py-8 text-center text-muted-foreground">No records found.</TableCell>
            </TableRow>
            <TableRow v-for="item in establishments" :key="item.id">
              <TableCell>
                <div class="font-semibold">{{ item.name }}</div>
                <div class="text-sm text-muted-foreground">{{ item.address }}</div>
              </TableCell>
              <TableCell>{{ item.city }}</TableCell>
              <TableCell class="capitalize">{{ item.category.replace('_', ' ') }}</TableCell>
              <TableCell>
                <Badge
                  :variant="item.listingStatus === 'verified' ? 'default' : item.listingStatus === 'rejected' ? 'destructive' : 'secondary'"
                >
                  {{ item.listingStatus }}
                </Badge>
              </TableCell>
              <TableCell class="space-x-2 text-right">
                <Button
                  size="sm"
                  class="h-9"
                  :disabled="updatingId === item.id || item.listingStatus === 'verified'"
                  @click="verify(item.id, 'verified')"
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  class="h-9"
                  :disabled="updatingId === item.id || item.listingStatus === 'rejected'"
                  @click="verify(item.id, 'rejected')"
                >
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <p v-if="pagination" class="mt-3 text-sm text-muted-foreground">
      Showing {{ establishments.length }} of {{ pagination.total }} record(s)
    </p>
  </div>
</template>
