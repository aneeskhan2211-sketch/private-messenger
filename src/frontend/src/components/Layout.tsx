import { useWalletBalance } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { Wallet } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { data: balance } = useWalletBalance();

  return (
    <div className="flex flex-col h-dvh bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border px-4 h-14 flex items-center justify-between shrink-0">
        <Link
          to="/"
          className="flex items-center gap-2"
          data-ocid="layout.logo_link"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-glow-orange">
            <span className="text-primary-foreground font-bold text-sm">
              F11
            </span>
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight">
            Fantasy11
          </span>
        </Link>
        <div
          className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5 border border-border/50"
          data-ocid="layout.wallet_balance"
        >
          <Wallet className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground font-mono">
            ₹{balance ? (Number(balance) / 100).toFixed(2) : "0.00"}
          </span>
        </div>
      </header>
      <div className="flex flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
