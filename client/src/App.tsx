import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";
import { seedSampleDataIfNeeded } from "@/lib/healthMetrics";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import CalendarPage from "@/pages/CalendarPage";
import ChatPage from "@/pages/ChatPage";
import AnalysisPage from "@/pages/AnalysisPage";
import AnalysisDetailPage from "@/pages/AnalysisDetailPage";
import TrackPage from "@/pages/TrackPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import OnboardingPage from "@/pages/OnboardingPage";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/">
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      </Route>
      <Route path="/calendar">
        <RequireAuth>
          <CalendarPage />
        </RequireAuth>
      </Route>
      <Route path="/chat">
        <RequireAuth>
          <ChatPage />
        </RequireAuth>
      </Route>
      <Route path="/analysis/:id">
        <RequireAuth>
          <AnalysisDetailPage />
        </RequireAuth>
      </Route>
      <Route path="/analysis">
        <RequireAuth>
          <AnalysisPage />
        </RequireAuth>
      </Route>
      <Route path="/track/:metric">
        <RequireAuth>
          <TrackPage />
        </RequireAuth>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    seedSampleDataIfNeeded();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
