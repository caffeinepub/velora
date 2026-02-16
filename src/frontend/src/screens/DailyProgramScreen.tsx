import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { program30Days } from '@/data/program30Days';
import { useCheckPremiumStatus } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

export default function DailyProgramScreen() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isPremium, isLoading: premiumLoading } = useCheckPremiumStatus();
  const [currentDay, setCurrentDay] = useState(1);
  const [fadeKey, setFadeKey] = useState(0);

  const isAuthenticated = !!identity;
  const canAccessDay = isPremium || currentDay <= 3;
  const dayData = program30Days[currentDay - 1];

  useEffect(() => {
    setFadeKey((prev) => prev + 1);
  }, [currentDay]);

  const handlePrevious = () => {
    if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
    }
  };

  const handleNext = () => {
    if (currentDay < 30) {
      const nextDay = currentDay + 1;
      if (!isPremium && nextDay > 3) {
        navigate({ to: '/premium' });
        return;
      }
      setCurrentDay(nextDay);
    }
  };

  if (premiumLoading) {
    return (
      <div className="min-h-screen gradient-cream flex items-center justify-center">
        <p className="text-foreground/70">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-cream py-8 px-4">
      <div className="container max-w-4xl mx-auto space-y-6">
        {/* Day Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentDay === 1}
            variant="ghost"
            size="icon"
            className="rounded-full text-gold hover:bg-gold/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="text-center">
            <p className="text-sm text-foreground/60">Day {currentDay} of 30</p>
            {!isPremium && currentDay > 3 && (
              <p className="text-xs text-rose mt-1">Premium required</p>
            )}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentDay === 30}
            variant="ghost"
            size="icon"
            className="rounded-full text-gold hover:bg-gold/10"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Locked State */}
        {!canAccessDay && (
          <Card className="p-8 bg-blush/20 border-rose text-center space-y-4 soft-shadow">
            <img
              src="/assets/generated/icon-padlock-softrose.dim_128x128.png"
              alt="Locked"
              className="w-16 h-16 mx-auto opacity-60"
            />
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Premium Content
              </h3>
              <p className="text-foreground/70">
                Unlock all 30 days of the program with Premium
              </p>
            </div>
            <Button
              onClick={() => navigate({ to: '/premium' })}
              className="gradient-gold text-foreground hover:opacity-90 rounded-full px-8"
            >
              Unlock Premium
            </Button>
          </Card>
        )}

        {/* Day Content */}
        {canAccessDay && (
          <div key={fadeKey} className="space-y-6 fade-in">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {dayData.title}
              </h1>
            </div>

            {/* Lesson Card */}
            <Card className="p-8 bg-blush border-rose soft-shadow-lg">
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                  {dayData.lesson}
                </p>
              </div>
            </Card>

            {/* Daily Affirmation */}
            <Card className="p-8 bg-cream border-rose/30 text-center soft-shadow">
              <p className="text-sm uppercase tracking-wider text-foreground/60 mb-4">
                Today's Affirmation
              </p>
              <p className="text-2xl md:text-3xl font-script text-rose leading-relaxed">
                {dayData.affirmation}
              </p>
            </Card>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center pt-4">
          <Button
            onClick={handlePrevious}
            disabled={currentDay === 1}
            variant="outline"
            className="rounded-full border-gold text-gold hover:bg-gold/10"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentDay === 30}
            variant="outline"
            className="rounded-full border-gold text-gold hover:bg-gold/10"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
