import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Menu, User, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useGetCallerUserProfile } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Badge } from '@/components/ui/badge';

export default function AppHeader() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  
  const currentPath = routerState.location.pathname;
  const isAuthenticated = !!identity;
  
  // Don't show header on splash screen
  if (currentPath === '/') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-rose/30 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <button
          onClick={() => navigate({ to: '/daily-program' })}
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
        >
          <h1 className="text-2xl font-bold text-blush">Velora</h1>
        </button>

        <div className="flex items-center gap-3">
          {isAuthenticated && userProfile && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-foreground/70">
                {userProfile.nickname || 'Welcome'}
              </span>
              {userProfile.isPremium && (
                <Badge className="bg-gold text-foreground">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-cream border-rose/30">
              <DropdownMenuItem onClick={() => navigate({ to: '/daily-program' })}>
                Daily Program
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: '/premium' })}>
                Premium Features
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: '/profile' })}>
                <User className="w-4 h-4 mr-2" />
                Profile & Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
