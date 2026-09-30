import { Outlet } from 'react-router';

import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { Toaster } from '@/components/ui/sonner';

export default function HomeLayout() {
  return (
    <div className="bg-background text-foreground selection:bg-accent-500 flex min-h-dvh flex-col overflow-x-hidden selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
