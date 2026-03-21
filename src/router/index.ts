import { createRouter, createWebHistory } from 'vue-router';

import AdminLayout from '@/layouts/AdminLayout.vue';
import AnnouncementsPage from '@/pages/AnnouncementsPage.vue';
import DashboardPage from '@/pages/DashboardPage.vue';
import EstablishmentsPage from '@/pages/EstablishmentsPage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import ReportsPage from '@/pages/ReportsPage.vue';
import SystemPage from '@/pages/SystemPage.vue';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'dashboard', component: DashboardPage },
        { path: 'establishments', name: 'establishments', component: EstablishmentsPage },
        { path: 'reports', name: 'reports', component: ReportsPage },
        { path: 'announcements', name: 'announcements', component: AnnouncementsPage },
        { path: 'system', name: 'system', component: SystemPage },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage,
    },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && (!authStore.isAuthenticated || !authStore.isLguAdmin)) {
    return { name: 'login' };
  }

  if (to.name === 'login' && authStore.isAuthenticated && authStore.isLguAdmin) {
    return { name: 'dashboard' };
  }

  return true;
});

export default router;
