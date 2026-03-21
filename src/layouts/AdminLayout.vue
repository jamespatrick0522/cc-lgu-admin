<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  Bell,
  Building2,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/establishments', label: 'Establishment Verification', icon: Building2 },
  { to: '/reports', label: 'Reports Moderation', icon: TriangleAlert },
  { to: '/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/system', label: 'System Status', icon: ShieldCheck },
];

const fullName = computed(() => {
  if (!authStore.user) {
    return 'LGU Admin';
  }

  return `${authStore.user.firstName} ${authStore.user.lastName}`;
});

function isActive(path: string): boolean {
  return path === '/' ? route.path === '/' : route.path.startsWith(path);
}

function logout() {
  authStore.signOut();
  router.push('/login');
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 md:grid-cols-[300px_1fr]">
      <aside class="hidden border-r bg-card/60 md:block">
        <div class="flex h-full flex-col p-6">
          <div>
            <p class="text-sm font-semibold uppercase tracking-wide text-secondary">City Connect</p>
            <h1 class="mt-2 text-2xl font-bold leading-tight text-primary">LGU Admin Console</h1>
            <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
              Designed for clear, readable operations and quick moderation decisions.
            </p>
          </div>

          <Separator class="my-6" />

          <nav class="space-y-2">
            <RouterLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition"
              :class="[
                isActive(item.to)
                  ? 'bg-primary text-primary-foreground shadow-panel'
                  : 'text-foreground hover:bg-muted',
              ]"
            >
              <component :is="item.icon" class="h-5 w-5" />
              {{ item.label }}
            </RouterLink>
          </nav>

          <div class="mt-auto rounded-xl border bg-background p-4">
            <p class="text-sm text-muted-foreground">Signed in as</p>
            <p class="text-lg font-semibold text-foreground">{{ fullName }}</p>
            <Button class="mt-3 h-11 w-full justify-center text-base" variant="secondary" @click="logout">
              <LogOut class="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <main class="flex min-h-screen flex-col">
        <header class="border-b bg-card/80 px-4 py-4 backdrop-blur-sm sm:px-6">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2 md:hidden">
              <Sheet>
                <SheetTrigger as-child>
                  <Button variant="outline" size="icon" class="h-11 w-11">
                    <Menu class="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" class="w-[320px] p-0">
                  <SheetHeader class="px-5 pt-5 text-left">
                    <SheetTitle class="text-xl text-primary">LGU Admin Console</SheetTitle>
                    <SheetDescription class="text-sm">
                      Quick access to moderation and advisory tools.
                    </SheetDescription>
                  </SheetHeader>
                  <div class="px-4 pb-5 pt-3">
                    <nav class="space-y-2">
                      <RouterLink
                        v-for="item in navItems"
                        :key="item.to"
                        :to="item.to"
                        class="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition"
                        :class="[
                          isActive(item.to)
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted',
                        ]"
                      >
                        <component :is="item.icon" class="h-5 w-5" />
                        {{ item.label }}
                      </RouterLink>
                    </nav>
                    <Button class="mt-5 h-11 w-full text-base" variant="secondary" @click="logout">
                      <LogOut class="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div>
              <p class="text-sm text-muted-foreground">Welcome back,</p>
              <h2 class="text-xl font-semibold text-foreground">{{ fullName }}</h2>
            </div>

            <div class="flex items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm">
              <Bell class="h-4 w-4 text-accent" />
              <span>Light, high-contrast mode enabled</span>
            </div>
          </div>
        </header>

        <section class="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <RouterView />
        </section>
      </main>
    </div>
  </div>
</template>
