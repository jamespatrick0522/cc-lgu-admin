<template>
  <main class="flex min-h-screen items-center justify-center bg-background px-4">
    <div class="text-center">
      <p class="text-sm uppercase tracking-wide text-muted-foreground">404</p>
      <h1 class="mt-2 text-4xl font-bold text-primary">Page Not Found</h1>
      <p class="mt-3 text-base text-muted-foreground">The page you are looking for does not exist.</p>
      <RouterLink
        to="/"
        class="mt-5 inline-flex h-11 items-center rounded-md bg-primary px-6 text-base font-semibold text-primary-foreground"
      >
        Return to Dashboard
      </RouterLink>
    </div>
  </main>
</template>
