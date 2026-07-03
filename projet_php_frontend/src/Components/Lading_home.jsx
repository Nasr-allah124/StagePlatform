import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  LayoutDashboard,
  FileText,
  Search,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute top-40 -right-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/60 blur-3xl" />
      </div>

      {/* NAVBAR */}
      <header className="relative z-10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
              S
            </div>
            <div>
              <div className="text-base font-semibold leading-tight">
                StagePlatform
              </div>
              <div className="text-xs text-slate-500">
                Étudiants • Entreprises
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-7 md:flex">
            <a href="#features" className="text-sm text-slate-600 hover:text-slate-900">
              Fonctionnalités
            </a>
            <a href="#how" className="text-sm text-slate-600 hover:text-slate-900">
              Comment ça marche
            </a>
            <a href="#pricing" className="text-sm text-slate-600 hover:text-slate-900">
              Accès
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden sm:inline-flex rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Créer un compte
              <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-6 pt-8 pb-14 md:pt-14">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <Sparkles size={14} />
                Plateforme intelligente de gestion des stages
              </div>

              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Trouve, postule et{" "}
                <span className="text-blue-700">suis tes stages</span>{" "}
                simplement.
              </h1>

              <p className="mt-4 text-base text-slate-600 sm:text-lg">
                StagePlatform connecte étudiants et entreprises : offres,
                candidatures, suivi et tableau de bord — tout au même endroit.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                >
                  Commencer gratuitement <ArrowRight size={16} />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                >
                  J’ai déjà un compte
                </Link>
              </div>

              <div className="mt-6 grid gap-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-blue-600" size={18} />
                  Inscription rapide (Étudiant / Entreprise)
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-blue-600" size={18} />
                  Suivi clair des candidatures et des offres
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-blue-600" size={18} />
                  Interface moderne, simple, efficace
                </div>
              </div>
            </div>

            {/* Hero Card */}
            <div className="relative">
              <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900">
                    Aperçu du tableau de bord
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    <ShieldCheck size={14} /> Sécurisé
                  </div>
                </div>

                <div className="mt-5 grid gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-blue-600/10 flex items-center justify-center">
                        <Search className="text-blue-700" size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          Offres recommandées
                        </div>
                        <div className="text-xs text-slate-500">
                          Filtre ville • secteur • niveau
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2">
                      <MiniRow title="Développeur Web (Stage)" meta="Casablanca • 3 mois" />
                      <MiniRow title="UI/UX Designer" meta="Rabat • 2 mois" />
                      <MiniRow title="Data Analyst" meta="Tanger • 4 mois" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-blue-600/10 flex items-center justify-center">
                          <FileText className="text-blue-700" size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">
                            Candidatures
                          </div>
                          <div className="text-xs text-slate-500">
                            Suivi en temps réel
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Progress label="Envoyées" value={7} total={10} />
                        <Progress label="En cours" value={3} total={10} />
                        <Progress label="Acceptées" value={1} total={10} />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-blue-600/10 flex items-center justify-center">
                          <LayoutDashboard className="text-blue-700" size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Gestion</div>
                          <div className="text-xs text-slate-500">
                            Centralise tout
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <Bullet text="Offres publiées : 4" />
                        <Bullet text="Candidatures reçues : 23" />
                        <Bullet text="Messages : 5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Suivi clair
                    </div>
                    <div className="text-xs text-slate-600">
                      status • dates • feedback
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* stats */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <StatCard title="Tout-en-un" value="Offres + Candidatures" />
            <StatCard title="Gain de temps" value="Suivi simplifié" />
            <StatCard title="Expérience pro" value="Interface moderne" />
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="mx-auto max-w-6xl px-6 pb-14">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Pensé pour étudiants et entreprises
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Des fonctionnalités essentielles, simples, et efficaces.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <FeatureCard
              icon={<GraduationCap className="text-blue-700" size={18} />}
              title="Espace Étudiant"
              desc="Crée ton profil, explore les offres et suis tes candidatures."
              items={[
                "Profil complet",
                "Offres filtrées",
                "Statut candidature",
              ]}
            />
            <FeatureCard
              icon={<Building2 className="text-blue-700" size={18} />}
              title="Espace Entreprise"
              desc="Publie des offres et gère les candidatures reçues facilement."
              items={[
                "Créer une offre",
                "Voir candidatures",
                "Décision rapide",
              ]}
            />
            <FeatureCard
              icon={<ShieldCheck className="text-blue-700" size={18} />}
              title="Sécurité & Clarté"
              desc="Connexion sécurisée et données organisées proprement."
              items={[
                "Auth sécurisée",
                "Données structurées",
                "Expérience fluide",
              ]}
            />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="bg-slate-50 border-y border-slate-200">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <h2 className="text-2xl font-semibold tracking-tight">
              Comment ça marche
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              3 étapes simples pour démarrer.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <StepCard
                step="01"
                title="Créer un compte"
                desc="Choisis ton rôle (étudiant ou entreprise) et complète ton profil."
              />
              <StepCard
                step="02"
                title="Publier / postuler"
                desc="Entreprises : publiez une offre. Étudiants : postulez en 1 clic."
              />
              <StepCard
                step="03"
                title="Suivre et décider"
                desc="Tableau de bord clair pour suivre les candidatures et décisions."
              />
            </div>
          </div>
        </section>

        {/* PRICING / ACCESS */}
        <section id="pricing" className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Accès simple, démarrage rapide
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Commence gratuitement. Tu pourras ajouter des options plus tard
                (admin, statistiques, etc.).
              </p>

              <div className="mt-6 space-y-2 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-blue-600" size={18} />
                  Étudiants : candidature & suivi
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-blue-600" size={18} />
                  Entreprises : offres & gestion
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-blue-600" size={18} />
                  Admin (optionnel) : contrôle & stats
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Pack de démarrage
                  </div>
                  <div className="text-xs text-slate-500">Idéal pour MVP</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-semibold text-blue-700">
                    Gratuit
                  </div>
                  <div className="text-xs text-slate-500">pour commencer</div>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm text-slate-700">
                <PricingLine text="Compte étudiant / entreprise" />
                <PricingLine text="Connexion sécurisée" />
                <PricingLine text="Dashboard de base" />
                <PricingLine text="Offres & candidatures (MVP)" />
              </div>

              <Link
                to="/register"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                Créer un compte <ArrowRight size={16} />
              </Link>

              <p className="mt-3 text-center text-xs text-slate-500">
                Tu as déjà un compte ?{" "}
                <Link className="font-semibold text-blue-700" to="/login">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="mx-auto max-w-6xl px-6 pb-14">
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-sm">
            <div className="grid gap-6 md:grid-cols-3 md:items-center">
              <div className="md:col-span-2">
                <div className="text-sm font-semibold text-white/90">
                  “Simple, clair, efficace”
                </div>
                <p className="mt-2 text-white/90">
                  “On a enfin un suivi propre des candidatures et des offres.
                  L’interface est moderne et les étudiants comprennent tout
                  rapidement.”
                </p>
                <div className="mt-4 text-xs text-white/75">
                  Responsable RH • Entreprise partenaire 
                </div>
              </div>
              <div className="flex md:justify-end">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-white/30"
                >
                  Démarrer maintenant <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-slate-200">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  S
                </div>
                <div>
                  <div className="text-sm font-semibold">StagePlatform</div>
                  <div className="text-xs text-slate-500">
                    Gestion moderne des stages
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <Link to="/login" className="hover:text-slate-900">
                  Connexion
                </Link>
                <Link to="/register" className="hover:text-slate-900">
                  Inscription
                </Link>
                <a href="#features" className="hover:text-slate-900">
                  Fonctionnalités
                </a>
                <a href="#how" className="hover:text-slate-900">
                  Guide
                </a>
              </div>
            </div>

            <div className="mt-8 text-xs text-slate-500">
              © {new Date().getFullYear()} StagePlatform — Tous droits réservés.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* --- Small UI components --- */

function MiniRow({ title, meta }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-slate-900">
          {title}
        </div>
        <div className="text-xs text-slate-500">{meta}</div>
      </div>
      <span className="ml-3 inline-flex rounded-full bg-blue-600/10 px-2 py-1 text-xs font-semibold text-blue-700">
        Voir
      </span>
    </div>
  );
}

function Bullet({ text }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
      <span>{text}</span>
    </div>
  );
}

function Progress({ label, value, total }) {
  const pct = Math.min(100, Math.round((value / total) * 100));
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>{label}</span>
        <span className="font-semibold text-slate-800">{value}</span>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-blue-600"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-lg font-semibold text-blue-700">{value}</div>
      <div className="mt-2 text-xs text-slate-500">
        Une base solide pour ton MVP.
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, items }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-blue-600/10 flex items-center justify-center">
          {icon}
        </div>
        <div className="text-sm font-semibold">{title}</div>
      </div>
      <p className="mt-3 text-sm text-slate-600">{desc}</p>

      <div className="mt-4 space-y-2 text-sm text-slate-700">
        {items.map((t) => (
          <div key={t} className="flex items-center gap-2">
            <CheckCircle2 className="text-blue-600" size={18} />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepCard({ step, title, desc }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
        Étape {step}
      </div>
      <div className="mt-3 text-base font-semibold text-slate-900">{title}</div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </div>
  );
}

function PricingLine({ text }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 className="text-blue-600" size={18} />
      <span>{text}</span>
    </div>
  );
}
