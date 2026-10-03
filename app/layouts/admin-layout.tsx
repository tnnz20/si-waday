import { Outlet } from 'react-router';

import { Toaster } from '@/components/ui/sonner';

export default function AdminLayout() {
  return (
    <div className="bg-warm-100 text-darknavy-900 selection:bg-accent-500 min-h-dvh font-sans antialiased selection:text-white">
      <Outlet />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
