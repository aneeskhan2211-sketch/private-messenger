import { MatchStatus, PlayerRole, Sport } from "@/backend";
import type { Player } from "@/backend";
import {
  BallIcon,
  LiveIndicatorDot,
  ScoreChangeBadge,
  WicketIcon,
} from "@/components/AnimatedIcons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useContests,
  useCreateTeam,
  useGetBallHistory,
  useMatch,
  useMyTeams,
  usePlayers,
} from "@/hooks/useQueries";
import { Link, useParams } from "@tanstack/react-router";
import {
  Calendar,
  ChevronRight,
  CircleDot,
  Crown,
  MapPin,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const BUDGET_CR = 100;
const MAX_PLAYERS = 11;

const ROLE_GROUPS: Record<string, PlayerRole[]> = {
  Cricket: [
    PlayerRole.Batsman,
    PlayerRole.Bowler,
    PlayerRole.AllRounder,
    PlayerRole.WicketKeeper,
  ],
  Football: [
    PlayerRole.Defender,
    PlayerRole.Midfielder,
    PlayerRole.Forward,
    PlayerRole.Goalkeeper,
  ],
  Kabaddi: [
    PlayerRole.Raider,
    PlayerRole.Defender2,
    PlayerRole.AllRounderKabaddi,
  ],
};

const ROLE_LABELS: Record<string, string> = {
  [PlayerRole.Batsman]: "Batsmen",
  [PlayerRole.Bowler]: "Bowlers",
  [PlayerRole.AllRounder]: "All-Rounders",
  [PlayerRole.WicketKeeper]: "Wicket-Keepers",
  [PlayerRole.Defender]: "Defenders",
  [PlayerRole.Midfielder]: "Midfielders",
  [PlayerRole.Forward]: "Forwards",
  [PlayerRole.Goalkeeper]: "Goalkeepers",
  [PlayerRole.Raider]: "Raiders",
  [PlayerRole.Defender2]: "Defenders",
  [PlayerRole.AllRounderKabaddi]: "All-Rounders",
};

function formatDate(ts: bigint): string {
  const d = new Date(Number(ts) / 1_000_000);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusBadge(status: MatchStatus) {
  switch (status) {
    case MatchStatus.Live:
      return (
        <Badge className="bg-primary text-primary-foreground animate-pulse">
          LIVE
        </Badge>
      );
    case MatchStatus.Upcoming:
      return <Badge variant="secondary">Upcoming</Badge>;
    case MatchStatus.Completed:
      return (
        <Badge variant="outline" className="text-green-400 border-green-400/30">
          Completed
        </Badge>
      );
    case MatchStatus.Cancelled:
      return <Badge variant="destructive">Cancelled</Badge>;
  }
}

function getSportBadge(sport: Sport) {
  const colors: Record<string, string> = {
    [Sport.Cricket]: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    [Sport.Football]: "bg-green-500/20 text-green-400 border-green-500/30",
    [Sport.Kabaddi]: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  };
  return (
    <Badge variant="outline" className={colors[sport] || ""}>
      {sport}
    </Badge>
  );
}

export default function MatchDetailPage() {
  const { matchId } = useParams({ from: "/matches/$matchId" });
  const { data: match, isLoading: matchLoading } = useMatch(matchId);
  const { data: players, isLoading: playersLoading } = usePlayers(matchId);
  const { data: contests, isLoading: contestsLoading } = useContests(matchId);
  const { data: myTeams } = useMyTeams();
  const createTeam = useCreateTeam();
  const { data: ballHistory } = useGetBallHistory(Number(matchId));

  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(
    new Set(),
  );
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [viceCaptainId, setViceCaptainId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState("");
  const [activeRoleFilter, setActiveRoleFilter] = useState<string>("ALL");

  const matchTeams = useMemo(() => {
    if (!myTeams || !match) return [];
    return myTeams.filter((t) => t.matchId === match.id);
  }, [myTeams, match]);

  const usedCredits = useMemo(() => {
    if (!players) return 0;
    return players
      .filter((p) => selectedPlayers.has(String(p.id)))
      .reduce((sum, p) => sum + p.credit, 0);
  }, [players, selectedPlayers]);

  const remainingBudget = BUDGET_CR - usedCredits;

  const roleFilters = useMemo(() => {
    if (!match) return [];
    const roles = ROLE_GROUPS[match.sport] || [];
    return ["ALL", ...roles];
  }, [match]);

  const filteredPlayers = useMemo(() => {
    if (!players) return [];
    if (activeRoleFilter === "ALL") return players;
    return players.filter((p) => p.role === activeRoleFilter);
  }, [players, activeRoleFilter]);

  const groupedPlayers = useMemo(() => {
    if (!filteredPlayers || !match) return {};
    const groups: Record<string, Player[]> = {};
    const roles = ROLE_GROUPS[match.sport] || [];
    for (const role of roles) {
      const rolePlayers = filteredPlayers.filter((p) => p.role === role);
      if (rolePlayers.length > 0) groups[role] = rolePlayers;
    }
    return groups;
  }, [filteredPlayers, match]);

  const togglePlayer = (playerId: bigint) => {
    const id = String(playerId);
    setSelectedPlayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        if (captainId === id) setCaptainId(null);
        if (viceCaptainId === id) setViceCaptainId(null);
      } else {
        if (next.size >= MAX_PLAYERS) {
          toast.error(`Maximum ${MAX_PLAYERS} players allowed`);
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  };

  const canSelectCaptain = selectedPlayers.size === MAX_PLAYERS;
  const canSave =
    canSelectCaptain &&
    !!captainId &&
    !!viceCaptainId &&
    captainId !== viceCaptainId &&
    teamName.trim().length > 0 &&
    remainingBudget >= 0;

  const handleSaveTeam = async () => {
    if (!match || !canSave) return;
    try {
      await createTeam.mutateAsync({
        matchId: match.id,
        name: teamName.trim(),
        playerIds: Array.from(selectedPlayers).map((id) => BigInt(id)),
        captainId: BigInt(captainId),
        viceCaptainId: BigInt(viceCaptainId),
      });
      toast.success("Team saved successfully!");
      setSelectedPlayers(new Set());
      setCaptainId(null);
      setViceCaptainId(null);
      setTeamName("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save team");
    }
  };

  if (matchLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Match not found</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      {/* Match Header */}
      <Card className="bg-card border-border overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-muted/30 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {getSportBadge(match.sport)}
                {getStatusBadge(match.status)}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {formatDate(match.startTime)}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 text-center">
                <img
                  src={
                    (match.teamA as { logo?: string }).logo ||
                    `/assets/team-logos/${match.teamA.code.toLowerCase()}.png`
                  }
                  alt={match.teamA.name}
                  className="w-16 h-16 mx-auto mb-2 rounded-full object-contain bg-white/5 p-1.5 border border-white/10"
                />
                <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                  {match.teamA.code}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {match.teamA.name}
                </div>
                {match.scoreA && (
                  <div className="text-lg font-mono font-semibold text-primary mt-1">
                    {match.scoreA}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  VS
                </span>
                {match.status === MatchStatus.Live && (
                  <CircleDot className="w-4 h-4 text-primary animate-spin" />
                )}
              </div>

              <div className="flex-1 text-center">
                <img
                  src={
                    (match.teamB as { logo?: string }).logo ||
                    `/assets/team-logos/${match.teamB.code.toLowerCase()}.png`
                  }
                  alt={match.teamB.name}
                  className="w-16 h-16 mx-auto mb-2 rounded-full object-contain bg-white/5 p-1.5 border border-white/10"
                />
                <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                  {match.teamB.code}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {match.teamB.name}
                </div>
                {match.scoreB && (
                  <div className="text-lg font-mono font-semibold text-primary mt-1">
                    {match.scoreB}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-4 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {match.venue}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Score Section */}
      {match.status === MatchStatus.Live && (
        <Card className="bg-card border-border border-live-green/30 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-live-green/10 via-background to-live-green/10 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <LiveIndicatorDot />
                  <span className="text-sm font-bold text-live-green uppercase tracking-wider">
                    Live
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {match.venue}
                </div>
              </div>

              {match.liveStatus && (
                <div className="text-center mb-4">
                  <p className="text-2xl font-display font-bold text-foreground">
                    {match.liveStatus}
                  </p>
                  {match.currentOver && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Over {match.currentOver}
                    </p>
                  )}
                </div>
              )}

              {/* Ball-by-ball feed */}
              {ballHistory && ballHistory.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Ball-by-Ball
                  </h4>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {ballHistory.slice(-10).map((ball, idx) => (
                      <div
                        key={`${ball.over}-${ball.ball}-${idx}`}
                        className={`ball-card-in flex-shrink-0 w-20 p-2 rounded-lg border ${
                          ball.isWicket
                            ? "bg-destructive/10 border-destructive/30"
                            : ball.isBoundary || ball.isSix
                              ? "bg-boundary/10 border-boundary/30"
                              : "bg-muted/40 border-border"
                        }`}
                        data-ocid={`matchdetail.ball_event.${idx + 1}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-muted-foreground">
                            {ball.over}.{ball.ball}
                          </span>
                          {ball.isWicket ? (
                            <WicketIcon className="w-3 h-3 text-destructive" />
                          ) : (
                            <BallIcon className="w-3 h-3 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex justify-center mb-1">
                          <ScoreChangeBadge
                            runs={Number(ball.runs)}
                            className={
                              ball.isBoundary || ball.isSix
                                ? "score-flash-boundary"
                                : ball.isWicket
                                  ? "score-flash-wicket"
                                  : ""
                            }
                          />
                        </div>
                        <p className="text-[9px] text-muted-foreground text-center truncate">
                          {ball.batter}
                        </p>
                        {ball.description && (
                          <p className="text-[8px] text-muted-foreground text-center truncate mt-0.5">
                            {ball.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budget & Selection */}
      <Card className="bg-card border-border">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Budget
            </span>
            <span className="text-sm font-mono font-semibold text-foreground">
              {BUDGET_CR}Cr - {usedCredits.toFixed(1)}Cr ={" "}
              {remainingBudget.toFixed(1)}Cr remaining
            </span>
          </div>
          <Progress
            value={(usedCredits / BUDGET_CR) * 100}
            className="h-2"
            data-ocid="matchdetail.budget_progress"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {selectedPlayers.size}/{MAX_PLAYERS} selected
            </span>
            {canSelectCaptain && (
              <Badge
                variant="outline"
                className="text-primary border-primary/30"
              >
                Pick Captain & Vice-Captain
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Team Name Input */}
      <div className="space-y-2">
        <label
          htmlFor="team-name-input"
          className="text-sm font-medium text-foreground"
        >
          Team Name
        </label>
        <Input
          id="team-name-input"
          placeholder="Enter your team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="bg-muted border-border"
          data-ocid="matchdetail.team_name_input"
        />
      </div>

      {/* Role Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {roleFilters.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setActiveRoleFilter(role)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeRoleFilter === role
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
            data-ocid={`matchdetail.role_filter.${role.toLowerCase()}`}
          >
            {role === "ALL" ? "ALL" : ROLE_LABELS[role] || role}
          </button>
        ))}
      </div>

      {/* Captain/Vice-Captain Selection */}
      {canSelectCaptain && (
        <Card className="bg-card border-border border-primary/20">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Crown className="w-4 h-4 text-primary" />
              Captain (2x points)
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedPlayers)
                .sort()
                .map((id, idx) => {
                  const player = players?.find((p) => String(p.id) === id);
                  if (!player) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCaptainId(id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        captainId === id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                      data-ocid={`matchdetail.captain_option.${idx + 1}`}
                    >
                      {player.name}
                    </button>
                  );
                })}
            </div>

            <h3 className="font-semibold text-foreground flex items-center gap-2 pt-2 border-t border-border">
              <Star className="w-4 h-4 text-amber-400" />
              Vice-Captain (1.5x points)
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedPlayers)
                .sort()
                .map((id, idx) => {
                  const player = players?.find((p) => String(p.id) === id);
                  if (!player || id === captainId) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setViceCaptainId(id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        viceCaptainId === id
                          ? "bg-amber-500 text-white"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                      data-ocid={`matchdetail.vice_captain_option.${idx + 1}`}
                    >
                      {player.name}
                    </button>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Players by Role */}
      {playersLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : (
        Object.entries(groupedPlayers).map(([role, rolePlayers]) => (
          <div key={role} className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {ROLE_LABELS[role] || role} ({rolePlayers.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {rolePlayers.map((player, pIdx) => {
                const id = String(player.id);
                const isSelected = selectedPlayers.has(id);
                const isCaptain = captainId === id;
                const isViceCaptain = viceCaptainId === id;

                return (
                  <Card
                    key={id}
                    className={`bg-card border-border transition-all duration-200 ${
                      isSelected
                        ? "border-primary/50 shadow-sm player-card-selected"
                        : ""
                    }`}
                    data-ocid={`matchdetail.player_card.${role.toLowerCase()}.${pIdx + 1}`}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => togglePlayer(player.id)}
                        disabled={
                          !isSelected && selectedPlayers.size >= MAX_PLAYERS
                        }
                        data-ocid={`matchdetail.player_checkbox.${role.toLowerCase()}.${pIdx + 1}`}
                      />
                      {(player as { avatar?: string }).avatar ? (
                        <img
                          src={(player as { avatar?: string }).avatar}
                          alt={player.name}
                          className="h-10 w-10 rounded-full object-cover shrink-0"
                          onError={(e) => {
                            const el = e.currentTarget;
                            el.onerror = null;
                            el.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=1a1a2e&color=f97316&size=128`;
                          }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {player.name[0]}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground truncate">
                            {player.name}
                          </span>
                          {isCaptain && (
                            <Badge className="bg-primary text-primary-foreground text-[10px] px-1">
                              C
                            </Badge>
                          )}
                          {isViceCaptain && (
                            <Badge className="bg-amber-500 text-white text-[10px] px-1">
                              VC
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span>{player.team}</span>
                          <span>•</span>
                          <span>{player.credit}Cr</span>
                          <span>•</span>
                          {(player as { country?: string }).country && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1 py-0 h-auto bg-muted/50"
                            >
                              {(player as { country?: string }).country}
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1 py-0 h-auto ${
                              player.role === PlayerRole.Batsman
                                ? "role-batsman"
                                : player.role === PlayerRole.Bowler
                                  ? "role-bowler"
                                  : player.role === PlayerRole.AllRounder
                                    ? "role-all-rounder"
                                    : player.role === PlayerRole.WicketKeeper
                                      ? "role-wicket-keeper"
                                      : ""
                            }`}
                          >
                            {player.points} avg
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground shrink-0">
                        {player.selPct}%
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Save Button */}
      <div className="sticky bottom-4 z-10">
        <Button
          className="w-full h-12 text-base font-semibold shadow-lg"
          disabled={!canSave || createTeam.isPending}
          onClick={handleSaveTeam}
          data-ocid="matchdetail.save_team_button"
        >
          {createTeam.isPending ? "Saving..." : "Save Team"}
        </Button>
      </div>

      {/* Contests for this match */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Contests
        </h2>
        {contestsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : !contests || contests.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No contests available for this match
            </p>
          </div>
        ) : (
          contests.map((contest, idx) => (
            <Card
              key={String(contest.id)}
              className="bg-card border-border hover:border-primary/30 transition-colors"
              data-ocid={`matchdetail.contest_card.${idx + 1}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {contest.name}
                      </h3>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {contest.contestType}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5 text-primary" />₹
                        {(Number(contest.prizePool) / 100).toFixed(0)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {Number(contest.filledSpots)}/
                        {Number(contest.maxEntries)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-foreground">
                      ₹{(Number(contest.entryFee) / 100).toFixed(0)}
                    </div>
                    <div className="text-xs text-muted-foreground">entry</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {matchTeams.length > 0
                      ? "You have a team"
                      : "Create a team to join"}
                  </div>
                  <Link
                    to="/contests/$contestId"
                    params={{ contestId: String(contest.id) }}
                  >
                    <Button
                      size="sm"
                      variant={matchTeams.length > 0 ? "default" : "outline"}
                      disabled={matchTeams.length === 0}
                      data-ocid={`matchdetail.contest_join_button.${idx + 1}`}
                    >
                      Join
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
