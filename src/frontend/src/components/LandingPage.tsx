import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Award,
  ChevronRight,
  Circle,
  Crown,
  Flame,
  Swords,
  Target,
  Trophy,
  Wallet,
  Zap,
} from "lucide-react";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface LandingPageProps {
  onGetStarted: () => void;
}

const SPORTS = [
  {
    name: "Cricket",
    icon: Target,
    description: "IPL, International, T20 leagues",
    gradient: "from-primary/20 to-primary/5",
    border: "border-primary/30",
    active: true,
  },
  {
    name: "Football",
    icon: Circle,
    description: "Premier League, La Liga, ISL",
    gradient: "from-chart-2/20 to-chart-2/5",
    border: "border-chart-2/30",
    active: false,
  },
  {
    name: "Kabaddi",
    icon: Swords,
    description: "Pro Kabaddi League",
    gradient: "from-chart-5/20 to-chart-5/5",
    border: "border-chart-5/30",
    active: false,
  },
];

const FEATURES = [
  {
    icon: Wallet,
    title: "100Cr Budget",
    description: "Build your dream team within the salary cap",
  },
  {
    icon: Crown,
    title: "Captain 2x Points",
    description: "Strategic captain & vice-captain multipliers",
  },
  {
    icon: Trophy,
    title: "Live Leaderboards",
    description: "Real-time rankings during every match",
  },
  {
    icon: Award,
    title: "Real Prizes",
    description: "Win cash prizes in every contest",
  },
];

const STATS = [
  { value: 5_000_000, suffix: "+", label: "Active Players" },
  { value: 50_000, suffix: "+", label: "Daily Contests" },
  { value: 10, suffix: "Cr+", label: "Prizes Won" },
  { value: 99, suffix: "%", label: "Uptime" },
];

function AnimatedCounter({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.max(1, Math.floor(value / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  const format = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return n.toString();
  };

  return (
    <span ref={ref}>
      {format(count)}
      {suffix}
    </span>
  );
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      <LandingNav />
      <HeroSection onGetStarted={onGetStarted} />
      <StatsSection />
      <SportsSection />
      <FeaturesSection />
      <LandingFooter />
    </div>
  );
}

function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-glow-orange">
            <Flame className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-display font-bold tracking-tight bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
              Fantasy11
            </span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">
              Play · Compete · Win
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,oklch(0.62_0.22_35/0.08),transparent)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex mb-6"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary">
                <Zap className="w-3 h-3" />
                India&apos;s #1 Fantasy Sports Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground mb-6"
            >
              Play Fantasy <span className="text-primary">Cricket.</span>
              <br />
              Win Real Money.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-base sm:text-lg max-w-lg mb-10 leading-relaxed"
            >
              Create your dream IPL team, join mega contests, and compete with
              millions. Real-time scoring, live leaderboards, and instant
              withdrawals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-3 mb-8"
            >
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-12 text-sm font-bold group transition-all duration-200 shadow-glow-orange"
                data-ocid="landing.join_button"
              >
                Join & Play Free
                <ChevronRight className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-6 h-12 text-sm font-semibold border-border/60 hover:border-primary/40 hover:bg-primary/5"
                data-ocid="landing.watch_demo_button"
                onClick={() =>
                  document
                    .querySelector("#features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4 text-xs text-muted-foreground"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold text-foreground"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>Joined by 50L+ players this season</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
              <img
                src="/assets/generated/hero-cricket.dim_1200x600.jpg"
                alt="Cricket stadium"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-card rounded-2xl p-4 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Rohit_Sharma_November_2016_%28cropped%29.jpg/120px-Rohit_Sharma_November_2016_%28cropped%29.jpg"
                      alt="Rohit Sharma"
                      className="w-10 h-10 rounded-full border-2 border-background object-cover"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Mahendra_Singh_Dhoni_January_2016_%28cropped%29.jpg/120px-Mahendra_Singh_Dhoni_January_2016_%28cropped%29.jpg"
                      alt="MS Dhoni"
                      className="w-10 h-10 rounded-full border-2 border-background object-cover"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jasprit_Bumrah_%28cropped%29.jpg/120px-Jasprit_Bumrah_%28cropped%29.jpg"
                      alt="Jasprit Bumrah"
                      className="w-10 h-10 rounded-full border-2 border-background object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      MI vs CSK Live
                    </p>
                    <p className="text-xs text-muted-foreground">
                      142/4 (16.2) — Join now
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="bg-muted/30 border-y border-border/30 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <p className="font-display text-3xl sm:text-4xl font-bold text-primary mb-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SportsSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="bg-background py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-display text-3xl font-bold text-foreground mb-4 tracking-tight"
        >
          Choose Your Sport
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-muted-foreground max-w-lg mx-auto text-base mb-10"
        >
          Play fantasy cricket, football, and kabaddi. Multiple contests running
          daily.
        </motion.p>

        <div className="flex justify-center gap-2 mb-10">
          {SPORTS.map((sport, index) => {
            const Icon = sport.icon;
            const isActive = activeTab === index;
            return (
              <button
                type="button"
                key={sport.name}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-glow-orange"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80",
                )}
                data-ocid={`landing.sport_tab.${sport.name.toLowerCase()}`}
              >
                <Icon className="w-4 h-4" />
                {sport.name}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {SPORTS.map((sport, index) => (
            <motion.div
              key={sport.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "relative rounded-2xl border p-6 text-center transition-all duration-300",
                sport.border,
                activeTab === index
                  ? `bg-gradient-to-b ${sport.gradient} scale-[1.02] shadow-lg`
                  : "bg-card/50 opacity-70",
              )}
            >
              <div className="w-14 h-14 bg-card rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <sport.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-bold text-foreground text-lg mb-1">
                {sport.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {sport.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/30 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center font-display text-3xl font-bold text-foreground mb-4 tracking-tight"
        >
          Why Fantasy11?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-muted-foreground max-w-lg mx-auto text-base mb-12"
        >
          The most trusted fantasy sports platform with millions of active
          players
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-2 text-sm">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="bg-card border-t border-border py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <Flame className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-foreground font-display font-bold text-sm">
            Fantasy11
          </span>
        </div>

        <p className="text-muted-foreground text-sm text-center">
          Play responsibly. Fantasy sports involve an element of financial risk.
        </p>

        <div className="text-muted-foreground text-xs text-right">
          <p>© {new Date().getFullYear()} Fantasy11</p>
          <p className="mt-0.5">
            Built with{" "}
            <a
              href="https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=Fantasy11"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
