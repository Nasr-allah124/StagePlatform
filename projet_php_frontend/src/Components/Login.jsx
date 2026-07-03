import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const errors = useMemo(() => {
    const e = {};
    const email = form.email.trim();
    if (!email) e.email = "Email requis.";
    else if (!validateEmail(email)) e.email = "Email invalide.";

    if (!form.password) e.password = "Mot de passe requis.";
    else if (form.password.length < 6) e.password = "Minimum 6 caractères.";

    return e;
  }, [form.email, form.password]);

  const canSubmit = Object.keys(errors).length === 0 && !status.loading;

  function updateField(name, value) {
    setForm((p) => ({ ...p, [name]: value }));
    setStatus((s) => ({ ...s, error: "", success: "" }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!canSubmit) return;

    setStatus({ loading: true, error: "", success: "" });

   try {
  setStatus({ loading: true, error: "", success: "" });

  const API_BASE_URL =
    (import.meta.env.VITE_API_BASE_URL || "http://localhost:8010/api").replace(
      /\/$/,
      ""
    );

  const res = await fetch(`${API_BASE_URL}/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // IMPORTANT: session PHP
    body: JSON.stringify({
      email: form.email,
      password: form.password,
      remember: form.remember,
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || `Erreur de connexion (${res.status})`);
  }

  setStatus({ loading: false, error: "", success: "Connexion réussie." });
  navigate("/"); // ou redirection selon role
} catch (err) {
  setStatus({
    loading: false,
    error:
      err instanceof TypeError
        ? "Impossible de contacter le serveur. Vérifie que le backend PHP tourne (php -S localhost:8010)."
        : err?.message || "Erreur inconnue",
    success: "",
  });
}
}

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="min-h-screen w-full grid lg:grid-cols-2">
        {/* LEFT: Branding */}
        <div className="hidden lg:flex flex-col justify-between p-10 text-white bg-gradient-to-br from-blue-700 to-indigo-700">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/15 flex items-center justify-center font-bold">
              S
            </div>
            <div>
              <div className="text-lg font-semibold">StagePlatform</div>
              <div className="text-white/80 text-sm">
                Espace étudiants & entreprises
              </div>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-semibold leading-tight">
              Trouve un stage plus facilement.
            </h2>
            <p className="mt-3 text-white/85 text-base">
              Postule, suis tes candidatures, et gère les offres côté entreprise
              — tout au même endroit.
            </p>

            <div className="mt-8 grid gap-3 text-sm text-white/90">
              <div className="rounded-xl bg-white/10 p-4 flex items-center gap-3">
                <CheckCircle2 size={18} className="shrink-0" />
                Offres & candidatures
              </div>
              <div className="rounded-xl bg-white/10 p-4 flex items-center gap-3">
                <CheckCircle2 size={18} className="shrink-0" />
                Dashboard entreprise
              </div>
              <div className="rounded-xl bg-white/10 p-4 flex items-center gap-3">
                <CheckCircle2 size={18} className="shrink-0" />
                Suivi admin (optionnel)
              </div>
            </div>
          </div>

          <p className="text-xs text-white/70">
            © {new Date().getFullYear()} StagePlatform
          </p>
        </div>

        {/* RIGHT: Form */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-slate-900">
                Connexion
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Connecte-toi avec ton email et ton mot de passe.
              </p>
            </div>

            {status.error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {status.error}
              </div>
            )}
            {status.success && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {status.success}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-800">
                  Email
                </label>
                <input
                  type="email"
                  className={[
                    "mt-1 w-full rounded-xl border px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none",
                    "focus:ring-4 focus:ring-blue-100 focus:border-blue-600",
                    touched.email && errors.email
                      ? "border-red-300 focus:ring-red-100 focus:border-red-500"
                      : "border-slate-200",
                  ].join(" ")}
                  placeholder="ex: nom@gmail.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  autoComplete="email"
                />
                {touched.email && errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-800">
                  Mot de passe
                </label>

                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-12 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    title={showPassword ? "Masquer" : "Afficher"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-700 select-none">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={form.remember}
                    onChange={(e) => updateField("remember", e.target.checked)}
                  />
                  Se souvenir de moi
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status.loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Connexion...
                  </span>
                ) : (
                  "Se connecter"
                )}
              </button>

              <p className="pt-2 text-center text-sm text-slate-600">
                Pas de compte ?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Créer un compte
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
