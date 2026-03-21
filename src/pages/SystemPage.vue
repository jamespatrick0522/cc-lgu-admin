<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { http } from '@/api/http';
import PageHeader from '@/components/common/PageHeader.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const checking = ref(false);
const status = ref<'unknown' | 'ok' | 'degraded'>('unknown');
const dependencies = ref<Record<string, string>>({});

async function checkHealth() {
  checking.value = true;

  try {
    const { data } = await http.get('/health');
    status.value = data.status;
    dependencies.value = data.dependencies ?? {};
  } catch {
    status.value = 'degraded';
  } finally {
    checking.value = false;
  }
}

onMounted(checkHealth);
</script>

<template>
  <div>
    <PageHeader
      title="System Status"
      subtitle="Quickly verify API, database, and cache health before handling urgent admin tasks."
    />

    <Card class="max-w-3xl shadow-panel">
      <CardHeader>
        <CardTitle class="text-xl">Backend Health Check</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center gap-3">
          <Badge
            :variant="status === 'ok' ? 'default' : status === 'degraded' ? 'destructive' : 'secondary'"
          >
            {{ status }}
          </Badge>
          <span class="text-sm text-muted-foreground">
            {{ checking ? 'Checking now...' : 'Latest server readiness status.' }}
          </span>
        </div>

        <ul class="space-y-2 text-base">
          <li v-for="(value, key) in dependencies" :key="key" class="flex items-center justify-between rounded-md border px-3 py-2">
            <span class="capitalize">{{ key }}</span>
            <Badge :variant="value === 'up' ? 'default' : 'destructive'">{{ value }}</Badge>
          </li>
        </ul>

        <Button class="h-11 text-base" variant="secondary" :disabled="checking" @click="checkHealth">
          {{ checking ? 'Checking...' : 'Run Health Check Again' }}
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
