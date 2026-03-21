<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { getReports, resolveReport } from '@/api/reports.api';
import PageHeader from '@/components/common/PageHeader.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ReportItem } from '@/types/api';

const statusFilter = ref<'open' | 'resolved'>('open');
const reports = ref<ReportItem[]>([]);
const loading = ref(false);
const workingId = ref<string | null>(null);
const errorMessage = ref('');
const successMessage = ref('');

async function load() {
  loading.value = true;
  errorMessage.value = '';

  try {
    reports.value = await getReports({
      status: statusFilter.value,
      limit: 100,
    });
  } catch {
    errorMessage.value = 'Failed to load reports.';
  } finally {
    loading.value = false;
  }
}

async function resolve(id: string) {
  workingId.value = id;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    await resolveReport(id);
    successMessage.value = 'Report resolved successfully.';
    await load();
  } catch {
    errorMessage.value = 'Failed to resolve report.';
  } finally {
    workingId.value = null;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <PageHeader
      title="Reports Moderation"
      subtitle="Handle spam/fake/inappropriate reports quickly to protect platform quality."
    />

    <div class="mb-4 flex flex-wrap items-center gap-3">
      <select
        v-model="statusFilter"
        class="h-11 rounded-md border bg-background px-3 text-base"
        @change="load"
      >
        <option value="open">Open</option>
        <option value="resolved">Resolved</option>
      </select>
      <Button class="h-11 text-base" variant="secondary" @click="load">Refresh</Button>
    </div>

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
              <TableHead>Reason</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="loading">
              <TableCell colspan="4" class="py-8 text-center text-muted-foreground">Loading...</TableCell>
            </TableRow>
            <TableRow v-else-if="!reports.length">
              <TableCell colspan="4" class="py-8 text-center text-muted-foreground">No reports found.</TableCell>
            </TableRow>
            <TableRow v-for="item in reports" :key="item.id">
              <TableCell class="font-semibold">{{ item.reason }}</TableCell>
              <TableCell class="max-w-[580px] whitespace-pre-wrap text-sm text-muted-foreground">
                {{ item.details || 'No extra details provided.' }}
              </TableCell>
              <TableCell>
                <Badge :variant="item.status === 'open' ? 'secondary' : 'default'">
                  {{ item.status }}
                </Badge>
              </TableCell>
              <TableCell class="text-right">
                <Button
                  v-if="item.status === 'open'"
                  size="sm"
                  class="h-9"
                  :disabled="workingId === item.id"
                  @click="resolve(item.id)"
                >
                  Mark Resolved
                </Button>
                <span v-else class="text-sm text-muted-foreground">Resolved</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
