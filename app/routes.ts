import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('layouts/home-layout.tsx', [
    index('routes/home.tsx'),
    route('aspiration', 'routes/aspiration.tsx'),
  ]),
  layout('layouts/auth-layout.tsx', [
    route('auth/login', 'routes/login.tsx'),
    route('auth/logout', 'routes/logout.tsx'),
  ]),
  layout('layouts/admin-layout.tsx', [route('dashboard', 'routes/admin.tsx')]),
] satisfies RouteConfig;
