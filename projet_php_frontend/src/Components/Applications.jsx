import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import
import {
  FileText,
  User,
  Mail,
  MapPin,
  CalendarDays,
  Download,
  Building2,
  ArrowLeft,
} from "lucide-react";

export default function Applications() {
  const { t } = useTranslation(); // Hook de traduction
  const navigate = useNavigate(); // Hook pour la navigation
  const API = "http://localhost:8000/api";

  const [applications, setApplications] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      const res = await fetch(`${API}/applications.php`, {
        credentials: "include",
      });

      const data = await res.json();

      if (data.ok) {
        setApplications(data.applications || []);
        setRole(data.role || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/update_application_status.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: newStatus }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.ok) {
        loadApplications();
      }
    } catch (err) {
      console.error("Erreur de mise à jour", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* BOUTON RETOUR */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex w-max items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back", "Retour")}
        </button>

        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
          {role === "company" ? t("received_apps") : t("my_apps")}
        </h1>

        {loading && (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 dark:text-slate-400">
            {t("loading")}
          </div>
        )}

        {!loading && applications.length === 0 && (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-slate-500 dark:text-slate-400">
            {t("no_apps_found")}
          </div>
        )}

        {!loading && applications.length > 0 && (
          <div className="grid gap-5">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {app.title}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-400">
                      {app.company_name && (
                        <span className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2">
                          <Building2 size={15} />
                          {app.company_name}
                        </span>
                      )}

                      {app.city && (
                        <span className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2">
                          <MapPin size={15} />
                          {app.city}
                        </span>
                      )}

                      {app.created_at && (
                        <span className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2">
                          <CalendarDays size={15} />
                          {app.created_at}
                        </span>
                      )}
                    </div>
                  </div>

                  {app.status && (
                    <span className="inline-flex h-fit items-center rounded-full bg-blue-50 dark:bg-blue-900/20 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-400 border dark:border-blue-800">
                      {t(`status_${app.status.toLowerCase()}`)}
                    </span>
                  )}
                </div>

                {role === "company" && (
                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <User size={15} />
                        {t("student_label")}
                      </div>
                      <div className="mt-2 text-slate-900 dark:text-white">
                        {app.student_name || t("not_provided")}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        <Mail size={15} />
                        {t("email_label")}
                      </div>
                      <div className="mt-2 text-slate-900 dark:text-white break-all">
                        {app.student_email || t("not_provided")}
                      </div>
                    </div>
                  </div>
                )}

                {app.message && (
                  <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      <FileText size={15} />
                      {t("message_label")}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                      {app.message}
                    </p>
                  </div>
                )}

                {app.cv_path && (
                  <div className="mt-5">
                    <a
                      href={`http://localhost:8000/${app.cv_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
                    >
                      <Download size={16} />
                      {t("view_cv")}
                    </a>
                  </div>
                )}

                {role === "company" && app.status === "pending" && (
                  <div className="mt-6 flex gap-4 border-t dark:border-slate-800 pt-6">
                    <button
                      onClick={() => updateStatus(app.id, "accepted")}
                      className="flex-1 rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors"
                    >
                      {t("accept_btn")}
                    </button>

                    <button
                      onClick={() => updateStatus(app.id, "rejected")}
                      className="flex-1 rounded-xl bg-red-50 dark:bg-red-900/10 py-3 font-bold text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors border dark:border-red-900/30"
                    >
                      {t("reject_btn")}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
