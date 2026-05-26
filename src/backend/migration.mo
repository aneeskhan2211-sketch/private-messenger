import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Stripe "mo:caffeineai-stripe/stripe";

module {

  // ── Old types (from previous deployment — inline, never import from .old/) ──

  type OldMatchStatus = {
    #Upcoming;
    #Live;
    #Completed;
    #Cancelled;
  };

  type OldSport = {
    #Cricket;
    #Football;
    #Kabaddi;
  };

  type OldTeam = {
    name : Text;
    code : Text;
    logo : ?Text;
  };

  type OldMatch = {
    id          : Nat;
    sport       : OldSport;
    teamA       : OldTeam;
    teamB       : OldTeam;
    venue       : Text;
    startTime   : Int;
    status      : OldMatchStatus;
    scoreA      : ?Text;
    scoreB      : ?Text;
    lastUpdated : Int;
  };

  type OldPlayerRole = {
    #WicketKeeper;
    #Batsman;
    #AllRounder;
    #Bowler;
    #Goalkeeper;
    #Defender;
    #Midfielder;
    #Forward;
    #Raider;
    #AllRounderKabaddi;
    #Defender2;
  };

  type OldPlayer = {
    id      : Nat;
    matchId : Nat;
    name    : Text;
    team    : Text;
    role    : OldPlayerRole;
    credit  : Float;
    selPct  : Float;
    points  : Float;
  };

  type OldContestType = {
    #Head2Head;
    #MiniLeague;
    #MegaLeague;
    #Practice;
  };

  type OldContest = {
    id             : Nat;
    matchId        : Nat;
    name           : Text;
    contestType    : OldContestType;
    entryFee       : Nat;
    prizePool      : Nat;
    maxEntries     : Nat;
    filledSpots    : Nat;
    prizeBreakdown : [(Nat, Nat)];
    createdAt      : Int;
  };

  type OldContestEntry = {
    contestId : Nat;
    teamId    : Nat;
    owner     : Principal;
    rank      : ?Nat;
    points    : Float;
    prize     : Nat;
    joinedAt  : Int;
  };

  type OldTransactionKind = {
    #Deposit;
    #Withdrawal;
    #ContestEntry;
    #PrizeCredit;
    #Refund;
  };

  type OldTransaction = {
    id        : Nat;
    owner     : Principal;
    kind      : OldTransactionKind;
    amount    : Nat;
    note      : Text;
    timestamp : Int;
  };

  type OldUserProfile = {
    principal : Principal;
    username  : Text;
    phone     : ?Text;
    kycDone   : Bool;
    joinedAt  : Int;
  };

  type OldFantasyTeam = {
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

  type OldStateRec = {
    var nextMatchId   : Nat;
    var nextPlayerId  : Nat;
    var nextTeamId    : Nat;
    var nextContestId : Nat;
    var nextTxId      : Nat;
  };

  // ── New types (matching current main.mo) ──────────────────────────────────

  type MatchStatus = {
    #Upcoming;
    #Live;
    #Completed;
    #Cancelled;
  };

  type Sport = {
    #Cricket;
    #Football;
    #Kabaddi;
  };

  type Team = {
    name : Text;
    code : Text;
    logo : ?Text;
  };

  type BallEvent = {
    over        : Text;
    ball        : Text;
    bowler      : Text;
    batter      : Text;
    runs        : Nat;
    isWicket    : Bool;
    isBoundary  : Bool;
    isSix       : Bool;
    description : Text;
    timestamp   : Int;
  };

  type Match = {
    id          : Nat;
    sport       : Sport;
    teamA       : Team;
    teamB       : Team;
    venue       : Text;
    startTime   : Int;
    status      : MatchStatus;
    scoreA      : ?Text;
    scoreB      : ?Text;
    lastUpdated : Int;
    currentOver : ?Text;
    liveStatus  : ?Text;
    ballHistory : [BallEvent];
  };

  type PlayerRole = {
    #WicketKeeper;
    #Batsman;
    #AllRounder;
    #Bowler;
    #Goalkeeper;
    #Defender;
    #Midfielder;
    #Forward;
    #Raider;
    #AllRounderKabaddi;
    #Defender2;
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
    avatar  : ?Text;
    country : ?Text;
  };

  type ContestType = {
    #Head2Head;
    #MiniLeague;
    #MegaLeague;
    #Practice;
  };

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

  type TransactionKind = {
    #Deposit;
    #Withdrawal;
    #ContestEntry;
    #PrizeCredit;
    #Refund;
  };

  type Transaction = {
    id        : Nat;
    owner     : Principal;
    kind      : TransactionKind;
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

  type StateRec = {
    var nextMatchId   : Nat;
    var nextPlayerId  : Nat;
    var nextTeamId    : Nat;
    var nextContestId : Nat;
    var nextTxId      : Nat;
  };

  // ── Migration domain types ─────────────────────────────────────────────────

  public type OldActor = {
    matches      : Map.Map<Nat, OldMatch>;
    players      : Map.Map<Nat, OldPlayer>;
    teams        : Map.Map<Nat, OldFantasyTeam>;
    contests     : Map.Map<Nat, OldContest>;
    entries      : Map.Map<Nat, List.List<OldContestEntry>>;
    wallets      : Map.Map<Principal, Nat>;
    transactions : Map.Map<Principal, List.List<OldTransaction>>;
    profiles     : Map.Map<Principal, OldUserProfile>;
    state        : OldStateRec;
    stripeConfig : ?Stripe.StripeConfiguration;
    lastHeartbeat : Int;
    seedDone     : Bool;
  };

  public type NewActor = {
    matches      : Map.Map<Nat, Match>;
    players      : Map.Map<Nat, Player>;
    teams        : Map.Map<Nat, FantasyTeam>;
    contests     : Map.Map<Nat, Contest>;
    entries      : Map.Map<Nat, List.List<ContestEntry>>;
    wallets      : Map.Map<Principal, Nat>;
    transactions : Map.Map<Principal, List.List<Transaction>>;
    profiles     : Map.Map<Principal, UserProfile>;
    state        : StateRec;
    stripeConfig : ?Stripe.StripeConfiguration;
    lastHeartbeat : Int;
    seedDone     : Bool;
    apiKey       : Text;
    ballHistoryMap : Map.Map<Nat, List.List<BallEvent>>;
  };

  // ── Migration function ────────────────────────────────────────────────────

  public func run(old : OldActor) : NewActor {
    // Migrate matches: add currentOver=null, liveStatus=null, ballHistory=[]
    let newMatches = old.matches.map<Nat, OldMatch, Match>(
      func(_id, m) {
        {
          id          = m.id;
          sport       = m.sport;
          teamA       = m.teamA;
          teamB       = m.teamB;
          venue       = m.venue;
          startTime   = m.startTime;
          status      = m.status;
          scoreA      = m.scoreA;
          scoreB      = m.scoreB;
          lastUpdated = m.lastUpdated;
          currentOver = null;
          liveStatus  = null;
          ballHistory = [];
        }
      }
    );

    // Migrate players: add avatar=null, country=null
    let newPlayers = old.players.map<Nat, OldPlayer, Player>(
      func(_id, p) {
        {
          id      = p.id;
          matchId = p.matchId;
          name    = p.name;
          team    = p.team;
          role    = p.role;
          credit  = p.credit;
          selPct  = p.selPct;
          points  = p.points;
          avatar  = null;
          country = null;
        }
      }
    );

    {
      matches      = newMatches;
      players      = newPlayers;
      teams        = old.teams;
      contests     = old.contests;
      entries      = old.entries;
      wallets      = old.wallets;
      transactions = old.transactions;
      profiles     = old.profiles;
      state        = old.state;
      stripeConfig = old.stripeConfig;
      lastHeartbeat = old.lastHeartbeat;
      seedDone     = old.seedDone;
      apiKey       = "";
      ballHistoryMap = Map.empty();
    }
  };

};
