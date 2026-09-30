import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('layouts/home-layout.tsx', [
    index('routes/home.tsx'),
    route('aspiration', 'routes/aspiration.tsx'),
  ]),
] satisfies RouteConfig;
