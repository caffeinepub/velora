import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, RefreshCw } from 'lucide-react';
import { TextCategory } from '@/backend';
import { textSoftlyMessages } from '@/data/textSoftlyMessages';
import { useCheckPremiumStatus, useAddFavorite, useGetFavorites, useDeleteFavorite } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { toast } from 'sonner';
import PremiumGate from '@/components/premium/PremiumGate';

const categories: { value: TextCategory; label: string; emoji: string }[] = [
  { value: TextCategory.pullAway, label: 'Pull Away', emoji: '🌙' },
  { value: TextCategory.flirty, label: 'Flirty', emoji: '💕' },
  { value: TextCategory.apology, label: 'Apology', emoji: '🌸' },
  { value: TextCategory.missingYou, label: 'Missing You', emoji: '💭' },
  { value: TextCategory.boundaries, label: 'Boundaries', emoji: '🛡️' }
];

export default function TextSoftlyScreen() {
  const { identity } = useInternetIdentity();
  const { data: isPremium } = useCheckPremiumStatus();
  const { data: favorites = [] } = useGetFavorites();
  const addFavorite = useAddFavorite();
  const deleteFavorite = useDeleteFavorite();

  const [selectedCategory, setSelectedCategory] = useState<TextCategory | null>(null);
  const [currentMessage, setCurrentMessage] = useState<string>('');

  const isAuthenticated = !!identity;

  const generateMessage = (category: TextCategory) => {
    const messages = textSoftlyMessages[category];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setCurrentMessage(randomMessage);
    setSelectedCategory(category);
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save favorites');
      return;
    }

    if (!selectedCategory || !currentMessage) return;

    const existingFavorite = favorites.find(
      (fav) => fav.message === currentMessage && fav.category === selectedCategory
    );

    try {
      if (existingFavorite) {
        await deleteFavorite.mutateAsync(existingFavorite.id);
        toast.success('Removed from favorites');
      } else {
        await addFavorite.mutateAsync({ category: selectedCategory, message: currentMessage });
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const isFavorited = favorites.some(
    (fav) => fav.message === currentMessage && fav.category === selectedCategory
  );

  return (
    <PremiumGate>
      <div className="min-h-screen gradient-cream py-8 px-4">
        <div className="container max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Text Softly
            </h1>
            <p className="text-lg text-foreground/70">
              Generate thoughtful messages for any situation
            </p>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Card
                key={category.value}
                onClick={() => generateMessage(category.value)}
                className={`p-6 cursor-pointer transition-all hover:scale-105 text-center soft-shadow ${
                  selectedCategory === category.value
                    ? 'bg-blush border-rose border-2'
                    : 'bg-cream border-rose/50 hover:border-rose'
                }`}
              >
                <div className="text-3xl mb-2">{category.emoji}</div>
                <h3 className="text-sm font-semibold text-foreground">
                  {category.label}
                </h3>
              </Card>
            ))}
          </div>

          {/* Message Display */}
          {currentMessage && (
            <Card className="p-8 bg-blush border-rose soft-shadow-lg fade-in">
              <div className="relative">
                {/* Speech bubble */}
                <div className="bg-cream rounded-3xl p-6 relative">
                  <p className="text-foreground/90 leading-relaxed">
                    {currentMessage}
                  </p>
                  {/* Bubble tail */}
                  <div className="absolute -bottom-2 left-8 w-4 h-4 bg-cream transform rotate-45" />
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-6">
                  <Button
                    onClick={() => selectedCategory && generateMessage(selectedCategory)}
                    variant="outline"
                    className="rounded-full border-gold text-gold hover:bg-gold/10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate New
                  </Button>

                  <Button
                    onClick={handleToggleFavorite}
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-rose/20"
                    disabled={addFavorite.isPending || deleteFavorite.isPending}
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        isFavorited ? 'fill-rose text-rose' : 'text-rose'
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Your Favorites</h2>
              <div className="space-y-3">
                {favorites.map((favorite) => (
                  <Card
                    key={favorite.id.toString()}
                    className="p-4 bg-cream border-rose/30 hover:bg-blush/10 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-foreground/60 mb-1">
                          {categories.find((c) => c.value === favorite.category)?.label}
                        </p>
                        <p className="text-foreground/90">{favorite.message}</p>
                      </div>
                      <Button
                        onClick={() => deleteFavorite.mutate(favorite.id)}
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-rose/20 flex-shrink-0"
                      >
                        <Heart className="w-5 h-5 fill-rose text-rose" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PremiumGate>
  );
}
