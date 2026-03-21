<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Building2, Megaphone, TriangleAlert } from 'lucide-vue-next';

import { getDashboard } from '@/api/admin.api';
import PageHeader from '@/components/common/PageHeader.vue';
import StatCard from '@/components/common/StatCard.vue';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Announcement } from '@/types/api';

const loading = ref(false);
const pendingEstablishments = ref(0);
const verifiedEstablishments = ref(0);
const openReports = ref(0);
const announcements = ref<Announcement[]>([]);

async function loadDashboard() {
  loading.value = true;

  try {
    const dashboard = await getDashboard({ recentLimit: 5 });
    pendingEstablishments.value = dashboard.metrics.pendingEstablishments;
    verifiedEstablishments.value = dashboard.metrics.verifiedEstablishments;
    openReports.value = dashboard.metrics.openReports;
    announcements.value = dashboard.recent.announcements;
  } catch {
    pendingEstablishments.value = 0;
    verifiedEstablishments.value = 0;
    openReports.value = 0;
    announcements.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(loadDashboard);
</script>

<template>
  <div>
    <PageHeader
      title="Dashboard Overview"
      subtitle="Prioritize pending verifications and reports first for safer public listings."
    />

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Pending Establishment Verifications"
        :value="loading ? '...' : pendingEstablishments"
        hint="Review these to keep listings accurate for residents and tourists."
      />
      <StatCard
        label="Open Reports"
        :value="loading ? '...' : openReports"
        hint="Spam/fake/inappropriate listing reports requiring LGU action."
      />
      <StatCard
        label="Verified Establishments"
        :value="loading ? '...' : verifiedEstablishments"
        hint="Total approved business/tourism listings currently visible to users."
      />
      <StatCard
        label="Recent Advisories"
        :value="loading ? '...' : announcements.length"
        hint="Latest city advisories published in the app."
      />
    </div>

    <section class="mt-8 grid gap-4 lg:grid-cols-2">
      <Card class="shadow-panel">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-xl">
            <Building2 class="h-5 w-5 text-secondary" />
            Quick Priorities
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-3 text-base text-muted-foreground">
          <p>
            1. Verify new establishments daily to reduce outdated or fake entries.
          </p>
          <p>
            2. Resolve reports within 24-48 hours to keep public trust high.
          </p>
          <p>
            3. Publish advisories before peak tourism hours (morning / lunch / evening).
          </p>
        </CardContent>
      </Card>

      <Card class="shadow-panel">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-xl">
            <Megaphone class="h-5 w-5 text-accent" />
            Latest Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="!announcements.length" class="rounded-lg border bg-muted/40 p-4 text-base text-muted-foreground">
            No announcements yet.
          </div>

          <ul v-else class="space-y-3">
            <li
              v-for="item in announcements"
              :key="item.id"
              class="rounded-lg border bg-background p-4"
            >
              <div class="mb-2 flex items-center justify-between gap-2">
                <h3 class="text-lg font-semibold">{{ item.title }}</h3>
                <Badge variant="secondary">{{ item.city }}</Badge>
              </div>
              <p class="line-clamp-2 text-base text-muted-foreground">{{ item.content }}</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </section>

    <section class="mt-8">
      <Card class="shadow-panel">
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-xl">
            <TriangleAlert class="h-5 w-5 text-primary" />
            Accessibility Reminder
          </CardTitle>
        </CardHeader>
        <CardContent class="text-base text-muted-foreground">
          Keep announcement titles concise and avoid all caps. Short, plain-language notices are easier
          to understand for older staff and citizens.
        </CardContent>
      </Card>
    </section>
  </div>
</template>
