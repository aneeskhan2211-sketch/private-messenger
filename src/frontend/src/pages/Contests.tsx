import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useMatches } from "@/hooks/useQueries";
import { ContestType, MatchStatus, Sport } from "@/types";
import type { Contest } from "@/types";
import { useQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Circle,
  Crown,
  Swords,
  Target,
  Trophy,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { useState } from "react";

type SportFilter = "All" | "Cricket" | "Football" | "Kabaddi";

function fmtCurrency(n: bigint) {
  return n === BigInt(0) ? "FREE" : `₹${(Number(n) / 100).toFixed(2)}`;
}

function contestTypeBadge(type: ContestType) {
  switch (type) {
    case ContestType.MegaLeague:
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case ContestType.Head2Head:
      return "bg-sky-500/15 text-sky-400 border-sky-500/30";
    case ContestType.Practice:
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case ContestType.MiniLeague:
      return "bg-purple-500/15 text-purple-400 border-purple-500/30";
  }
}

function contestTypeLabel(type: ContestType) {
  switch (type) {
    case ContestType.MegaLeague:
      return "Mega League";
    case ContestType.Head2Head:
      return "Head to Head";
    case ContestType.Practice:
      return "Practice";
    case ContestType.MiniLeague:
      return "Small League";
  }
}

function sportIcon(s: Sport) {
  switch (s) {
    case Sport.Cricket:
      return <Target className="w-5 h-5 text-emerald-400" />;
    case Sport.Football:
      return <Circle className="w-5 h-5 text-sky-400" />;
    case Sport.Kabaddi:
      return <Swords className="w-5 h-5 text-amber-400" />;
  }
}

export default function ContestsPage() {
  const [sport, setSport] = useState<SportFilter>("All");
  const { actor } = useActor();
  const { data: matches, isLoading: ml } = useMatches();

  const contestQs = useQueries({
    queries: (matches || []).map((m) => ({
      queryKey: ["contests", m.id.toString()],
      queryFn: async () => {
        if (!actor) return [] as Contest[];
        return actor.getContests(m.id);
      },
      enabled: !!actor,
      refetchInterval: 30000,
    })),
  });

  const loading = ml || contestQs.some((q) => q.isLoading);
  const allContests = contestQs
    .flatMap((q, i) => {
      const m = matches?.[i];
      return (q.data || []).map((c) => ({
        ...c,
        matchSport: m?.sport,
        matchStatus: m?.status,
        matchName: m ? `${m.teamA.name} vs ${m.teamB.name}` : undefined,
      }));
    })
    .filter((c) => sport === "All" || c.matchSport === sport);

  const sorted = allContests.sort((a, b) => {
    if (
      a.matchStatus === MatchStatus.Live &&
      b.matchStatus !== MatchStatus.Live
    )
      return -1;
    if (
      a.matchStatus !== MatchStatus.Live &&
      b.matchStatus === MatchStatus.Live
    )
      return 1;
    return Number(b.prizePool) - Number(a.prizePool);
  });

  const filters = [
    { label: "All" as SportFilter, icon: Zap },
    { label: "Cricket" as SportFilter, icon: Target },
    { label: "Football" as SportFilter, icon: Circle },
    { label: "Kabaddi" as SportFilter, icon: Swords },
  ];

  return (
    <div className="space-y-4 p-4 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          Contests
        </h1>
        <Badge variant="outline" className="text-xs font-mono">
          {sorted.length} available
        </Badge>
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4"
        style={{ scrollbarWidth: "none" }}
      >
        {filters.map(({ label, icon: Icon }) => {
          const active = sport === label;
          return (
            <button
              type="button"
              key={label}
              onClick={() => setSport(label)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${active ? "bg-primary text-primary-foreground shadow-sm" : "bg-card text-muted-foreground border border-border hover:text-foreground hover:border-primary/30"}`}
              data-ocid={`contests.sport_filter.${label.toLowerCase()}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <Trophy className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-1">
              No contests found for {sport}.
            </p>
            <p className="text-xs text-muted-foreground">
              Try selecting a different sport or check back later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sorted.map((c, i) => {
            const fill = Math.min(
              100,
              Math.round((Number(c.filledSpots) / Number(c.maxEntries)) * 100),
            );
            const live = c.matchStatus === MatchStatus.Live;
            const free = c.entryFee === BigInt(0);
            return (
              <Card
                key={c.id.toString()}
                className="bg-card border-border hover:border-primary/40 transition-all duration-200 group cursor-pointer overflow-hidden"
                data-ocid={`contests.card.${i + 1}`}
              >
                <CardContent className="p-0">
                  {/* Top bar with sport icon and contest type */}
                  <div className="flex items-center justify-between px-4 pt-4 pb-2">
                    <div className="flex items-center gap-2">
                      {c.matchSport && sportIcon(c.matchSport)}
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold uppercase tracking-wider ${contestTypeBadge(c.contestType)}`}
                      >
                        {c.contestType === ContestType.MegaLeague && (
                          <Crown className="w-3 h-3 mr-1" />
                        )}
                        {contestTypeLabel(c.contestType)}
                      </Badge>
                    </div>
                    {live && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px] animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1" />
                        LIVE
                      </Badge>
                    )}
                  </div>

                  {/* Prize Pool */}
                  <div className="px-4 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-5 h-5 text-primary" />
                      <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                        Prize Pool
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-foreground font-display tracking-tight">
                      {fmtCurrency(c.prizePool)}
                    </div>
                    {c.matchName && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {c.matchName}
                      </p>
                    )}
                  </div>

                  {/* Entry fee pill and participants */}
                  <div className="px-4 pb-3 flex items-center gap-3">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${free ? "bg-emerald-500/15 text-emerald-400" : "bg-primary/10 text-primary"}`}
                    >
                      {free ? "FREE ENTRY" : fmtCurrency(c.entryFee)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      {c.filledSpots.toString()}/{c.maxEntries.toString()}
                    </div>
                  </div>

                  {/* Progress bar with gradient */}
                  <div className="px-4 pb-4">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                      <span className="font-medium">{fill}% filled</span>
                      <span>
                        {Number(c.maxEntries) - Number(c.filledSpots)} spots
                        left
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${fill}%`,
                          background:
                            "linear-gradient(90deg, var(--primary), oklch(0.7 0.2 45))",
                        }}
                      />
                    </div>
                  </div>

                  {/* Join button */}
                  <div className="px-4 pb-4">
                    <Button
                      size="sm"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs h-10 font-semibold"
                      asChild
                      data-ocid={`contests.join_button.${i + 1}`}
                    >
                      <Link
                        to="/contests/$contestId"
                        params={{ contestId: c.id.toString() }}
                      >
                        Join Contest
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
