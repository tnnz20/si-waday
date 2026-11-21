import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

export default [
  layout('layouts/home-layout.tsx', [index('routes/home.tsx')]),
  layout('layouts/form-layout.tsx', [
    ...prefix('form', [
      route('aspiration', 'routes/form/aspiration.tsx'),
      route('complaint', 'routes/form/complaint.tsx'),
    ]),
  ]),
  layout('layouts/auth-layout.tsx', [
    route('auth/login', 'routes/auth/login.tsx'),
    route('auth/logout', 'routes/auth/logout.tsx'),
  ]),
  layout('layouts/admin-layout.tsx', [
    route('dashboard', 'routes/dashboard/overview.tsx'),
    route('dashboard/complaints', 'routes/dashboard/complaints.tsx'),
    route('dashboard/aspirations', 'routes/dashboard/aspirations.tsx'),
    route('dashboard/satisfaction', 'routes/dashboard/satisfaction.tsx'),
    ...prefix('dashboard/users', [
      route('legislators', 'routes/dashboard/users-legislators.tsx'),
      route('legislators/:slug', 'routes/dashboard/users-legislators-detail.tsx'),
      route('moderators', 'routes/dashboard/users-moderators.tsx'),
      route('moderators/:slug', 'routes/dashboard/users-moderators-detail.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
