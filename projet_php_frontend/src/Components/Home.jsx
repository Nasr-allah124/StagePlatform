import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LogOut,
  LayoutDashboard,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  Building2,
  Bell,
  Settings,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  UserCircle2,
  PlusCircle,
  Search,
} from "lucide-react";

export default function Home({ user }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const API_BASE_URL = useMemo(
    () =>
      (
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8010/api"
      ).replace(/\/$/, ""),
    [],
  );

  const role = user?.role;

  const displayName =
    role === "student"
      ? user?.profile?.full_name || user?.email
      : role === "company"
        ? user?.profile?.company_name || user?.email
        : user?.email;

  const subtitle =
    role === "student"
      ? t("space_student")
      : role === "company"
        ? t("space_company")
        : t("space_admin");

  async function onLogout() {
    try {
      await fetch(`${API_BASE_URL}/logout.php`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* background blur */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-blue-200/30 dark:bg-blue-900/20 blur-3xl" />
        <div className="absolute top-1/2 -left-20 h-64 w-64 rounded-full bg-indigo-200/20 dark:bg-indigo-900/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-80 w-80 rounded-full bg-cyan-100/30 dark:bg-cyan-900/10 blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 font-bold text-white shadow-sm">
              S
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                StagePlatform
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/notifications"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-800"
            >
              <Bell size={16} />
              {t("notifications")}
            </Link>

            <Link
              to="/settings"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-800"
            >
              <Settings size={16} />
              {t("settings")}
            </Link>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
            >
              <LogOut size={16} />
              {t("logout")}
            </button>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-12">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-4 shadow-sm backdrop-blur">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white">
              <div className="text-xs text-white/80">{t("connected_as")}</div>
              <div className="mt-1 text-lg font-semibold break-words">
                {displayName}
              </div>
              <div className="mt-1 text-xs text-white/80 break-all">
                {user?.email}
              </div>
            </div>

            <nav className="mt-4 space-y-1">
              <SideLink
                to="/"
                icon={<LayoutDashboard size={16} />}
                label={t("nav_home")}
              />

              <SideLink
                to="/offers"
                icon={<BriefcaseBusiness size={16} />}
                label={role === "company" ? t("nav_my_offers") : t("nav_offers")}
              />

              {role === "company" && (
                <>
                  <SideLink
                    to="/company/create-offer"
                    icon={<PlusCircle size={16} />}
                    label={t("nav_publish")}
                  />

                  <SideLink
                    to="/company/dashboard"
                    icon={<LayoutDashboard size={16} />}
                    label={t("nav_analytics")}
                  />
                </>
              )}

              <SideLink
                to="/applications"
                icon={<FileText size={16} />}
                label={
                  role === "company"
                    ? t("nav_apps_received")
                    : t("nav_my_apps")
                }
              />

              <SideLink
                 to="/settings?tab=profile"
                icon={
                  role === "company" ? (
                    <Building2 size={16} />
                  ) : (
                    <GraduationCap size={16} />
                  )
                }
                label={t("nav_profile")}
              />
            </nav>

            <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <Sparkles size={16} className="text-amber-500" />
                {t("quick_tip")}
              </div>
              <p className="mt-2 text-xs leading-6 text-slate-600 dark:text-slate-400">
                {role === "company"
                  ? t("tip_company")
                  : t("tip_student")}
              </p>
              <Link
                to={role === "company" ? "/offers" : "/settings?tab=profile"}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                {role === "company"
                  ? t("manage_offers")
                  : t("complete_profile")}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="lg:col-span-9">
          {/* Hero */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  {t("dashboard")}
                </div>

                <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">{t("welcome")}</div>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  {role === "student"
                    ? t("hero_student")
                    : role === "company"
                      ? t("hero_company")
                      : t("hero_admin")}
                </h1>

                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
                  {role === "student"
                    ? t("desc_student")
                    : role === "company"
                      ? t("desc_company")
                      : t("desc_admin")}
                </p>

                <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                  {t("role")} :{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">{role}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {role === "company" ? (
                  <>
                    <Link
                      to="/company/create-offer"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200"
                    >
                      <PlusCircle size={16} />
                      {t("nav_publish")}
                    </Link>

                    <Link
                      to="/offers"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-800"
                    >
                      <BriefcaseBusiness size={16} />
                      {t("nav_my_offers")}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/offers"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200"
                    >
                      <Search size={16} />
                      {t("see_offers")}
                    </Link>

                    <Link
                      to="/applications"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-800"
                    >
                      <FileText size={16} />
                      {t("nav_my_apps")}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <StatCard
              icon={<BriefcaseBusiness className="text-blue-700 dark:text-blue-400" size={18} />}
              title={role === "company" ? t("nav_my_offers") : t("available_offers")}
              value="—"
              hint={
                role === "company"
                  ? t("hint_all_pubs")
                  : t("hint_explore")
              }
            />

            <StatCard
              icon={<FileText className="text-blue-700 dark:text-blue-400" size={18} />}
              title={role === "company" ? t("nav_apps_received") : t("nav_my_apps")}
              value="—"
              hint={
                role === "company"
                  ? t("hint_track_cand")
                  : t("hint_track_resp")
              }
            />

            <StatCard
              icon={
                role === "company" ? (
                  <Building2 className="text-blue-700 dark:text-blue-400" size={18} />
                ) : (
                  <UserCircle2 className="text-blue-700 dark:text-blue-400" size={18} />
                )
              }
              title={t("nav_profile")}
              value="OK"
              hint={t("active_account")}
            />
          </div>

          {/* Bottom grid */}
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {/* Activité */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold text-slate-900 dark:text-white">
                  {t("recent_activity")}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{t("last_days")}</span>
              </div>

              <div className="mt-4 space-y-3">
                <ActivityLine text={t("welcome_msg")} />
                {role === "student" ? (
                  <>
                    <ActivityLine text={t("activity_explore")} />
                    <ActivityLine text={t("activity_complete")} />
                  </>
                ) : (
                  <>
                    <ActivityLine text={t("activity_publish")} />
                    <ActivityLine text={t("activity_check")} />
                  </>
                )}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="text-base font-semibold text-slate-900 dark:text-white">
                {t("quick_actions")}
              </div>

              <div className="mt-4 grid gap-3">
                {role === "company" ? (
                  <>
                    <QuickAction
                      to="/offers/new"
                      title={t("nav_publish")}
                      desc={t("desc_pub")}
                    />
                    <QuickAction
                      to="/offers"
                      title={t("manage_offers")}
                      desc={t("desc_manage")}
                    />
                    <QuickAction
                      to="/applications"
                      title={t("see_apps")}
                      desc={t("desc_apps")}
                    />
                  </>
                ) : (
                  <>
                    <QuickAction
                      to="/offers"
                      title={t("explore_offers")}
                      desc={t("desc_explore")}
                    />
                    <QuickAction
                      to="/applications"
                      title={t("nav_my_apps")}
                      desc={t("desc_my_apps")}
                    />
                    <QuickAction
                      to="/profile"
                      title={t("update_profile")}
                      desc={t("desc_update")}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SideLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}

function StatCard({ icon, title, value, hint }) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/10 dark:bg-blue-400/10">
          {icon}
        </div>
        <div className="text-sm font-semibold text-slate-900 dark:text-white">{title}</div>
      </div>
      <div className="mt-4 text-3xl font-semibold text-blue-700 dark:text-blue-400">{value}</div>
      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{hint}</div>
    </div>
  );
}

function ActivityLine({ text }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
      <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
      <span className="min-w-0 truncate">{text}</span>
    </div>
  );
}

function QuickAction({ to, title, desc }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-4 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow"
    >
      <div className="text-sm font-semibold text-slate-900 dark:text-white">{title}</div>
      <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{desc}</div>
    </Link>
  );
}
