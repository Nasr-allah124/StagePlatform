import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, CheckCircle2, Copy } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const [resetLink, setResetLink] = useState("");
  const [copied, setCopied] = useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(resetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (!email.trim()) {
      setStatus({ loading: false, error: "Email requis.", success: "" });
      return;
    }

    setStatus({ loading: true, error: "", success: "" });
    setResetLink("");

    try {
      const API_BASE_URL =
        (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api").replace(
          /\/$/,
          ""
        );

      const res = await fetch(`${API_BASE_URL}/forgot-password.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `Erreur (${res.status})`);
      }

      // Si l'email existe et un lien est retourné
      if (data?.reset_link) {
        setResetLink(data.reset_link);
        setStatus({
          loading: false,
          error: "",
          success: "Email trouvé ! Voici ton lien de réinitialisation :",
        });
      } else {
        // Email n'existe pas (message générique pour sécurité)
        setStatus({
          loading: false,
          error: "",
          success: "Si cet email existe, tu verras un lien ci-dessus.",
        });
      }
    } catch (err) {
      setStatus({
        loading: false,
        error:
          err instanceof TypeError
            ? "Impossible de contacter le serveur."
            : err?.message || "Erreur inconnue",
        success: "",
      });
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="min-h-screen w-full grid lg:grid-cols-2">
        {/* LEFT: Branding */}
        <div className="hidden lg:flex flex-col justify-between p-10 text-white bg-gradient-to-br from-amber-600 to-orange-600">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/15 flex items-center justify-center font-bold">
              S
            </div>
            <div>
              <div className="text-lg font-semibold">StagePlatform</div>
              <div className="text-white/80 text-sm">
                Récupère l'accès à ton compte
              </div>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl font-semibold leading-tight">
              Mot de passe oublié ?
            </h2>
            <p className="mt-3 text-white/85 text-base">
              Entre ton email et tu recevras un lien pour réinitialiser ton mot
              de passe.
            </p>

            <div className="mt-8 grid gap-3 text-sm text-white/90">
              <div className="rounded-xl bg-white/10 p-4 flex items-center gap-3">
                <CheckCircle2 size={18} className="shrink-0" />
                Vérification rapide
              </div>
              <div className="rounded-xl bg-white/10 p-4 flex items-center gap-3">
                <CheckCircle2 size={18} className="shrink-0" />
                Lien valide 1 heure
              </div>
              <div className="rounded-xl bg-white/10 p-4 flex items-center gap-3">
                <CheckCircle2 size={18} className="shrink-0" />
                Procédure simple
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
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-6"
            >
              <ArrowLeft size={16} />
              Retour à la connexion
            </Link>

            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-slate-900">
                Réinitialiser le mot de passe
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Entre l'email de ton compte.
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

            {resetLink && (
              <div className="mb-4 rounded-xl border border-blue-300 bg-blue-50 px-4 py-4 text-sm">
                <p className="text-blue-900 font-semibold mb-3">
                  🔗 Clique sur le lien ou copie-le :
                </p>
                <div className="flex gap-2">
                  <a
                    href={resetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg text-center transition-colors"
                  >
                    Ouvrir le lien
                  </a>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-3 rounded-lg transition-colors"
                    title="Copier le lien"
                  >
                    <Copy size={18} />
                  </button>
                </div>
                {copied && (
                  <p className="mt-2 text-xs text-blue-700 font-medium">
                    ✓ Lien copié !
                  </p>
                )}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium text-slate-800">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-100"
                  placeholder="ex: nom@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setStatus((s) => ({ ...s, error: "", success: "" }));
                    setResetLink("");
                  }}
                  autoComplete="email"
                  disabled={status.loading}
                />
              </div>

              <button
                type="submit"
                disabled={!email.trim() || status.loading}
                className="w-full rounded-xl bg-amber-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {status.loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Vérification...
                  </span>
                ) : (
                  "Vérifier l'email"
                )}
              </button>

              <p className="pt-2 text-center text-sm text-slate-600">
                Tu as un compte ?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-amber-600 hover:text-amber-700"
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
