import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import {
  useContestHistory,
  useMatches,
  useWalletBalance,
} from "@/hooks/useQueries";
import { MatchStatus, Sport } from "@/types";
import type { Contest } from "@/types";
import { useQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  ChevronRight,
  Circle,
  Clock,
  Flame,
  Swords,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { LiveIndicatorDot } from "../components/AnimatedIcons";

function fmtCurrency(n: bigint) {
  return n === BigInt(0) ? "FREE" : `₹${(Number(n) / 100).toFixed(2)}`;
}

function timeUntil(st: bigint) {
  const diff = Number(st) / 1e6 - Date.now();
  if (diff <= 0) return "Live now";
  const h = Math.floor(diff / 36e5);
  const m = Math.floor((diff % 36e5) / 6e4);
  if (h > 48) return `${Math.floor(h / 24)}d ${h % 24}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function sportIcon(s: Sport) {
  switch (s) {
    case Sport.Cricket:
      return <Target className="w-3.5 h-3.5" />;
    case Sport.Football:
      return <Circle className="w-3.5 h-3.5" />;
    case Sport.Kabaddi:
      return <Swords className="w-3.5 h-3.5" />;
  }
}

function sportColor(s: Sport) {
  switch (s) {
    case Sport.Cricket:
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case Sport.Football:
      return "bg-sky-500/20 text-sky-400 border-sky-500/30";
    case Sport.Kabaddi:
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  }
}

export default function HomePage() {
  const { actor } = useActor();
  const { data: matches, isLoading: ml } = useMatches();
  const { data: balance, isLoading: bl } = useWalletBalance();
  const { data: history, isLoading: hl } = useContestHistory();

  const liveUpcoming =
    matches?.filter(
      (m) => m.status === MatchStatus.Live || m.status === MatchStatus.Upcoming,
    ) || [];

  const contestQs = useQueries({
    queries: liveUpcoming.map((m) => ({
      queryKey: ["contests", m.id.toString()],
      queryFn: async () => {
        if (!actor) return [] as Contest[];
        return actor.getContests(m.id);
      },
      enabled: !!actor,
    })),
  });

  const winnings = history?.reduce((s, e) => s + Number(e.prize), 0) || 0;
  const joined = history?.length || 0;
  const bestRank = history
    ?.filter((e) => e.rank !== undefined)
    .map((e) => Number(e.rank));
  const best = bestRank && bestRank.length > 0 ? Math.min(...bestRank) : null;

  const stats = [
    {
      label: "Total Winnings",
      value: fmtCurrency(BigInt(winnings)),
      icon: Trophy,
      color: "text-primary",
    },
    {
      label: "Contests Joined",
      value: joined.toString(),
      icon: Calendar,
      color: "text-chart-2",
    },
    { label: "Teams Created", value: "—", icon: Users, color: "text-chart-3" },
    {
      label: best ? "Best Rank" : "Win Rate",
      value: best ? `#${best}` : "—",
      icon: TrendingUp,
      color: "text-chart-5",
    },
  ];

  return (
    <div className="space-y-6 p-4 pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-primary/20 p-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">
            Welcome to Fantasy11
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            {ml ? "Loading..." : `${liveUpcoming.length} matches`}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-border/50">
              <Wallet className="w-4 h-4 text-primary" />
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  Balance
                </div>
                <div className="text-sm font-bold text-foreground font-mono">
                  {bl ? "—" : fmtCurrency(balance || BigInt(0))}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-auto py-2.5 px-4"
              asChild
              data-ocid="home.deposit_button"
            >
              <Link to="/wallet">Add Cash</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Live Match Banner */}
      {(() => {
        const liveMatch = liveUpcoming.find(
          (m) => m.status === MatchStatus.Live,
        );
        if (!liveMatch) return null;
        return (
          <Card className="bg-card border-border overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-red-500/10 via-background to-red-500/10 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px] flex items-center gap-1">
                    <LiveIndicatorDot />
                    LIVE
                  </Badge>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                    {liveMatch.venue}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border">
                      {liveMatch.teamA.logo ? (
                        <img
                          src={liveMatch.teamA.logo}
                          alt={liveMatch.teamA.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-foreground">
                          {liveMatch.teamA.code}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">
                        {liveMatch.teamA.name}
                      </div>
                      <div className="text-lg font-bold text-primary font-mono">
                        {liveMatch.scoreA || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium px-3">
                    VS
                  </div>
                  <div className="flex items-center gap-3 flex-row-reverse text-right">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border">
                      {liveMatch.teamB.logo ? (
                        <img
                          src={liveMatch.teamB.logo}
                          alt={liveMatch.teamB.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-foreground">
                          {liveMatch.teamB.code}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">
                        {liveMatch.teamB.name}
                      </div>
                      <div className="text-lg font-bold text-primary font-mono">
                        {liveMatch.scoreB || "—"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {liveMatch.sport} •{" "}
                    {contestQs[liveUpcoming.indexOf(liveMatch)]?.data?.length ||
                      0}{" "}
                    contests
                  </span>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 rounded-lg"
                    asChild
                    data-ocid="home.live_banner_view_match"
                  >
                    <Link
                      to="/matches/$matchId"
                      params={{ matchId: liveMatch.id.toString() }}
                    >
                      View Match
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Live Matches */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" />
            Live Matches
          </h2>
          <Link
            to="/matches"
            className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
            data-ocid="home.view_all_matches"
          >
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        {ml ? (
          <div
            className="flex gap-3 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none" }}
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-64 h-36 shrink-0 rounded-xl" />
            ))}
          </div>
        ) : liveUpcoming.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No matches right now.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div
            className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {liveUpcoming.map((m, i) => (
              <Card
                key={m.id.toString()}
                className="w-64 shrink-0 bg-card border-border hover:border-primary/40 transition-all duration-200 cursor-pointer group"
                data-ocid={`home.match_card.${i + 1}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-medium ${sportColor(m.sport)}`}
                    >
                      <span className="flex items-center gap-1">
                        {sportIcon(m.sport)}
                        {m.sport}
                      </span>
                    </Badge>
                    {m.status === MatchStatus.Live && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px] flex items-center gap-1">
                        <LiveIndicatorDot />
                        LIVE
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    {m.teamA.logo && (
                      <img
                        src={m.teamA.logo}
                        alt={m.teamA.name}
                        className="h-6 w-6 object-contain"
                      />
                    )}
                    <div className="text-sm font-bold text-foreground">
                      {m.teamA.name} vs {m.teamB.name}
                    </div>
                    {m.teamB.logo && (
                      <img
                        src={m.teamB.logo}
                        alt={m.teamB.name}
                        className="h-6 w-6 object-contain"
                      />
                    )}
                  </div>
                  {m.liveStatus && (
                    <div className="text-xs text-primary font-medium mb-1">
                      {m.liveStatus}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mb-2">
                    {m.venue}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    {contestQs[i]?.data?.length || 0} contests
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {m.status === MatchStatus.Live
                        ? "In Progress"
                        : timeUntil(m.startTime)}
                    </div>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      asChild
                      data-ocid={`home.play_now_button.${i + 1}`}
                    >
                      <Link
                        to="/matches/$matchId"
                        params={{ matchId: m.id.toString() }}
                      >
                        Play Now
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* My Contests */}
      <section>
        <h2 className="text-lg font-display font-bold text-foreground mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          My Contests
        </h2>
        {hl ? (
          <div className="space-y-2">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        ) : !history || history.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">
                You haven't joined any contests yet.
              </p>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                asChild
                data-ocid="home.join_contest_cta"
              >
                <Link to="/contests">Join a Contest</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 3).map((e, i) => (
              <Card
                key={`${e.contestId}-${i}`}
                className="bg-card border-border hover:border-primary/30 transition-all duration-200"
                data-ocid={`home.my_contest.${i + 1}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        Contest #{e.contestId.toString()}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Joined{" "}
                        {new Date(
                          Number(e.joinedAt) / 1e6,
                        ).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-primary font-mono">
                        {fmtCurrency(e.prize)}
                      </div>
                      {e.rank !== undefined && (
                        <div className="text-xs text-muted-foreground">
                          Rank #{e.rank.toString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {history.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-primary hover:text-primary hover:bg-primary/10"
                asChild
                data-ocid="home.view_all_contests"
              >
                <Link to="/contests">View All Contests</Link>
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Quick Stats */}
      <section>
        <h2 className="text-lg font-display font-bold text-foreground mb-3">
          Quick Stats
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <Card
              key={s.label}
              className="bg-card border-border"
              data-ocid={`home.stat_card.${i + 1}`}
            >
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <s.icon className={`w-6 h-6 ${s.color}`} />
                <div className="text-lg font-bold text-foreground font-mono">
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
