import type {
  BallEvent,
  Contest,
  ContestEntry,
  FantasyTeam,
  LeaderboardEntry,
  Match,
  Player,
  StripeSessionStatus,
  Transaction,
  UserProfile,
} from "@/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// Match hooks

export function useMatches() {
  const { actor } = useActor();
  return useQuery<Match[]>({
    queryKey: ["matches"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMatches() as Promise<Match[]>;
    },
    enabled: !!actor,
  });
}

export function useMatch(id: string) {
  const { actor } = useActor();
  return useQuery<Match | null>({
    queryKey: ["match", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getMatch(BigInt(id)) as Promise<Match | null>;
    },
    enabled: !!actor && !!id,
  });
}

export function usePlayers(matchId: string) {
  const { actor } = useActor();
  return useQuery<Player[]>({
    queryKey: ["players", matchId],
    queryFn: async () => {
      if (!actor || !matchId) return [];
      return actor.getPlayers(BigInt(matchId)) as Promise<Player[]>;
    },
    enabled: !!actor && !!matchId,
  });
}

// Team hooks

export function useCreateTeam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      matchId,
      name,
      playerIds,
      captainId,
      viceCaptainId,
    }: {
      matchId: bigint;
      name: string;
      playerIds: bigint[];
      captainId: bigint;
      viceCaptainId: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createTeam(
        matchId,
        name,
        playerIds,
        captainId,
        viceCaptainId,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTeams"] });
    },
  });
}

export function useMyTeams() {
  const { actor } = useActor();
  return useQuery<FantasyTeam[]>({
    queryKey: ["myTeams"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTeams();
    },
    enabled: !!actor,
  });
}

// Contest hooks

export function useContests(matchId?: string) {
  const { actor } = useActor();
  return useQuery<Contest[]>({
    queryKey: ["contests", matchId],
    queryFn: async () => {
      if (!actor) return [];
      if (matchId) {
        return actor.getContests(BigInt(matchId)) as Promise<Contest[]>;
      }
      return [];
    },
    enabled: !!actor,
    refetchInterval: 30000,
  });
}

export function useContest(id: string) {
  const { actor } = useActor();
  return useQuery<Contest | null>({
    queryKey: ["contest", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getContest(BigInt(id)) as Promise<Contest | null>;
    },
    enabled: !!actor && !!id,
  });
}

export function useJoinContest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      contestId,
      teamId,
    }: {
      contestId: bigint;
      teamId: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.joinContest(contestId, teamId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contests"] });
      queryClient.invalidateQueries({ queryKey: ["contestHistory"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

export function useLeaderboard(contestId: string) {
  const { actor } = useActor();
  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard", contestId],
    queryFn: async () => {
      if (!actor || !contestId) return [];
      return actor.getLeaderboard(BigInt(contestId)) as Promise<
        LeaderboardEntry[]
      >;
    },
    enabled: !!actor && !!contestId,
    refetchInterval: 10000,
  });
}

export function useGetBallHistory(matchId: number) {
  const { actor } = useActor();
  return useQuery<BallEvent[]>({
    queryKey: ["ballHistory", matchId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBallHistory(BigInt(matchId)) as Promise<BallEvent[]>;
    },
    enabled: !!actor,
    refetchInterval: 10000,
  });
}

export function useGetApiKey() {
  const { actor } = useActor();
  return useQuery<string | null>({
    queryKey: ["apiKey"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getApiKey();
    },
    enabled: !!actor,
  });
}

export function useSetApiKey() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (key: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.setApiKey(key);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKey"] });
    },
  });
}

// Wallet hooks

export function useWalletBalance() {
  const { actor } = useActor();
  return useQuery<bigint>({
    queryKey: ["wallet"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getWalletBalance();
    },
    enabled: !!actor,
    refetchInterval: 30000,
  });
}

export function useTransactions() {
  const { actor } = useActor();
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactions() as Promise<Transaction[]>;
    },
    enabled: !!actor,
  });
}

export function useContestHistory() {
  const { actor } = useActor();
  return useQuery<ContestEntry[]>({
    queryKey: ["contestHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getContestHistory() as Promise<ContestEntry[]>;
    },
    enabled: !!actor,
  });
}

// Profile hooks

export function useUserProfile() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile() as Promise<UserProfile | null>;
    },
    enabled: !!actor && !!identity,
  });
}

export function useSetUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      username,
      phone,
    }: {
      username: string;
      phone: string | null;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.setUserProfile(username, phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

// Payment hooks

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createCheckoutSession(amount);
    },
  });
}

export function useConfirmPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sessionId: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.confirmPayment(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useStripeSessionStatus(sessionId: string) {
  const { actor } = useActor();
  return useQuery<StripeSessionStatus | null>({
    queryKey: ["stripeSession", sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) return null;
      return actor.getStripeSessionStatus(
        sessionId,
      ) as Promise<StripeSessionStatus | null>;
    },
    enabled: !!actor && !!sessionId,
  });
}

export function useWithdrawRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.withdrawRequest(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
