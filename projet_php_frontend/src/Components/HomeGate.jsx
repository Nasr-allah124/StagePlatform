import React, { useEffect, useMemo, useState } from "react";
import Landing from "./Lading_home";
import Home from "./Home";

export default function HomeGate() {
  const API_BASE_URL = useMemo(
    () =>
      (import.meta.env.VITE_API_BASE_URL || "http://localhost:8010/api").replace(
        /\/$/,
        ""
      ),
    []
  );

  const [state, setState] = useState({
    loading: true,
    user: null,
  });

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await fetch(`${API_BASE_URL}/me.php`, {
          credentials: "include",
        });
        const data = await res.json().catch(() => null);

        if (!alive) return;

        if (res.ok && data?.ok) setState({ loading: false, user: data.user });
        else setState({ loading: false, user: null });
      } catch {
        if (!alive) return;
        setState({ loading: false, user: null });
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [API_BASE_URL]);

  if (state.loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-700 dark:text-slate-300 text-sm">Chargement...</div>
      </div>
    );
  }

  // ✅ connecté => Home, sinon => Landing
  return state.user ? <Home user={state.user} /> : <Landing />;
}
