import type {
  Contest,
  ContestEntry,
  FantasyTeam,
  LeaderboardEntry,
  StripeConfiguration,
  StripeSessionStatus,
  Transaction,
  UserProfile,
  Match as _Match,
  Player as _Player,
  Team as _Team,
} from "@/backend";

export {
  Sport,
  MatchStatus,
  PlayerRole,
  ContestType,
  TransactionKind,
} from "@/backend";

export type Player = _Player & { avatar?: string };
export type Team = _Team & { logo?: string };
export type Match = _Match;

export type {
  FantasyTeam,
  Contest,
  ContestEntry,
  LeaderboardEntry,
  Transaction,
  UserProfile,
  StripeSessionStatus,
  StripeConfiguration,
};

export type SportType = "Cricket" | "Football" | "Kabaddi";
