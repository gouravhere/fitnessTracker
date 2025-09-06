import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthGuard } from "@/components/auth-guard";
import { Sidebar } from "@/components/sidebar";
import { isAuthenticated } from "@/lib/auth";

// Pages
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Workouts from "@/pages/workouts";
import Meals from "@/pages/meals";
import Progress from "@/pages/progress";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        <AuthGuard>
          <Dashboard />
        </AuthGuard>
      </Route>
      <Route path="/workouts">
        <AuthGuard>
          <Workouts />
        </AuthGuard>
      </Route>
      <Route path="/meals">
        <AuthGuard>
          <Meals />
        </AuthGuard>
      </Route>
      <Route path="/progress">
        <AuthGuard>
          <Progress />
        </AuthGuard>
      </Route>
      <Route path="/analytics">
        <AuthGuard>
          <Analytics />
        </AuthGuard>
      </Route>
      <Route path="/settings">
        <AuthGuard>
          <Settings />
        </AuthGuard>
      </Route>
      <Route path="/">
        {isAuthenticated() ? <Dashboard /> : <Login />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:ml-64">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button className="lg:hidden text-foreground">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg" data-testid="button-notifications">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M9 21v-6a2 2 0 012-2h2M9 21l2-2" />
                </svg>
              </button>
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg" data-testid="button-search">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppLayout>
          <Router />
        </AppLayout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
