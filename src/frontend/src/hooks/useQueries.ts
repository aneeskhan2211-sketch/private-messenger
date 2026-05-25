import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Contest,
  ContestEntry,
  FantasyTeam,
  LeaderboardEntry,
  Match,
  Player,
  StripeSessionStatus,
  Transaction,
  UserProfile,
} from "../types";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// Match hooks

export function useMatches() {
  const { actor } = useActor();
  return useQuery<Match[]>({
    queryKey: ["matches"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMatches();
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
      return actor.getMatch(BigInt(id));
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
      return actor.getPlayers(BigInt(matchId));
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
        return actor.getContests(BigInt(matchId));
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
      return actor.getContest(BigInt(id));
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
      return actor.getLeaderboard(BigInt(contestId));
    },
    enabled: !!actor && !!contestId,
    refetchInterval: 30000,
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
      return actor.getTransactions();
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
      return actor.getContestHistory();
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
      return actor.getUserProfile();
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
      return actor.getStripeSessionStatus(sessionId);
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
