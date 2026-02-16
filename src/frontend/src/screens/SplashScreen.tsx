import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-blush flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative floral accent */}
      <img
        src="/assets/generated/floral-corner-accent.dim_512x512.png"
        alt=""
        className="absolute top-0 right-0 w-48 h-48 opacity-30"
      />
      <img
        src="/assets/generated/floral-corner-accent.dim_512x512.png"
        alt=""
        className="absolute bottom-0 left-0 w-48 h-48 opacity-30 rotate-180"
      />

      <div className="text-center space-y-8 fade-in relative z-10">
        <div className="space-y-2">
          <h1 className="text-6xl md:text-7xl font-bold text-foreground tracking-tight">
            Velora
          </h1>
          <div className="h-1 w-24 mx-auto gradient-gold rounded-full" />
        </div>

        <p className="text-2xl md:text-3xl font-script text-rose">
          Love deeply. Stay whole.
        </p>

        <div className="pt-8">
          <Button
            onClick={() => navigate({ to: '/welcome' })}
            size="lg"
            className="bg-cream text-blush hover:bg-cream/90 rounded-full px-8 py-6 text-lg font-medium soft-shadow-lg transition-all hover:scale-105"
          >
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
}
