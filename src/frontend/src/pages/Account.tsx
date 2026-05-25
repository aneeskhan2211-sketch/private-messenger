import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useContestHistory,
  useSetUserProfile,
  useUserProfile,
} from "@/hooks/useQueries";
import {
  Check,
  Flame,
  LogOut,
  Medal,
  Pencil,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

function formatCurrency(amount: bigint): string {
  return `₹${(Number(amount) / 100).toFixed(2)}`;
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function WinRateRing({ rate }: { rate: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (rate / 100) * circumference;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg
        className="w-20 h-20 -rotate-90"
        viewBox="0 0 64 64"
        role="img"
        aria-label="Win rate progress"
      >
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth="6"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-foreground">{rate}%</span>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: history, isLoading: historyLoading } = useContestHistory();
  const setProfile = useSetUserProfile();
  const { clear } = useInternetIdentity();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.username ?? "");

  const handleSaveName = async () => {
    if (!displayName.trim()) {
      toast.error("Display name cannot be empty");
      return;
    }
    try {
      await setProfile.mutateAsync({
        username: displayName.trim(),
        phone: profile?.phone ?? null,
      });
      toast.success("Profile updated");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleCancelEdit = () => {
    setDisplayName(profile?.username ?? "");
    setIsEditing(false);
  };

  const contestsJoined = history?.length ?? 0;
  const totalWinnings =
    history?.reduce((sum, h) => sum + Number(h.prize), 0) ?? 0;
  const wins = history?.filter((h) => h.prize > 0).length ?? 0;
  const winRate =
    contestsJoined > 0 ? Math.round((wins / contestsJoined) * 100) : 0;

  const streak = wins > 0 ? Math.min(wins, 5) : 0;

  if (profileLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4 max-w-3xl mx-auto">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const avatarColor = stringToColor(profile?.principal.toString() ?? "user");
  const initials = getInitials(profile?.username ?? "U");

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
      {/* Hero Profile Card */}
      <Card className="border-border overflow-hidden">
        <div className="relative">
          {/* Gradient background */}
          <div
            className="h-32 w-full"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.62 0.22 35 / 0.3), oklch(0.15 0.01 260 / 0.8))",
            }}
          />

          {/* Avatar overlay */}
          <div className="px-6 pb-6">
            <div className="relative -mt-12 mb-4 flex items-end justify-between">
              <div className="flex items-end gap-4">
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0 border-4 border-card shadow-lg"
                  style={{ backgroundColor: avatarColor }}
                  data-ocid="account.avatar"
                >
                  {initials}
                </div>
                <div className="pb-1">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="max-w-xs h-9"
                        autoFocus
                        data-ocid="account.name_input"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-primary"
                        onClick={handleSaveName}
                        disabled={setProfile.isPending}
                        data-ocid="account.save_name_button"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-muted-foreground"
                        onClick={handleCancelEdit}
                        data-ocid="account.cancel_name_button"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-display font-bold text-foreground">
                        {profile?.username ?? "User"}
                      </h2>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-7 h-7 text-muted-foreground"
                        onClick={() => setIsEditing(true)}
                        data-ocid="account.edit_name_button"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground font-mono mt-0.5 break-all">
                    {profile?.principal.toString()}
                  </p>
                </div>
              </div>

              {/* Streak badge */}
              {streak > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 mb-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-bold text-orange-400">
                    {streak}
                  </span>
                  <span className="text-[10px] text-orange-400 uppercase font-medium">
                    Win Streak
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {profile?.kycDone && (
                <Badge variant="default" className="text-[10px]">
                  KYC Verified
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                Joined {profile ? formatDate(profile.joinedAt) : "—"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <Target className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-xl font-bold text-foreground font-display">
              {contestsJoined}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Contests
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <Trophy className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-xl font-bold text-foreground font-display">
              {formatCurrency(BigInt(totalWinnings))}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Winnings
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-xl font-bold text-foreground font-display">
              {wins}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Wins
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex flex-col items-center">
            <WinRateRing rate={winRate} />
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">
              Win Rate
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contest History */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Medal className="w-4 h-4 text-primary" />
            Contest History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : !history || history.length === 0 ? (
            <div
              className="text-center py-8 text-muted-foreground"
              data-ocid="account.history_empty_state"
            >
              <Trophy className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No contests played yet</p>
              <p className="text-xs mt-1">
                Join a contest to see your history here
              </p>
            </div>
          ) : (
            <ScrollArea className="h-80">
              <div className="space-y-2">
                {history.map((entry, idx) => (
                  <div
                    key={`${entry.contestId}-${entry.teamId}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors"
                    data-ocid={`account.history.item.${idx + 1}`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          Contest #{entry.contestId.toString()}
                        </p>
                        {entry.prize > 0 && (
                          <Badge className="bg-primary/10 text-primary text-[10px] border-0">
                            +{formatCurrency(entry.prize)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Team #{entry.teamId.toString()} •{" "}
                        {formatDate(entry.joinedAt)}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-sm font-semibold font-mono text-foreground">
                        {entry.points.toFixed(1)} pts
                      </p>
                      {entry.rank !== undefined && (
                        <p className="text-xs text-muted-foreground">
                          Rank #{entry.rank.toString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Logout */}
      <Separator />
      <Button
        variant="outline"
        className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
        onClick={() => {
          clear();
          toast.success("Logged out successfully");
        }}
        data-ocid="account.logout_button"
      >
        <LogOut className="w-4 h-4" />
        Log Out
      </Button>
    </div>
  );
}
