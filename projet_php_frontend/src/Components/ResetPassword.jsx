import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
    validating: true,
  });

  useEffect(() => {
    if (!token) {
      setStatus((s) => ({
        ...s,
        validating: false,
        error: "Lien invalide.",
      }));
    } else {
      setStatus((s) => ({ ...s, validating: false }));
    }
  }, [token]);

  function updateField(name, value) {
    setForm((p) => ({ ...p, [name]: value }));
    setStatus((s) => ({ ...s, error: "", success: "" }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (!form.new_password || !form.confirm_password) {
      setStatus({
        loading: false,
        error: "Les deux champs sont requis.",
        success: "",
        validating: false,
      });
      return;
    }

    if (form.new_password.length < 6) {
      setStatus({
        loading: false,
        error: "Le mot de passe doit contenir au moins 6 caractères.",
        success: "",
        validating: false,
      });
      return;
    }

    if (form.new_password !== form.confirm_password) {
      setStatus({
        loading: false,
        error: "Les mots de passe ne correspondent pas.",
        success: "",
        validating: false,
      });
      return;
    }

    setStatus({ loading: true, error: "", success: "", validating: false });

    try {
      const API_BASE_URL =
        (import.meta.env.VITE_API_BASE_URL || "http://localhost:8010/api").replace(
          /\/$/,
          ""
        );

      const res = await fetch(`${API_BASE_URL}/reset-password.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          new_password: form.new_password,
          confirm_password: form.confirm_password,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `Erreur (${res.status})`);
      }

      setStatus({
        loading: false,
        error: "",
        success: "Mot de passe réinitialisé ! Redirection...",
        validating: false,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setStatus({
        loading: false,
        error:
          err instanceof TypeError
            ? "Impossible de contacter le serveur."
            : err?.message || "Erreur inconnue",
        success: "",
        validating: false,
      });
    }
  }

  if (status.validating) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={32} />
          <p className="text-slate-600">Vérification du lien...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen w-full bg-slate-50">
        <div className="min-h-screen w-full grid lg:grid-cols-2">
          <div className="hidden lg:flex flex-col justify-between p-10 text-white bg-gradient-to-br from-red-600 to-pink-600">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-white/15 flex items-center justify-center font-bold">
                S
              </div>
              <div>
                <div className="text-lg font-semibold">StagePlatform</div>
                <div className="text-white/80 text-sm">Lien invalide</div>
              </div>
            </div>

            <div className="max-w-md">
              <h2 className="text-4xl font-semibold leading-tight">
                Le lien a expiré
              </h2>
              <p className="mt-3 text-white/85 text-base">
                Le lien de réinitialisation n'est plus valide. Demande un nouveau
                lien.
              </p>
            </div>

            <p className="text-xs text-white/70">
              © {new Date().getFullYear()} StagePlatform
            </p>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md text-center">
              <h1 className="text-2xl font-semibold text-slate-900 mb-4">
                Lien expiré
              </h1>
              <p className="text-slate-600 mb-6">
                Demande un nouveau lien de réinitialisation.
              </p>
              <Link
                to="/forgot-password"
                className="inline-block rounded-xl bg-red-600 px-6 py-2.5 font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Renvoi du lien
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="min-h-screen w-full grid lg:grid-cols-2">
        {/* LEFT: Branding */}
        <div className="hidden lg:flex flex-col justify-between p-10 text-white bg-gradient-to-br from-green-600 to-emerald-600">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/15 flex items-center justify-center font-bold">
              S
            </div>
            <div>
              <div className="text-lg font-semibold">StagePlatform</div>
              <div className="text-white/80 text-sm">
                Réinitialise ton mot de passe
              </div>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-semibold leading-tight">
              Crée un nouveau mot de passe
            </h2>
            <p className="mt-3 text-white/85 text-base">
              Choisis un mot de passe fort avec au moins 6 caractères.
            </p>

            <div className="mt-8 grid gap-3 text-sm text-white/90">
              <div className="rounded-xl bg-white/10 p-4 flex items-center gap-3">
                <CheckCircle2 size={18} className="shrink-0" />
                Minimum 6 caractères
              </div>
              <div className="rounded-xl bg-white/10 p-4 flex items-center gap-3">
                <CheckCircle2 size={18} className="shrink-0" />
                Confirmez le mot de passe
              </div>
              <div className="rounded-xl bg-white/10 p-4 flex items-center gap-3">
                <CheckCircle2 size={18} className="shrink-0" />
                Stocké en sécurité
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
                Nouveau mot de passe
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Crée un mot de passe sécurisé.
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
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-800">
                  Nouveau mot de passe
                </label>

                <div className="mt-1 relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-12 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
                    placeholder="••••••••"
                    value={form.new_password}
                    onChange={(e) => updateField("new_password", e.target.value)}
                    autoComplete="new-password"
                    disabled={status.loading}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((v) => ({ ...v, new: !v.new }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword.new ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-800">
                  Confirmer le mot de passe
                </label>

                <div className="mt-1 relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-12 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100"
                    placeholder="••••••••"
                    value={form.confirm_password}
                    onChange={(e) =>
                      updateField("confirm_password", e.target.value)
                    }
                    autoComplete="new-password"
                    disabled={status.loading}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((v) => ({ ...v, confirm: !v.confirm }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword.confirm ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!form.new_password || !form.confirm_password || status.loading}
                className="w-full rounded-xl bg-green-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {status.loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Réinitialisation...
                  </span>
                ) : (
                  "Réinitialiser le mot de passe"
                )}
              </button>

              <p className="pt-2 text-center text-sm text-slate-600">
                Tu te souviens du mot de passe ?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-green-600 hover:text-green-700"
                >
                  Se connecter
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
