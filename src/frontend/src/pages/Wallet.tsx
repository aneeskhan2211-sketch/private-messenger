import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateCheckoutSession,
  useTransactions,
  useWalletBalance,
  useWithdrawRequest,
} from "@/hooks/useQueries";
import { TransactionKind } from "@/types";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Loader2,
  Minus,
  Plus,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PRESET_AMOUNTS = [100, 500, 1000, 5000];

function formatCurrency(amount: bigint): string {
  return `₹${(Number(amount) / 100).toFixed(2)}`;
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function transactionLabel(kind: TransactionKind): string {
  switch (kind) {
    case TransactionKind.Deposit:
      return "Deposit";
    case TransactionKind.Withdrawal:
      return "Withdrawal";
    case TransactionKind.PrizeCredit:
      return "Prize Won";
    case TransactionKind.ContestEntry:
      return "Contest Entry";
    case TransactionKind.Refund:
      return "Refund";
    default:
      return "Transaction";
  }
}

function transactionBadgeVariant(
  kind: TransactionKind,
): "default" | "secondary" | "destructive" | "outline" {
  switch (kind) {
    case TransactionKind.Deposit:
    case TransactionKind.PrizeCredit:
    case TransactionKind.Refund:
      return "default";
    case TransactionKind.Withdrawal:
    case TransactionKind.ContestEntry:
      return "destructive";
    default:
      return "secondary";
  }
}

function isCredit(kind: TransactionKind): boolean {
  return (
    kind === TransactionKind.Deposit ||
    kind === TransactionKind.PrizeCredit ||
    kind === TransactionKind.Refund
  );
}

export default function WalletPage() {
  const { data: balance, isLoading: balanceLoading } = useWalletBalance();
  const { data: transactions, isLoading: txLoading } = useTransactions();
  const createCheckout = useCreateCheckoutSession();
  const withdraw = useWithdrawRequest();

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const activeAmount =
    selectedAmount ?? (customAmount ? Number(customAmount) : null);

  const handleAddMoney = async () => {
    if (!activeAmount || activeAmount <= 0) {
      toast.error("Please select or enter an amount");
      return;
    }
    try {
      const url = await createCheckout.mutateAsync(BigInt(activeAmount * 100));
      window.location.href = url;
    } catch {
      toast.error("Failed to create checkout session");
    }
  };

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      await withdraw.mutateAsync(BigInt(amount * 100));
      toast.success("Withdrawal request submitted");
      setWithdrawAmount("");
    } catch {
      toast.error("Withdrawal request failed");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
      {/* Balance Card */}
      <Card className="relative overflow-hidden border-primary/20 shadow-glow-orange">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <CardHeader className="relative pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            Available Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          {balanceLoading ? (
            <Skeleton className="h-12 w-48" />
          ) : (
            <div className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">
              {formatCurrency(balance ?? BigInt(0))}
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Use your balance to join contests and win prizes
          </p>
        </CardContent>
      </Card>

      {/* Add Money */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Add Money
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  setSelectedAmount(amt);
                  setCustomAmount("");
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150 ${
                  selectedAmount === amt
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:border-primary/50"
                }`}
                data-ocid={`wallet.preset_${amt}_button`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Or enter custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              className="flex-1"
              data-ocid="wallet.custom_amount_input"
            />
            <Button
              onClick={handleAddMoney}
              disabled={
                !activeAmount || activeAmount <= 0 || createCheckout.isPending
              }
              className="shrink-0"
              data-ocid="wallet.add_money_button"
            >
              {createCheckout.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Withdraw */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Minus className="w-4 h-4 text-destructive" />
            Withdraw
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter amount to withdraw"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="flex-1"
              data-ocid="wallet.withdraw_input"
            />
            <Button
              variant="destructive"
              onClick={handleWithdraw}
              disabled={
                !withdrawAmount ||
                Number(withdrawAmount) <= 0 ||
                withdraw.isPending
              }
              className="shrink-0"
              data-ocid="wallet.withdraw_button"
            >
              {withdraw.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Request"
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Withdrawals are processed within 24-48 hours to your linked account.
          </p>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {txLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no stable identity
                <Skeleton key={`skeleton-tx-${i}`} className="h-14 w-full" />
              ))}
            </div>
          ) : !transactions || transactions.length === 0 ? (
            <div
              className="text-center py-8 text-muted-foreground"
              data-ocid="wallet.empty_state"
            >
              <Wallet className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No transactions yet</p>
              <p className="text-xs mt-1">
                Add money or join a contest to get started
              </p>
            </div>
          ) : (
            <ScrollArea className="h-80">
              <div className="space-y-2">
                {transactions.map((tx, idx) => (
                  <div
                    key={tx.id.toString()}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                    data-ocid={`wallet.transaction.item.${idx + 1}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isCredit(tx.kind)
                            ? "bg-primary/10 text-primary"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {isCredit(tx.kind) ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {tx.note || transactionLabel(tx.kind)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(tx.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p
                        className={`text-sm font-semibold font-mono ${
                          isCredit(tx.kind)
                            ? "text-primary"
                            : "text-destructive"
                        }`}
                      >
                        {isCredit(tx.kind) ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </p>
                      <Badge
                        variant={transactionBadgeVariant(tx.kind)}
                        className="text-[10px] mt-1"
                      >
                        {transactionLabel(tx.kind)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
