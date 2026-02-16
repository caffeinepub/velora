import { Outlet } from '@tanstack/react-router';
import AppHeader from './AppHeader';
import { Toaster } from '@/components/ui/sonner';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
