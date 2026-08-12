import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
export type User = { id: string; email: string };

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    let isMounted = true;

    fetch("/api/auth/me", { headers: authHeaders() })
      .then((response) => response.ok ? response.json() : null)
      .then((data: { user?: User } | null) => { if (isMounted) setUser(data?.user ?? null); })
      .catch(() => { if (isMounted) setUser(null); })
      .finally(() => { if (isMounted) setIsLoading(false); });
    return () => { isMounted = false; };
  }, [queryClient]);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await fetch("/api/auth/logout", { method: "POST", headers: authHeaders() });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: async () => {
      const response = await fetch("/api/profile", { headers: authHeaders() });
      if (!response.ok) throw new Error("Gagal memuat profil");
      return response.json();
    },
    enabled: !!useAuth().user,
  });
}

export function authHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? window.localStorage.getItem("auth_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
