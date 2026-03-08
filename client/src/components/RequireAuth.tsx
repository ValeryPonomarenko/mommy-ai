import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Redirects to /login if no token, to /onboarding if token but no profile.
 * Renders children only when authenticated and onboarded.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const { token, profile, ready, loading } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      setLocation("/login");
      return;
    }
    if (!profile) {
      setLocation("/onboarding");
    }
  }, [ready, token, profile, setLocation]);

  if (!ready || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Загрузка…</p>
      </div>
    );
  }
  if (!token || !profile) {
    return null;
  }
  return <>{children}</>;
}
