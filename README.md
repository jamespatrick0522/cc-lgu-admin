# City Connect LGU Admin Frontend

Vue 3 + Vite + Tailwind + shadcn-vue admin console for LGU users.

## Stack

- Vue 3 + TypeScript
- Vue Router + Pinia
- Axios API client
- Tailwind CSS + shadcn-vue components
- Light, high-contrast theme optimized for middle-aged to older staff

## Theme

- Primary: `#C62839`
- Secondary: `#2E86AB`
- Accent: `#F4B942`
- Success: `#4F8A5B`
- Background: `#F7F1E8`
- Text: `#2F2623`

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Required Backend APIs (LGU Admin)

- `POST /auth/login`
- `GET /admin/dashboard`
- `GET /establishments`
- `PATCH /establishments/:id/verify`
- `GET /reports`
- `PATCH /reports/:id/resolve`
- `GET /announcements`
- `POST /announcements`
- `GET /health`

## WebSocket Notes

The backend chat namespace uses `/chat` and expects JWT in socket handshake for admin-level joins.
