import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useGetJournalEntries, useAddJournalEntry, useDeleteJournalEntry } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { toast } from 'sonner';
import PremiumGate from '@/components/premium/PremiumGate';

export default function JournalScreen() {
  const { identity } = useInternetIdentity();
  const { data: entries = [] } = useGetJournalEntries();
  const addEntry = useAddJournalEntry();
  const deleteEntry = useDeleteJournalEntry();

  const [isWriting, setIsWriting] = useState(false);
  const [newEntryContent, setNewEntryContent] = useState('');

  const isAuthenticated = !!identity;

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save journal entries');
      return;
    }

    if (!newEntryContent.trim()) {
      toast.error('Please write something before saving');
      return;
    }

    try {
      await addEntry.mutateAsync(newEntryContent);
      toast.success('Entry saved');
      setNewEntryContent('');
      setIsWriting(false);
    } catch (error) {
      toast.error('Failed to save entry');
    }
  };

  const handleDelete = async (entryId: bigint) => {
    try {
      await deleteEntry.mutateAsync(entryId);
      toast.success('Entry deleted');
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  return (
    <PremiumGate>
      <div className="min-h-screen gradient-cream py-8 px-4">
        <div className="container max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              My Private Thoughts
            </h1>
            <p className="text-lg text-foreground/70">
              A safe space for your reflections
            </p>
          </div>

          {/* Add Entry Button */}
          {!isWriting && (
            <Card
              onClick={() => setIsWriting(true)}
              className="p-6 bg-blush border-rose cursor-pointer hover:bg-blush/90 transition-all soft-shadow text-center"
            >
              <div className="flex items-center justify-center gap-2 text-gold">
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add Entry</span>
              </div>
            </Card>
          )}

          {/* New Entry Form */}
          {isWriting && (
            <Card className="p-8 bg-cream border-rose soft-shadow-lg fade-in">
              <div className="space-y-4">
                <Textarea
                  value={newEntryContent}
                  onChange={(e) => setNewEntryContent(e.target.value)}
                  placeholder="What's on your mind today?"
                  className="min-h-[200px] lined-paper bg-transparent border-none resize-none focus-visible:ring-0 text-foreground/90"
                  autoFocus
                />
                <div className="flex justify-end gap-3">
                  <Button
                    onClick={() => {
                      setIsWriting(false);
                      setNewEntryContent('');
                    }}
                    variant="outline"
                    className="rounded-full border-rose text-rose hover:bg-rose/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={addEntry.isPending}
                    className="bg-rose text-foreground hover:bg-rose/90 rounded-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {addEntry.isPending ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Entries List */}
          {entries.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Your Entries</h2>
              <div className="space-y-4">
                {entries.map((entry) => (
                  <Card
                    key={entry.id.toString()}
                    className="p-6 bg-cream border-rose/30 soft-shadow hover:shadow-soft-lg transition-shadow"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm text-foreground/60">
                          {new Date(Number(entry.timestamp)).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <Button
                          onClick={() => handleDelete(entry.id)}
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-rose/20 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4 text-rose" />
                        </Button>
                      </div>
                      <p className="text-foreground/90 whitespace-pre-line leading-relaxed">
                        {entry.content}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {entries.length === 0 && !isWriting && (
            <Card className="p-12 bg-blush/10 border-rose/30 text-center">
              <p className="text-foreground/60">
                No entries yet. Start writing to capture your thoughts.
              </p>
            </Card>
          )}
        </div>
      </div>
    </PremiumGate>
  );
}
