import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { login, type LoginPayload } from '@/api/auth.api';
import type { AuthUser } from '@/types/api';

const TOKEN_KEY = 'lgu_admin_token';
const USER_KEY = 'lgu_admin_user';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
  const user = ref<AuthUser | null>(
    localStorage.getItem(USER_KEY) ? JSON.parse(localStorage.getItem(USER_KEY) as string) : null,
  );

  const isAuthenticated = computed(() => Boolean(token.value));
  const isLguAdmin = computed(() => user.value?.role === 'lgu_admin');

  async function signIn(payload: LoginPayload) {
    const response = await login(payload);

    if (response.user.role !== 'lgu_admin') {
      throw new Error('Only LGU admin accounts can access this dashboard.');
    }

    token.value = response.accessToken;
    user.value = response.user;

    localStorage.setItem(TOKEN_KEY, response.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
  }

  function signOut() {
    token.value = null;
    user.value = null;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  return {
    token,
    user,
    isAuthenticated,
    isLguAdmin,
    signIn,
    signOut,
  };
});
