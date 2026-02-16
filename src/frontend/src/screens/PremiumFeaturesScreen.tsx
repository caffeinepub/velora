import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, MessageSquare, BookOpen, Headphones } from 'lucide-react';
import { useCheckPremiumStatus, useSetPremiumUser } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { toast } from 'sonner';
import AuthButton from '@/components/auth/AuthButton';

export default function PremiumFeaturesScreen() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isPremium, isLoading } = useCheckPremiumStatus();
  const setPremium = useSetPremiumUser();
  const [activeTab, setActiveTab] = useState('text-softly');

  const isAuthenticated = !!identity;

  const handleUnlock = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to upgrade to Premium');
      return;
    }

    try {
      await setPremium.mutateAsync();
      toast.success('Welcome to Premium! 🌸');
    } catch (error) {
      toast.error('Failed to upgrade. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-cream flex items-center justify-center">
        <p className="text-foreground/70">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-cream py-8 px-4">
      <div className="container max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Premium Features
          </h1>
          <p className="text-lg text-foreground/70">
            Unlock the full Velora experience
          </p>
        </div>

        {!isAuthenticated && (
          <Card className="p-6 bg-blush/20 border-rose text-center space-y-4">
            <p className="text-foreground/70">
              Sign in to access Premium features
            </p>
            <AuthButton />
          </Card>
        )}

        {!isPremium && isAuthenticated && (
          <Card className="p-8 gradient-blush border-rose text-center space-y-6 soft-shadow-lg fade-in">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                Unlock Full Program – ₦2,500/month
              </h2>
              <ul className="text-left max-w-md mx-auto space-y-2 text-foreground/80">
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  All 30 days of the program
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  Text Softly message generator
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  Private journal with unlimited entries
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-2">✓</span>
                  Audio lessons for deeper learning
                </li>
              </ul>
            </div>
            <Button
              onClick={handleUnlock}
              disabled={setPremium.isPending}
              size="lg"
              className="gradient-gold text-foreground hover:opacity-90 rounded-full px-12 py-6 text-lg font-medium soft-shadow-lg"
            >
              {setPremium.isPending ? 'Unlocking...' : 'Unlock Premium'}
            </Button>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-blush/20 border border-rose/30 rounded-2xl p-1">
            <TabsTrigger
              value="text-softly"
              className="rounded-xl data-[state=active]:bg-blush data-[state=active]:text-foreground"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Text Softly
            </TabsTrigger>
            <TabsTrigger
              value="journal"
              className="rounded-xl data-[state=active]:bg-blush data-[state=active]:text-foreground"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Journal
            </TabsTrigger>
            <TabsTrigger
              value="audio"
              className="rounded-xl data-[state=active]:bg-blush data-[state=active]:text-foreground"
            >
              <Headphones className="w-4 h-4 mr-2" />
              Audio Lessons
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text-softly" className="mt-6">
            {isPremium ? (
              <Card className="p-8 bg-cream border-rose/30 text-center space-y-4">
                <MessageSquare className="w-12 h-12 mx-auto text-blush" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Text Softly Generator
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    Generate thoughtful messages for any situation
                  </p>
                </div>
                <Button
                  onClick={() => navigate({ to: '/text-softly' })}
                  className="bg-blush text-foreground hover:bg-blush/90 rounded-full"
                >
                  Open Text Softly
                </Button>
              </Card>
            ) : (
              <LockedFeature feature="Text Softly" />
            )}
          </TabsContent>

          <TabsContent value="journal" className="mt-6">
            {isPremium ? (
              <Card className="p-8 bg-cream border-rose/30 text-center space-y-4">
                <BookOpen className="w-12 h-12 mx-auto text-blush" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Private Journal
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    Reflect on your journey with private entries
                  </p>
                </div>
                <Button
                  onClick={() => navigate({ to: '/journal' })}
                  className="bg-blush text-foreground hover:bg-blush/90 rounded-full"
                >
                  Open Journal
                </Button>
              </Card>
            ) : (
              <LockedFeature feature="Journal" />
            )}
          </TabsContent>

          <TabsContent value="audio" className="mt-6">
            {isPremium ? (
              <Card className="p-8 bg-cream border-rose/30 space-y-4">
                <div className="text-center mb-6">
                  <Headphones className="w-12 h-12 mx-auto text-blush mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Audio Lessons
                  </h3>
                  <p className="text-foreground/70">
                    Listen and learn on the go
                  </p>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Card
                      key={num}
                      className="p-4 bg-blush/20 border-rose/30 hover:bg-blush/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">
                            Lesson {num}: Finding Your Voice
                          </h4>
                          <p className="text-sm text-foreground/60">12 minutes</p>
                        </div>
                        <Headphones className="w-5 h-5 text-gold" />
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            ) : (
              <LockedFeature feature="Audio Lessons" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function LockedFeature({ feature }: { feature: string }) {
  return (
    <Card className="p-8 bg-blush/10 border-rose/30 text-center space-y-4">
      <img
        src="/assets/generated/icon-padlock-softrose.dim_128x128.png"
        alt="Locked"
        className="w-16 h-16 mx-auto opacity-60"
      />
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {feature} is Premium Only
        </h3>
        <p className="text-foreground/70">
          Upgrade to Premium to unlock this feature
        </p>
      </div>
    </Card>
  );
}
