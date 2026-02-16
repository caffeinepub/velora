import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RelationshipStatus } from '@/backend';
import { useUpdateStatus } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import AuthButton from '@/components/auth/AuthButton';

const statusOptions: { value: RelationshipStatus; label: string; description: string }[] = [
  { value: RelationshipStatus.single, label: 'Single', description: 'Embracing self-love' },
  { value: RelationshipStatus.inRelationship, label: 'In a relationship', description: 'Growing together' },
  { value: RelationshipStatus.healing, label: 'Healing', description: 'Finding peace' },
  { value: RelationshipStatus.married, label: 'Married', description: 'Deepening connection' }
];

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [selectedStatus, setSelectedStatus] = useState<RelationshipStatus | null>(null);
  const updateStatus = useUpdateStatus();

  const handleContinue = async () => {
    if (!selectedStatus) return;

    if (!identity) {
      toast.error('Please sign in to save your status');
      return;
    }

    try {
      await updateStatus.mutateAsync(selectedStatus);
      toast.success('Status saved!');
      navigate({ to: '/daily-program' });
    } catch (error) {
      toast.error('Failed to save status. Please try again.');
    }
  };

  return (
    <div className="min-h-screen gradient-cream flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8 fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Welcome to Velora
          </h1>
          <p className="text-lg text-foreground/70">
            Let's personalize your journey. How would you describe your current relationship status?
          </p>
        </div>

        {!identity && (
          <Card className="p-6 bg-blush/20 border-rose text-center">
            <p className="text-sm text-foreground/70 mb-4">
              Sign in to save your progress and access all features
            </p>
            <AuthButton />
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statusOptions.map((option) => (
            <Card
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              className={`p-6 cursor-pointer transition-all hover:scale-105 soft-shadow ${
                selectedStatus === option.value
                  ? 'bg-blush border-rose border-2'
                  : 'bg-cream border-rose/50 hover:border-rose'
              }`}
            >
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {option.label}
              </h3>
              <p className="text-sm text-foreground/60">{option.description}</p>
            </Card>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button
            onClick={handleContinue}
            disabled={!selectedStatus || updateStatus.isPending}
            size="lg"
            className="gradient-gold text-foreground hover:opacity-90 rounded-full px-12 py-6 text-lg font-medium soft-shadow-lg disabled:opacity-50"
          >
            {updateStatus.isPending ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
