import type React from "react";

export const LiveIndicatorDot: React.FC = () => (
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-live opacity-75" />
    <span className="relative inline-flex rounded-full h-3 w-3 bg-live" />
  </span>
);

export const BallIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Cricket ball icon"
    role="img"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M12 2C6.48 2 2 6.48 2 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 22C17.52 22 22 17.52 22 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M2 12C2 17.52 6.48 22 12 22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.5"
    />
    <path
      d="M22 12C22 6.48 17.52 2 12 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

export const WicketIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Wicket icon"
    role="img"
  >
    <rect x="8" y="2" width="2" height="20" fill="currentColor" />
    <rect x="14" y="2" width="2" height="20" fill="currentColor" />
    <rect x="6" y="4" width="12" height="2" fill="currentColor" />
    <rect x="6" y="18" width="12" height="2" fill="currentColor" />
    <circle
      cx="12"
      cy="12"
      r="3"
      fill="currentColor"
      className="animate-pulse"
    />
  </svg>
);

export const BoundaryArrow: React.FC<{
  className?: string;
  direction?: "up" | "down";
}> = ({ className = "w-4 h-4", direction = "up" }) => (
  <svg
    className={`${className} ${direction === "up" ? "text-boundary" : "text-destructive"}`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Boundary arrow icon"
    role="img"
  >
    <path
      d={
        direction === "up"
          ? "M12 4L12 20M12 4L6 10M12 4L18 10"
          : "M12 20L12 4M12 20L6 14M12 20L18 14"
      }
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ScoreChangeBadge: React.FC<{
  runs: number;
  className?: string;
}> = ({ runs, className = "" }) => {
  const isBoundary = runs >= 4;
  const isSix = runs === 6;
  const isWicket = runs === 0; // Simplified - in real app would check isWicket flag

  let bgColor = "bg-muted";
  let textColor = "text-muted-foreground";

  if (isSix) {
    bgColor = "bg-boundary/20";
    textColor = "text-boundary";
  } else if (isBoundary) {
    bgColor = "bg-boundary/10";
    textColor = "text-boundary";
  } else if (isWicket) {
    bgColor = "bg-destructive/10";
    textColor = "text-destructive";
  }

  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${bgColor} ${textColor} font-bold text-sm ${className}`}
    >
      {runs === 0 ? "W" : runs}
    </span>
  );
};

export const RankChangeIndicator: React.FC<{
  change: number;
  className?: string;
}> = ({ change, className = "" }) => {
  if (change === 0) return null;

  const isPositive = change > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${isPositive ? "text-success" : "text-destructive"} ${className}`}
    >
      <BoundaryArrow
        direction={isPositive ? "up" : "down"}
        className="w-3 h-3"
      />
      {Math.abs(change)}
    </span>
  );
};

export const LoadingSpinner: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-label="Loading spinner"
    role="img"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export const CricketBallAnimation: React.FC<{ className?: string }> = ({
  className = "w-8 h-8",
}) => (
  <svg
    className={`animate-bounce ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Cricket ball animation"
    role="img"
  >
    <circle cx="12" cy="12" r="10" fill="currentColor" className="text-live" />
    <path
      d="M12 2C6.48 2 2 6.48 2 12"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 22C17.52 22 22 17.52 22 12"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const LivePulseRing: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <span className={`relative inline-flex ${className}`}>
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-live opacity-75" />
    <span className="relative inline-flex rounded-full h-2 w-2 bg-live" />
  </span>
);
