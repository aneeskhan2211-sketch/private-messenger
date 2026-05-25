import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMatches } from "@/hooks/useQueries";
import { type Match, MatchStatus, Sport } from "@/types";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, CircleDot, MapPin, Trophy } from "lucide-react";
import { useMemo, useState } from "react";

const sportTabs = [
  { label: "All", value: null as Sport | null },
  { label: "Cricket", value: Sport.Cricket, icon: "🏏" },
  { label: "Football", value: Sport.Football, icon: "⚽" },
  { label: "Kabaddi", value: Sport.Kabaddi, icon: "🤼" },
] as const;

const sportBadgeStyles: Record<Sport, string> = {
  [Sport.Cricket]: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  [Sport.Football]: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  [Sport.Kabaddi]: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

const statusBadgeStyles: Record<MatchStatus, string> = {
  [MatchStatus.Upcoming]:
    "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  [MatchStatus.Live]:
    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  [MatchStatus.Completed]: "bg-muted text-muted-foreground border-border",
  [MatchStatus.Cancelled]:
    "bg-destructive/15 text-destructive border-destructive/30",
};

function formatMatchDate(startTime: bigint): string {
  const date = new Date(Number(startTime) / 1_000_000);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  if (isToday) return "Today";
  if (isTomorrow) return "Tomorrow";

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

function formatMatchTime(startTime: bigint): string {
  const date = new Date(Number(startTime) / 1_000_000);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function groupMatchesByDate(matches: Match[]): Record<string, Match[]> {
  const groups: Record<string, Match[]> = {};
  for (const match of matches) {
    const key = formatMatchDate(match.startTime);
    if (!groups[key]) groups[key] = [];
    groups[key].push(match);
  }
  return groups;
}

function MatchCard({ match }: { match: Match }) {
  const sportStyle = sportBadgeStyles[match.sport];
  const statusStyle = statusBadgeStyles[match.status];
  const isLive = match.status === MatchStatus.Live;

  return (
    <Card
      className="bg-card border-border hover:border-primary/40 transition-colors duration-200"
      data-ocid="match.card"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <Badge
            variant="outline"
            className={`text-xs font-medium ${sportStyle}`}
          >
            {match.sport === Sport.Cricket && "🏏"}
            {match.sport === Sport.Football && "⚽"}
            {match.sport === Sport.Kabaddi && "🤼"}
            <span className="ml-1">{match.sport}</span>
          </Badge>
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            )}
            <Badge
              variant="outline"
              className={`text-xs font-medium ${statusStyle}`}
            >
              {match.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <img
              src={
                (match.teamA as { logo?: string }).logo ||
                `/assets/team-logos/${match.teamA.code.toLowerCase()}.png`
              }
              alt={match.teamA.name}
              className="w-14 h-14 mx-auto mb-2 rounded-full object-contain bg-white/5 p-1.5 border border-white/10"
            />
            <p className="font-display font-bold text-lg">{match.teamA.code}</p>
            <p className="text-xs text-muted-foreground">{match.teamA.name}</p>
            {match.status === MatchStatus.Live && match.scoreA && (
              <p className="text-xl font-bold text-primary mt-1">
                {match.scoreA}
              </p>
            )}
          </div>
          <div className="px-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              vs
            </p>
            {match.status === MatchStatus.Live && (
              <CircleDot className="w-4 h-4 mx-auto text-primary animate-spin mt-1" />
            )}
          </div>
          <div className="text-center flex-1">
            <img
              src={
                (match.teamB as { logo?: string }).logo ||
                `/assets/team-logos/${match.teamB.code.toLowerCase()}.png`
              }
              alt={match.teamB.name}
              className="w-14 h-14 mx-auto mb-2 rounded-full object-contain bg-white/5 p-1.5 border border-white/10"
            />
            <p className="font-display font-bold text-lg">{match.teamB.code}</p>
            <p className="text-xs text-muted-foreground">{match.teamB.name}</p>
            {match.status === MatchStatus.Live && match.scoreB && (
              <p className="text-xl font-bold text-primary mt-1">
                {match.scoreB}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{match.venue}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatMatchTime(match.startTime)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Trophy className="w-3.5 h-3.5 text-primary" />
            <span>Contests available</span>
          </div>
          <Link
            to="/matches/$matchId"
            params={{ matchId: match.id.toString() }}
          >
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              data-ocid="match.play_now_button"
            >
              Play Now
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function MatchesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable identity
        <Card key={`skeleton-match-${i}`} className="bg-card border-border">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ sport }: { sport: Sport | null }) {
  const sportLabel = sport ? sport : "any sport";
  return (
    <div
      className="flex flex-col items-center justify-center py-16 text-center"
      data-ocid="match.empty_state"
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Calendar className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-display font-semibold text-foreground mb-1">
        No matches found
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        There are no {sportLabel} matches available right now. Check back later
        for upcoming contests.
      </p>
    </div>
  );
}

export default function MatchesPage() {
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const { data: matches, isLoading } = useMatches();

  const filteredMatches = useMemo(() => {
    if (!matches) return [];
    if (!selectedSport) return matches;
    return matches.filter((m) => m.sport === selectedSport);
  }, [matches, selectedSport]);

  const grouped = useMemo(
    () => groupMatchesByDate(filteredMatches),
    [filteredMatches],
  );
  const dateKeys = useMemo(() => Object.keys(grouped), [grouped]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-display font-bold text-foreground mb-6">
          Matches
        </h1>

        {/* Sport Tabs */}
        <div
          className="flex items-center gap-2 mb-6 overflow-x-auto pb-1"
          data-ocid="match.sport_tabs"
        >
          {sportTabs.map((tab) => {
            const isActive = selectedSport === tab.value;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setSelectedSport(tab.value)}
                className={`
                  flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
                  whitespace-nowrap transition-colors duration-200
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:text-foreground border border-border"
                  }
                `}
                data-ocid={`match.sport_tab.${tab.label.toLowerCase()}`}
              >
                {"icon" in tab && <span>{tab.icon}</span>}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Match List */}
        {isLoading ? (
          <MatchesSkeleton />
        ) : filteredMatches.length === 0 ? (
          <EmptyState sport={selectedSport} />
        ) : (
          <div className="space-y-8">
            {dateKeys.map((dateKey) => (
              <section key={dateKey}>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {dateKey}
                </h2>
                <div className="space-y-3">
                  {grouped[dateKey].map((match) => (
                    <MatchCard key={match.id.toString()} match={match} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
