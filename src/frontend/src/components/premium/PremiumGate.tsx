import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCheckPremiumStatus } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import AuthButton from '@/components/auth/AuthButton';

interface PremiumGateProps {
  children: ReactNode;
}

export default function PremiumGate({ children }: PremiumGateProps) {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isPremium, isLoading } = useCheckPremiumStatus();

  const isAuthenticated = !!identity;

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-cream flex items-center justify-center">
        <p className="text-foreground/70">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-cream flex items-center justify-center p-6">
        <Card className="p-8 max-w-md bg-blush/20 border-rose text-center space-y-4">
          <img
            src="/assets/generated/icon-padlock-softrose.dim_128x128.png"
            alt="Locked"
            className="w-16 h-16 mx-auto opacity-60"
          />
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Sign In Required
            </h2>
            <p className="text-foreground/70 mb-4">
              Please sign in to access this feature
            </p>
          </div>
          <AuthButton />
        </Card>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="min-h-screen gradient-cream flex items-center justify-center p-6">
        <Card className="p-8 max-w-md bg-blush/20 border-rose text-center space-y-4">
          <img
            src="/assets/generated/icon-padlock-softrose.dim_128x128.png"
            alt="Locked"
            className="w-16 h-16 mx-auto opacity-60"
          />
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Premium Feature
            </h2>
            <p className="text-foreground/70 mb-4">
              Upgrade to Premium to unlock this feature
            </p>
          </div>
          <Button
            onClick={() => navigate({ to: '/premium' })}
            className="gradient-gold text-foreground hover:opacity-90 rounded-full px-8"
          >
            Unlock Premium
          </Button>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
