import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getMe, type MeResponse } from "@/lib/authApi";
import { setStoredToken, getStoredToken } from "@/lib/authStorage";

type AuthState = {
  token: string | null;
  user: MeResponse["user"] | null;
  profile: MeResponse["profile"] | null;
  loading: boolean;
  ready: boolean;
};

const AuthContext = createContext<{
  token: string | null;
  user: MeResponse["user"] | null;
  profile: MeResponse["profile"] | null;
  loading: boolean;
  ready: boolean;
  setToken: (token: string | null) => void;
  logout: () => void;
  refreshMe: () => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
    profile: null,
    loading: true,
    ready: false,
  });

  const refreshMe = useCallback(async () => {
    const t = getStoredToken();
    if (!t) {
      setState((s) => ({
        ...s,
        token: null,
        user: null,
        profile: null,
        loading: false,
        ready: true,
      }));
      return;
    }
    try {
      const me = await getMe(t);
      setState((s) => ({
        ...s,
        token: t,
        user: me.user,
        profile: me.profile ?? null,
        loading: false,
        ready: true,
      }));
    } catch {
      setStoredToken(null);
      setState((s) => ({
        ...s,
        token: null,
        user: null,
        profile: null,
        loading: false,
        ready: true,
      }));
    }
  }, []);

  useEffect(() => {
    const t = getStoredToken();
    if (!t) {
      setState((s) => ({ ...s, loading: false, ready: true }));
      return;
    }
    refreshMe();
  }, [refreshMe]);

  const setToken = useCallback((token: string | null) => {
    setStoredToken(token);
    setState((s) => ({ ...s, token, loading: true, ready: false }));
    if (token) {
      getMe(token)
        .then((me) =>
          setState((s) => ({
            ...s,
            token,
            user: me.user,
            profile: me.profile ?? null,
            loading: false,
            ready: true,
          }))
        )
        .catch(() => {
          setStoredToken(null);
          setState((s) => ({
            ...s,
            token: null,
            user: null,
            profile: null,
            loading: false,
            ready: true,
          }));
        });
    } else {
      setState((s) => ({
        ...s,
        token: null,
        user: null,
        profile: null,
        loading: false,
        ready: true,
      }));
    }
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null);
    setState({
      token: null,
      user: null,
      profile: null,
      loading: false,
      ready: true,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        setToken,
        logout,
        refreshMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { getStoredToken } from "@/lib/authStorage";
