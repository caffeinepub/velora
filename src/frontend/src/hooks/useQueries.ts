import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, RelationshipStatus, TextCategory } from '@/backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched
  };
}

export function useUpdateStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: RelationshipStatus) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateStatus(status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}

export function useUpdateNickname() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nickname: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateNickname(nickname);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}

// Premium Queries
export function useCheckPremiumStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['premiumStatus'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.checkPremiumStatus();
    },
    enabled: !!actor && !actorFetching,
    retry: false
  });
}

export function useSetPremiumUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.setPremiumUser();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['premiumStatus'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    }
  });
}

// Favorites Queries
export function useGetFavorites() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFavorites();
    },
    enabled: !!actor && !actorFetching,
    retry: false
  });
}

export function useAddFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ category, message }: { category: TextCategory; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFavorite(category, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    }
  });
}

export function useDeleteFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (favoriteId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteFavorite(favoriteId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    }
  });
}

// Journal Queries
export function useGetJournalEntries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['journalEntries'],
    queryFn: async () => {
      if (!actor) return [];
      const entries = await actor.getJournalEntries();
      // Add client-side timestamp since backend doesn't set it
      return entries.map((entry) => ({
        ...entry,
        timestamp: entry.timestamp || BigInt(Date.now())
      }));
    },
    enabled: !!actor && !actorFetching,
    retry: false
  });
}

export function useAddJournalEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addJournalEntry(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
    }
  });
}

export function useDeleteJournalEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteJournalEntry(entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
    }
  });
}
