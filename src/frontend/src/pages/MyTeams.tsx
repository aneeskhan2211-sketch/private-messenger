import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useMatches, useMyTeams } from "@/hooks/useQueries";
import type { FantasyTeam, Match, Player } from "@/types";
import { MatchStatus, Sport } from "@/types";
import { useQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Crown,
  Pencil,
  Shield,
  Star,
  Swords,
  Trophy,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

function sportLabel(sport: Sport): string {
  switch (sport) {
    case Sport.Cricket:
      return "Cricket";
    case Sport.Football:
      return "Football";
    case Sport.Kabaddi:
      return "Kabaddi";
    default:
      return "Sport";
  }
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MyTeamsPage() {
  const { actor } = useActor();
  const { data: teams, isLoading: teamsLoading } = useMyTeams();
  const { data: matches, isLoading: matchesLoading } = useMatches();

  const matchMap = useMemo(() => {
    const map = new Map<string, Match>();
    if (matches) {
      for (const m of matches) {
        map.set(m.id.toString(), m);
      }
    }
    return map;
  }, [matches]);

  const uniqueMatchIds = useMemo(() => {
    const ids = new Set<string>();
    if (teams) {
      for (const t of teams) {
        ids.add(t.matchId.toString());
      }
    }
    return Array.from(ids);
  }, [teams]);

  const playerQueries = useQueries({
    queries: uniqueMatchIds.map((matchId) => ({
      queryKey: ["players", matchId],
      queryFn: async () => {
        if (!actor) return [] as Player[];
        return actor.getPlayers(BigInt(matchId));
      },
      enabled: !!actor && uniqueMatchIds.length > 0,
    })),
  });

  const playerNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const q of playerQueries) {
      if (q.data) {
        for (const p of q.data) {
          map.set(p.id.toString(), p.name);
        }
      }
    }
    return map;
  }, [playerQueries]);

  const groupedTeams = useMemo(() => {
    const groups = new Map<string, FantasyTeam[]>();
    if (!teams) return groups;
    for (const team of teams) {
      const matchId = team.matchId.toString();
      if (!groups.has(matchId)) {
        groups.set(matchId, []);
      }
      groups.get(matchId)!.push(team);
    }
    return groups;
  }, [teams]);

  const isLoading = teamsLoading || matchesLoading;

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable identity
          <Skeleton key={`skeleton-team-${i}`} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (!teams || teams.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center"
        data-ocid="myteams.empty_state"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-display font-bold text-foreground mb-2">
          No teams yet
        </h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
          Create your first fantasy team and join contests to win real prizes
        </p>
        <Link to="/matches">
          <Button data-ocid="myteams.create_team_button">
            Create Your First Team
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-display font-bold text-foreground">
        My Teams
      </h1>

      {Array.from(groupedTeams.entries()).map(([matchId, matchTeams]) => {
        const match = matchMap.get(matchId);
        const _matchStarted = match
          ? match.status !== MatchStatus.Upcoming
          : false;

        return (
          <div key={matchId} className="space-y-3">
            {match && (
              <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-2">
                  {match.teamA.logo ? (
                    <img
                      src={match.teamA.logo}
                      alt={match.teamA.name}
                      className="w-8 h-8 rounded-full object-contain bg-background border border-border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {match.teamA.code}
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground font-medium">
                    vs
                  </span>
                  {match.teamB.logo ? (
                    <img
                      src={match.teamB.logo}
                      alt={match.teamB.name}
                      className="w-8 h-8 rounded-full object-contain bg-background border border-border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {match.teamB.code}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-foreground text-sm truncate block">
                    {match.teamA.name} vs {match.teamB.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(match.startTime)} • {sportLabel(match.sport)}
                  </span>
                </div>
                <Badge
                  variant={
                    match.status === MatchStatus.Live ? "default" : "secondary"
                  }
                  className="text-[10px] shrink-0"
                >
                  {match.status}
                </Badge>
              </div>
            )}

            <div className="grid gap-3">
              {matchTeams.map((team, idx) => {
                const captainName =
                  playerNameMap.get(team.captainId.toString()) ??
                  `Player #${team.captainId.toString()}`;
                const viceCaptainName =
                  playerNameMap.get(team.viceCaptainId.toString()) ??
                  `Player #${team.viceCaptainId.toString()}`;
                return (
                  <Card
                    key={team.id.toString()}
                    className="border-border hover:border-primary/30 transition-colors duration-150 overflow-hidden"
                    data-ocid={`myteams.item.${idx + 1}`}
                  >
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-foreground text-base">
                              {team.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {match && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px]"
                                >
                                  {sportLabel(match.sport)}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {team.playerIds.length} players
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-lg font-bold text-primary font-display">
                              {team.totalPoints.toFixed(1)}
                            </div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                              Points
                            </div>
                          </div>
                        </div>

                        {/* Captain & Vice-Captain */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-xs font-medium text-amber-400">
                              {captainName}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20">
                            <Star className="w-3.5 h-3.5 text-sky-400" />
                            <span className="text-xs font-medium text-sky-400">
                              {viceCaptainName}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Footer with edit button */}
                      <div className="px-4 py-3 bg-muted/30 border-t border-border flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Created {formatDate(team.createdAt)}
                        </span>
                        <Link to="/matches/$matchId" params={{ matchId }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10"
                            data-ocid={`myteams.edit_button.${idx + 1}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
