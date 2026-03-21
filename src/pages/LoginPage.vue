<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { AlertCircle, ShieldCheck } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: '',
});

const loading = ref(false);
const errorMessage = ref('');

async function submit() {
  errorMessage.value = '';
  loading.value = true;

  try {
    await authStore.signIn({
      email: form.email.trim(),
      password: form.password,
    });

    await router.push('/');
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-background px-4 py-8">
    <Card class="w-full max-w-xl border-primary/20 shadow-panel">
      <CardHeader>
        <div class="mb-2 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <ShieldCheck class="h-7 w-7 text-primary" />
        </div>
        <CardTitle class="text-3xl">LGU Admin Login</CardTitle>
        <CardDescription class="text-base leading-relaxed">
          Please sign in with your LGU administrator account to manage establishments, advisories,
          and reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-5" @submit.prevent="submit">
          <div class="space-y-2">
            <Label for="email" class="text-base">Email Address</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              class="h-12 text-base"
              autocomplete="email"
              placeholder="admin@city.gov"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="password" class="text-base">Password</Label>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              class="h-12 text-base"
              autocomplete="current-password"
              placeholder="Enter your password"
              required
            />
          </div>

          <div
            v-if="errorMessage"
            class="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            <AlertCircle class="mt-0.5 h-4 w-4" />
            <span>{{ errorMessage }}</span>
          </div>

          <Button type="submit" class="h-12 w-full text-base font-semibold" :disabled="loading">
            {{ loading ? 'Signing in...' : 'Sign In to Admin Console' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </main>
</template>
