import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Crown, User, Settings, LogOut } from 'lucide-react';
import { useGetCallerUserProfile, useUpdateNickname } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { toast } from 'sonner';
import AuthButton from '@/components/auth/AuthButton';
import { useQueryClient } from '@tanstack/react-query';

export default function ProfileScreen() {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const updateNickname = useUpdateNickname();

  const [nickname, setNickname] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (userProfile?.nickname) {
      setNickname(userProfile.nickname);
    }
  }, [userProfile]);

  const handleSaveNickname = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save your nickname');
      return;
    }

    if (!nickname.trim()) {
      toast.error('Please enter a nickname');
      return;
    }

    try {
      await updateNickname.mutateAsync(nickname);
      toast.success('Nickname updated');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update nickname');
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    toast.success('Logged out successfully');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-cream flex items-center justify-center">
        <p className="text-foreground/70">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-blush py-8 px-4">
      <div className="container max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-cream rounded-full flex items-center justify-center soft-shadow-lg">
            <User className="w-10 h-10 text-blush" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Profile & Settings
          </h1>
        </div>

        {!isAuthenticated && (
          <Card className="p-6 bg-cream border-rose text-center space-y-4">
            <p className="text-foreground/70">
              Sign in to access your profile and settings
            </p>
            <AuthButton />
          </Card>
        )}

        {isAuthenticated && (
          <>
            {/* User Info */}
            <Card className="p-6 bg-cream border-rose soft-shadow-lg space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">User Information</h2>
                {userProfile?.isPremium && (
                  <Badge className="bg-gold text-foreground">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nickname" className="text-foreground/70">
                    Nickname
                  </Label>
                  {isEditing ? (
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="Enter your nickname"
                        className="bg-background border-rose/30"
                      />
                      <Button
                        onClick={handleSaveNickname}
                        disabled={updateNickname.isPending}
                        className="bg-gold text-foreground hover:bg-gold/90 rounded-full"
                      >
                        {updateNickname.isPending ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          setNickname(userProfile?.nickname || '');
                        }}
                        variant="outline"
                        className="rounded-full border-rose text-rose"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-foreground">
                        {userProfile?.nickname || 'Not set'}
                      </p>
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="ghost"
                        size="sm"
                        className="text-gold hover:bg-gold/10"
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-foreground/70">Relationship Status</Label>
                  <p className="text-foreground mt-2 capitalize">
                    {userProfile?.status
                      ? userProfile.status.toString().replace(/([A-Z])/g, ' $1').trim()
                      : 'Not set'}
                  </p>
                </div>

                <div>
                  <Label className="text-foreground/70">Subscription Status</Label>
                  <p className="text-foreground mt-2">
                    {userProfile?.isPremium ? 'Premium Member' : 'Free Plan'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Settings */}
            <Card className="p-6 bg-cream border-rose soft-shadow-lg space-y-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Settings className="w-5 h-5 text-rose" />
                Settings
              </h2>

              <div className="space-y-2">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-start rounded-full border-rose text-rose hover:bg-rose/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </Card>
          </>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-foreground/60 pt-8">
          <p>
            © {new Date().getFullYear()} Velora. Built with{' '}
            <span className="text-rose">♥</span> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
