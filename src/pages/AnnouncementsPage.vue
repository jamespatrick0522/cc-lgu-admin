<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { createAnnouncement, getAnnouncements } from '@/api/announcements.api';
import PageHeader from '@/components/common/PageHeader.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Announcement } from '@/types/api';

const announcements = ref<Announcement[]>([]);
const loading = ref(false);
const submitting = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

const form = reactive({
  city: '',
  title: '',
  content: '',
  startsAt: '',
  endsAt: '',
});

async function load() {
  loading.value = true;

  try {
    announcements.value = await getAnnouncements(undefined, 50);
  } finally {
    loading.value = false;
  }
}

async function submitAnnouncement() {
  submitting.value = true;
  message.value = '';

  try {
    await createAnnouncement({
      city: form.city.trim(),
      title: form.title.trim(),
      content: form.content.trim(),
      startsAt: form.startsAt || undefined,
      endsAt: form.endsAt || undefined,
    });

    messageType.value = 'success';
    message.value = 'Announcement published successfully.';

    form.city = '';
    form.title = '';
    form.content = '';
    form.startsAt = '';
    form.endsAt = '';

    await load();
  } catch {
    messageType.value = 'error';
    message.value = 'Failed to publish announcement.';
  } finally {
    submitting.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <PageHeader
      title="Announcements"
      subtitle="Post clear advisories for residents and tourists with city-targeted messaging."
    />

    <div class="grid gap-5 xl:grid-cols-[1fr_1.2fr]">
      <Card class="shadow-panel">
        <CardHeader>
          <CardTitle class="text-xl">Publish New Advisory</CardTitle>
        </CardHeader>
        <CardContent>
          <form class="space-y-4" @submit.prevent="submitAnnouncement">
            <div class="space-y-2">
              <Label class="text-base">City</Label>
              <Input v-model="form.city" class="h-11" placeholder="e.g. Quezon City" required />
            </div>

            <div class="space-y-2">
              <Label class="text-base">Title</Label>
              <Input v-model="form.title" class="h-11" placeholder="Road closure advisory" required />
            </div>

            <div class="space-y-2">
              <Label class="text-base">Content</Label>
              <Textarea
                v-model="form.content"
                class="min-h-[160px]"
                placeholder="Provide clear, plain-language details..."
                required
              />
            </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <div class="space-y-2">
                <Label class="text-base">Starts At (optional)</Label>
                <Input v-model="form.startsAt" type="datetime-local" class="h-11" />
              </div>
              <div class="space-y-2">
                <Label class="text-base">Ends At (optional)</Label>
                <Input v-model="form.endsAt" type="datetime-local" class="h-11" />
              </div>
            </div>

            <div
              v-if="message"
              class="rounded-lg px-4 py-3 text-sm"
              :class="
                messageType === 'success'
                  ? 'border border-success/40 bg-success/10 text-success'
                  : 'border border-destructive/30 bg-destructive/10 text-destructive'
              "
            >
              {{ message }}
            </div>

            <Button class="h-11 w-full text-base" :disabled="submitting">
              {{ submitting ? 'Publishing...' : 'Publish Announcement' }}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card class="shadow-panel">
        <CardHeader>
          <CardTitle class="text-xl">Published Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="loading" class="rounded-lg border bg-muted/40 p-4 text-base text-muted-foreground">
            Loading announcements...
          </div>

          <div v-else-if="!announcements.length" class="rounded-lg border bg-muted/40 p-4 text-base text-muted-foreground">
            No announcements published yet.
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
              <p class="mb-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {{ item.content }}
              </p>
              <p class="text-xs text-muted-foreground">
                Posted: {{ new Date(item.createdAt).toLocaleString() }}
              </p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
