import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Toaster } from "sonner";
import { AppShell } from "./components/AppShell";
import { LandingPage } from "./components/LandingPage";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AccountPage from "./pages/Account";
import ContestDetailPage from "./pages/ContestDetail";
import ContestsPage from "./pages/Contests";
import HomePage from "./pages/Home";
import MatchDetailPage from "./pages/MatchDetail";
import MatchesPage from "./pages/Matches";
import MyTeamsPage from "./pages/MyTeams";
import WalletPage from "./pages/Wallet";

const rootRoute = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { identity, isInitializing, login, clear } = useInternetIdentity();
  const { actor } = useActor();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!identity || !actor) {
    return <LandingPage onGetStarted={login} />;
  }

  return (
    <AppShell onLogout={clear}>
      <Outlet />
    </AppShell>
  );
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const matchesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "matches",
  component: MatchesPage,
});

const matchDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "matches/$matchId",
  component: MatchDetailPage,
});

const contestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "contests",
  component: ContestsPage,
});

const contestDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "contests/$contestId",
  component: ContestDetailPage,
});

const teamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "teams",
  component: MyTeamsPage,
});

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "wallet",
  component: WalletPage,
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "account",
  component: AccountPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  matchesRoute,
  matchDetailRoute,
  contestsRoute,
  contestDetailRoute,
  teamsRoute,
  walletRoute,
  accountRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" />
    </>
  );
}
