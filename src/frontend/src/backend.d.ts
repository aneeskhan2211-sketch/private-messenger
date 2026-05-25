import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Player {
    id: bigint;
    name: string;
    role: PlayerRole;
    team: string;
    selPct: number;
    credit: number;
    matchId: bigint;
    points: number;
}
export interface LeaderboardEntry {
    teamName: string;
    principal: Principal;
    rank: bigint;
    prize: bigint;
    points: number;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface FantasyTeam {
    id: bigint;
    playerIds: Array<bigint>;
    owner: Principal;
    name: string;
    createdAt: bigint;
    viceCaptainId: bigint;
    matchId: bigint;
    totalPoints: number;
    captainId: bigint;
}
export interface Match {
    id: bigint;
    startTime: bigint;
    status: MatchStatus;
    teamA: Team;
    teamB: Team;
    venue: string;
    scoreA?: string;
    scoreB?: string;
    lastUpdated: bigint;
    sport: Sport;
}
export interface http_header {
    value: string;
    name: string;
}
export interface Transaction {
    id: bigint;
    owner: Principal;
    kind: TransactionKind;
    note: string;
    timestamp: bigint;
    amount: bigint;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Contest {
    id: bigint;
    contestType: ContestType;
    name: string;
    createdAt: bigint;
    prizeBreakdown: Array<[bigint, bigint]>;
    matchId: bigint;
    entryFee: bigint;
    filledSpots: bigint;
    maxEntries: bigint;
    prizePool: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface ContestEntry {
    contestId: bigint;
    owner: Principal;
    joinedAt: bigint;
    rank?: bigint;
    prize: bigint;
    teamId: bigint;
    points: number;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface UserProfile {
    principal: Principal;
    username: string;
    joinedAt: bigint;
    phone?: string;
    kycDone: boolean;
}
export interface Team {
    code: string;
    logo?: string;
    name: string;
}
export enum ContestType {
    Practice = "Practice",
    Head2Head = "Head2Head",
    MegaLeague = "MegaLeague",
    MiniLeague = "MiniLeague"
}
export enum MatchStatus {
    Live = "Live",
    Cancelled = "Cancelled",
    Completed = "Completed",
    Upcoming = "Upcoming"
}
export enum PlayerRole {
    Defender2 = "Defender2",
    Goalkeeper = "Goalkeeper",
    AllRounder = "AllRounder",
    WicketKeeper = "WicketKeeper",
    Batsman = "Batsman",
    Bowler = "Bowler",
    AllRounderKabaddi = "AllRounderKabaddi",
    Midfielder = "Midfielder",
    Forward = "Forward",
    Defender = "Defender",
    Raider = "Raider"
}
export enum Sport {
    Football = "Football",
    Cricket = "Cricket",
    Kabaddi = "Kabaddi"
}
export enum TransactionKind {
    Deposit = "Deposit",
    Refund = "Refund",
    Withdrawal = "Withdrawal",
    PrizeCredit = "PrizeCredit",
    ContestEntry = "ContestEntry"
}
export interface backendInterface {
    addSampleContest(matchId: string, entryFee: bigint, prizePool: bigint, name: string): Promise<boolean>;
    confirmPayment(sessionId: string): Promise<boolean>;
    createCheckoutSession(amount: bigint): Promise<string>;
    createTeam(matchId: bigint, name: string, playerIds: Array<bigint>, captainId: bigint, viceCaptainId: bigint): Promise<FantasyTeam>;
    getContest(contestId: bigint): Promise<Contest | null>;
    getContestHistory(): Promise<Array<ContestEntry>>;
    getContests(matchId: bigint): Promise<Array<Contest>>;
    getLeaderboard(contestId: bigint): Promise<Array<LeaderboardEntry>>;
    getMatch(matchId: bigint): Promise<Match | null>;
    getMatches(): Promise<Array<Match>>;
    getMyTeams(): Promise<Array<FantasyTeam>>;
    getPlayers(matchId: bigint): Promise<Array<Player>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTransactions(): Promise<Array<Transaction>>;
    getUserProfile(): Promise<UserProfile | null>;
    getWalletBalance(): Promise<bigint>;
    isStripeConfigured(): Promise<boolean>;
    joinContest(contestId: bigint, teamId: bigint): Promise<ContestEntry>;
    refreshLiveScores(): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    setUserProfile(username: string, phone: string | null): Promise<UserProfile>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    withdrawRequest(amount: bigint): Promise<boolean>;
}
