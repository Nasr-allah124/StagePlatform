import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft,
  TrendingUp,
  FileCheck,
  Users,
  Award,
  AlertCircle,
} from "lucide-react";

export default function Dashboard() {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API = "http://localhost:8000/api";

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);
      const res = await fetch(`${API}/get_analytics.php`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data.ok) {
        setAnalytics(data);
        setError(null);
      } else {
        setError(data.error || "Failed to load analytics");
      }
    } catch (err) {
      console.error("Error loading analytics:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent dark:border-blue-400 dark:border-t-transparent"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            {t("loading", "Chargement...")}
          </p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            {t("back")}
          </Link>

          <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-200">
                  {t("error")}
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusData = [
    {
      name: t("accepted", "Accepté"),
      value: analytics.total_accepted,
      color: "#10b981",
    },
    {
      name: t("rejected", "Refusé"),
      value: analytics.total_rejected,
      color: "#ef4444",
    },
    {
      name: t("pending", "En attente"),
      value: analytics.total_pending,
      color: "#f59e0b",
    },
  ].filter((item) => item.value > 0);

  const chartsData = analytics.offers_breakdown
    .map((offer) => ({
      name: offer.title.length > 20 ? offer.title.substring(0, 20) + "..." : offer.title,
      fullName: offer.title,
      applications: parseInt(offer.total_applications),
    }))
    .slice(0, 10);

  const COLORS = [
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
    "#ef4444",
    "#6366f1",
    "#14b8a6",
    "#f97316",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft size={16} />
              {t("back")}
            </Link>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <TrendingUp className="text-white" size={20} />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {t("analytics_dashboard", "Tableau de Bord Analytics")}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {t("company_insights", "Aperçu de vos offres et candidatures")}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={loadAnalytics}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            {t("refresh", "Actualiser")}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Applications */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {t("total_applications", "Total Candidatures")}
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {analytics.total_applications}
                </p>
              </div>
              <div className="rounded-xl bg-blue-100 dark:bg-blue-900/30 p-3">
                <FileCheck className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>

          {/* Accepted */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {t("accepted", "Acceptées")}
                </p>
                <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                  {analytics.total_accepted}
                </p>
              </div>
              <div className="rounded-xl bg-green-100 dark:bg-green-900/30 p-3">
                <Award className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {t("rejected", "Refusées")}
                </p>
                <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                  {analytics.total_rejected}
                </p>
              </div>
              <div className="rounded-xl bg-red-100 dark:bg-red-900/30 p-3">
                <Users className="text-red-600 dark:text-red-400" size={24} />
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {t("pending", "En Attente")}
                </p>
                <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {analytics.total_pending}
                </p>
              </div>
              <div className="rounded-xl bg-amber-100 dark:bg-amber-900/30 p-3">
                <AlertCircle className="text-amber-600 dark:text-amber-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Most Popular Offer */}
        {analytics.most_popular_offer && (
          <div className="mb-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {t("most_popular_offer", "Offre la Plus Populaire")}
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {analytics.most_popular_offer.title}
                </p>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  {analytics.most_popular_offer.total_applications}{" "}
                  {t("applications", "candidatures")}
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 rounded-xl bg-blue-100 dark:bg-blue-900/30 px-4 py-2">
                  <TrendingUp className="text-blue-600 dark:text-blue-400" size={20} />
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {Math.round(
                      (analytics.most_popular_offer.total_applications /
                        (analytics.total_applications || 1)) *
                        100
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Pie Chart - Status Distribution */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              {t("status_distribution", "Répartition des Statuts")}
            </h3>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) =>
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value} candidature(s)`}
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                {t("no_data", "Pas de données disponibles")}
              </div>
            )}
          </div>

          {/* Bar Chart - Applications by Offer */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              {t("applications_by_offer", "Candidatures par Offre")}
            </h3>
            {chartsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartsData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                  <Tooltip
                    formatter={(value) => [value, t("applications", "Candidatures")]}
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                  />
                  <Bar
                    dataKey="applications"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                {t("no_data", "Pas de données disponibles")}
              </div>
            )}
          </div>
        </div>

        {/* Detailed Table */}
        <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm overflow-hidden">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            {t("offers_detail", "Détail des Offres")}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                    {t("offer_title", "Titre de l'Offre")}
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                    {t("total_applications", "Total Candidatures")}
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                    {t("accepted", "Acceptées")}
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                    {t("rejected", "Refusées")}
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                    {t("pending", "En Attente")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.offers_breakdown.map((offer, index) => (
                  <tr
                    key={offer.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      {offer.title}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                      <span className="inline-flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 px-3 py-1 font-semibold text-blue-700 dark:text-blue-400">
                        {offer.total_applications}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                      <span className="inline-flex items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 px-3 py-1 font-semibold text-green-700 dark:text-green-400">
                        {offer.accepted}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                      <span className="inline-flex items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30 px-3 py-1 font-semibold text-red-700 dark:text-red-400">
                        {offer.rejected}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                      <span className="inline-flex items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 px-3 py-1 font-semibold text-amber-700 dark:text-amber-400">
                        {offer.pending}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
