import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  Crown,
  Medal,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import {
  useContest,
  useJoinContest,
  useLeaderboard,
  useMyTeams,
} from "../hooks/useQueries";

function formatPrize(amount: bigint): string {
  return `₹${(Number(amount) / 100).toFixed(2)}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue} 65% 45%)`;
}

function getRankStyle(rank: bigint): string {
  const r = Number(rank);
  if (r === 1) return "bg-primary/20 border-primary/30";
  if (r === 2) return "bg-primary/15 border-primary/20";
  if (r === 3) return "bg-primary/10 border-primary/10";
  return "";
}

function getRankIcon(rank: bigint) {
  const r = Number(rank);
  if (r === 1) return <Crown className="w-5 h-5 text-amber-400" />;
  if (r === 2) return <Medal className="w-5 h-5 text-slate-300" />;
  if (r === 3) return <Award className="w-5 h-5 text-amber-600" />;
  return (
    <span className="text-muted-foreground text-sm font-bold w-5 h-5 flex items-center justify-center">
      {r}
    </span>
  );
}

function getTrendIndicator(current: number, previous: number) {
  if (current > previous) {
    return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
  }
  if (current < previous) {
    return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
  }
  return null;
}

export default function ContestDetail() {
  const { contestId } = useParams({ from: "/contests/$contestId" });
  const {
    data: contest,
    isLoading: contestLoading,
    error: contestError,
  } = useContest(contestId);
  const { data: leaderboard, isLoading: leaderboardLoading } =
    useLeaderboard(contestId);
  const { data: myTeams } = useMyTeams();
  const joinContest = useJoinContest();

  const matchTeams = useMemo(() => {
    if (!myTeams || !contest) return [];
    return myTeams.filter((t) => t.matchId === contest.matchId);
  }, [myTeams, contest]);

  const handleJoin = async () => {
    if (!contest || matchTeams.length === 0) {
      toast.error("You need to create a team first");
      return;
    }
    try {
      await joinContest.mutateAsync({
        contestId: contest.id,
        teamId: matchTeams[0].id,
      });
      toast.success("Joined contest successfully!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to join contest",
      );
    }
  };

  if (contestLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="mx-auto max-w-5xl space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (contestError || !contest) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Failed to load contest</p>
          <Link
            to="/contests"
            className="text-primary hover:underline"
            data-ocid="contestdetail.error_back_link"
          >
            Back to Contests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Back Link */}
        <Link
          to="/matches/$matchId"
          params={{ matchId: String(contest.matchId) }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="contestdetail.back_link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Match
        </Link>

        {/* Contest Info */}
        <Card className="bg-card border-border overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-muted/30 p-4 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                    {contest.name}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {contest.contestType}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-primary font-mono">
                    {formatPrize(contest.prizePool)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Prize Pool
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-card rounded-xl border border-border">
                  <div className="text-lg font-semibold text-foreground">
                    {formatPrize(contest.entryFee)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Entry Fee
                  </div>
                </div>
                <div className="text-center p-3 bg-card rounded-xl border border-border">
                  <div className="text-lg font-semibold text-foreground flex items-center justify-center gap-1">
                    <Users className="w-4 h-4" />
                    {Number(contest.filledSpots)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Participants
                  </div>
                </div>
                <div className="text-center p-3 bg-card rounded-xl border border-border">
                  <div className="text-lg font-semibold text-foreground flex items-center justify-center gap-1">
                    <Trophy className="w-4 h-4 text-primary" />
                    {Number(contest.maxEntries)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Max Spots
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={handleJoin}
                  disabled={joinContest.isPending || matchTeams.length === 0}
                  data-ocid="contestdetail.join_button"
                >
                  {joinContest.isPending
                    ? "Joining..."
                    : matchTeams.length === 0
                      ? "Create a Team First"
                      : `Join Contest - ${formatPrize(contest.entryFee)}`}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {leaderboardLoading ? (
              <div className="p-4 space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : !leaderboard || leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No entries yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="w-16 text-muted-foreground">
                        Rank
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        User
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Team
                      </TableHead>
                      <TableHead className="text-right text-muted-foreground">
                        Points
                      </TableHead>
                      <TableHead className="text-right text-muted-foreground">
                        Prize
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.map((entry, idx) => {
                      const prevPoints =
                        idx > 0 ? leaderboard[idx - 1].points : entry.points;
                      const avatarColor = stringToColor(
                        entry.principal.toString(),
                      );
                      const initials = getInitials(entry.teamName);
                      return (
                        <TableRow
                          key={`${entry.rank}-${String(entry.principal)}`}
                          className={`border-border ${getRankStyle(entry.rank)}`}
                          data-ocid={`contestdetail.leaderboard_row.${idx + 1}`}
                        >
                          <TableCell className="font-medium">
                            <span className="flex items-center gap-2">
                              {getRankIcon(entry.rank)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                                style={{ backgroundColor: avatarColor }}
                              >
                                {initials}
                              </div>
                              <span className="font-mono text-xs text-muted-foreground">
                                {entry.principal.toString().slice(0, 8)}...
                                {entry.principal.toString().slice(-6)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground font-medium">
                            {entry.teamName}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <span className="font-mono font-semibold text-foreground">
                                {entry.points.toFixed(1)}
                              </span>
                              {getTrendIndicator(entry.points, prevPoints)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {entry.prize > 0 ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
                                {formatPrize(entry.prize)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                —
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
