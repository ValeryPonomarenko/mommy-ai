import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { seedSampleDataIfNeeded } from "@/lib/healthMetrics";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import CalendarPage from "@/pages/CalendarPage";
import ChatPage from "@/pages/ChatPage";
import AnalysisPage from "@/pages/AnalysisPage";
import AnalysisDetailPage from "@/pages/AnalysisDetailPage";
import TrackPage from "@/pages/TrackPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/analysis/:id" component={AnalysisDetailPage} />
      <Route path="/analysis" component={AnalysisPage} />
      <Route path="/track/:metric" component={TrackPage} />
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
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
