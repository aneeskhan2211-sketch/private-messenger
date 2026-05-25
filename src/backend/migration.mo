// migration.mo — Bridges the previously deployed Fantasy11 stable state
// to the current Fantasy11 actor (pass-through; same schema).
import Map "mo:core/Map";
import List "mo:core/List";

module {

  // ── Previously deployed Fantasy11 types (inlined) ───────────────────────

  type Sport = { #Cricket; #Football; #Kabaddi };

  type TeamInfo = { name : Text; code : Text; logo : ?Text };

  type MatchStatus = { #Upcoming; #Live; #Completed; #Cancelled };

  type Match = {
    id          : Nat;
    sport       : Sport;
    teamA       : TeamInfo;
    teamB       : TeamInfo;
    venue       : Text;
    startTime   : Int;
    status      : MatchStatus;
    scoreA      : ?Text;
    scoreB      : ?Text;
    lastUpdated : Int;
  };

  type PlayerRole = {
    #WicketKeeper; #Batsman; #AllRounder; #Bowler;
    #Goalkeeper; #Defender; #Midfielder; #Forward;
    #Raider; #AllRounderKabaddi; #Defender2;
  };

  type Player = {
    id      : Nat;
    matchId : Nat;
    name    : Text;
    team    : Text;
    role    : PlayerRole;
    credit  : Float;
    selPct  : Float;
    points  : Float;
  };

  type FantasyTeam = {
    id            : Nat;
    owner         : Principal;
    matchId       : Nat;
    name          : Text;
    playerIds     : [Nat];
    captainId     : Nat;
    viceCaptainId : Nat;
    totalPoints   : Float;
    createdAt     : Int;
  };

  type ContestType = { #Head2Head; #MiniLeague; #MegaLeague; #Practice };

  type Contest = {
    id             : Nat;
    matchId        : Nat;
    name           : Text;
    contestType    : ContestType;
    entryFee       : Nat;
    prizePool      : Nat;
    maxEntries     : Nat;
    filledSpots    : Nat;
    prizeBreakdown : [(Nat, Nat)];
    createdAt      : Int;
  };

  type ContestEntry = {
    contestId : Nat;
    teamId    : Nat;
    owner     : Principal;
    rank      : ?Nat;
    points    : Float;
    prize     : Nat;
    joinedAt  : Int;
  };

  type Transaction = {
    id        : Nat;
    owner     : Principal;
    kind      : { #Deposit; #Withdrawal; #ContestEntry; #PrizeCredit; #Refund };
    amount    : Nat;
    note      : Text;
    timestamp : Int;
  };

  type UserProfile = {
    principal : Principal;
    username  : Text;
    phone     : ?Text;
    kycDone   : Bool;
    joinedAt  : Int;
  };

  type StateRecord = {
    var nextMatchId   : Nat;
    var nextPlayerId  : Nat;
    var nextTeamId    : Nat;
    var nextContestId : Nat;
    var nextTxId      : Nat;
  };

  type StripeConfig = { secretKey : Text; allowedCountries : [Text] };

  type OldActor = {
    var matches      : Map.Map<Nat, Match>;
    var players      : Map.Map<Nat, Player>;
    var teams        : Map.Map<Nat, FantasyTeam>;
    var contests     : Map.Map<Nat, Contest>;
    var entries      : Map.Map<Nat, List.List<ContestEntry>>;
    var wallets      : Map.Map<Principal, Nat>;
    var transactions : Map.Map<Principal, List.List<Transaction>>;
    var profiles     : Map.Map<Principal, UserProfile>;
    state            : StateRecord;
    var lastHeartbeat : Int;
    var seedDone      : Bool;
    var stripeConfig  : ?StripeConfig;
  };

  // ── New actor types (same schema — pass-through) ─────────────────────────

  type NewActor = {
    var matches      : Map.Map<Nat, Match>;
    var players      : Map.Map<Nat, Player>;
    var teams        : Map.Map<Nat, FantasyTeam>;
    var contests     : Map.Map<Nat, Contest>;
    var entries      : Map.Map<Nat, List.List<ContestEntry>>;
    var wallets      : Map.Map<Principal, Nat>;
    var transactions : Map.Map<Principal, List.List<Transaction>>;
    var profiles     : Map.Map<Principal, UserProfile>;
    state            : StateRecord;
    var lastHeartbeat : Int;
    var seedDone      : Bool;
    var stripeConfig  : ?StripeConfig;
  };

  // ── Migration function (pass-through — same Fantasy11 schema) ────────────

  public func run(old : OldActor) : NewActor {
    {
      var matches      = old.matches;
      var players      = old.players;
      var teams        = old.teams;
      var contests     = old.contests;
      var entries      = old.entries;
      var wallets      = old.wallets;
      var transactions = old.transactions;
      var profiles     = old.profiles;
      state            = old.state;
      var lastHeartbeat = old.lastHeartbeat;
      var seedDone      = old.seedDone;
      var stripeConfig  = old.stripeConfig;
    };
  };

};
