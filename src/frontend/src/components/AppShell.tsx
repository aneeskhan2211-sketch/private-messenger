import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMatches, useWalletBalance } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { MatchStatus } from "@/types";
import { Link, useLocation } from "@tanstack/react-router";
import {
  CreditCard,
  Home,
  LogOut,
  Trophy,
  User,
  Users,
  Wallet,
} from "lucide-react";

function CricketBallIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Cricket ball"
    >
      <title>Cricket ball icon</title>
      <circle cx="12" cy="12" r="9" fill="currentColor" />
      <path
        d="M7.5 7.5c1.5 3 1.5 6 0 9M16.5 7.5c-1.5 3-1.5 6 0 9"
        stroke="var(--background)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2" fill="var(--background)" />
    </svg>
  );
}

interface AppShellProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/contests", icon: Trophy, label: "Contests" },
  { to: "/teams", icon: Users, label: "Teams" },
  { to: "/wallet", icon: CreditCard, label: "Wallet" },
  { to: "/account", icon: User, label: "Account" },
];

export function AppShell({ children, onLogout }: AppShellProps) {
  const { data: balance } = useWalletBalance();
  const { data: matches } = useMatches();
  const location = useLocation();
  const liveCount =
    matches?.filter((m) => m.status === MatchStatus.Live).length ?? 0;

  return (
    <div className="flex flex-col h-dvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-4 h-14 flex items-center justify-between shrink-0">
        <Link
          to="/"
          className="flex items-center gap-2.5"
          data-ocid="appshell.logo_link"
        >
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-glow-orange">
            <CricketBallIcon className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
              Fantasy11
            </span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">
              Play · Compete · Win
            </span>
          </div>
        </Link>
        {liveCount > 0 && (
          <Badge
            variant="outline"
            className="hidden sm:inline-flex border-red-500/40 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider gap-1"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
            </span>
            {liveCount} Live
          </Badge>
        )}
        <div
          className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5 border border-border/50"
          data-ocid="appshell.wallet_balance"
        >
          <Wallet className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground font-mono">
            ₹{balance ? (Number(balance) / 100).toFixed(2) : "0.00"}
          </span>
        </div>
      </header>

      {/* Main content area with side nav on desktop */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col shrink-0">
          <nav className="flex flex-col gap-1 p-4 flex-1">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
              const isActive =
                location.pathname === to ||
                location.pathname.startsWith(`${to}/`);
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                  data-ocid={`appshell.nav.${label.toLowerCase()}`}
                >
                  <Icon
                    className="w-5 h-5"
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={onLogout}
              data-ocid="appshell.logout_button"
            >
              <LogOut className="w-5 h-5" strokeWidth={1.8} />
              <span className="text-sm font-medium">Log Out</span>
            </Button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 overflow-auto">{children}</div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden shrink-0 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
            const isActive =
              location.pathname === to ||
              location.pathname.startsWith(`${to}/`);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 h-full flex-1 min-w-0 transition-colors duration-150",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
                data-ocid={`appshell.mobile_nav.${label.toLowerCase()}`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="text-[10px] font-medium leading-none">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
