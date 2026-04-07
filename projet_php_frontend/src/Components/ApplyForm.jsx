import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next"; // Import
import {
  UploadCloud,
  Send,
  ArrowLeft,
  FileText,
  CheckCircle2,
  User,
  Mail,
  MessageSquare,
} from "lucide-react";

export default function ApplyForm() {
  const { t } = useTranslation(); // Hook de traduction
  const { id } = useParams();
  const navigate = useNavigate();

  const API = "http://localhost:8000/api";

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    cv: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function update(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      data.append("internship_id", id);
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("message", form.message);
      if (form.cv) {
        data.append("cv", form.cv);
      }

      const res = await fetch(`${API}/apply.php`, {
        method: "POST",
        credentials: "include",
        body: data,
      });

      const result = await res.json();

      if (result.ok) {
        setSuccess(t("apply_success_msg"));
        setTimeout(() => {
          navigate("/offers");
        }, 1500);
      } else {
        setError(result.error || t("apply_error_msg"));
      }
    } catch (err) {
      setError(t("apply_server_error_msg"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-16 px-6 transition-colors duration-300">
      <div className="mx-auto w-full max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex w-max items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back", "Retour")}
        </button>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* gauche */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                <FileText size={26} />
              </div>

              <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                {t("apply_sidebar_title")}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {t("apply_sidebar_desc")}
              </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                <CheckCircle2 size={18} />
                {t("apply_tips_title")}
              </div>

              <ul className="mt-4 space-y-3 text-sm text-white/90">
                <li>{t("apply_tip_1")}</li>
                <li>{t("apply_tip_2")}</li>
                <li>{t("apply_tip_3")}</li>
              </ul>
            </div>
          </div>

          {/* droite */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {t("apply_main_title")}
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                {t("apply_main_subtitle")}
              </p>

              {success && (
                <div className="mt-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  {success}
                </div>
              )}

              {error && (
                <div className="mt-6 rounded-2xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={submit} className="mt-8 space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t("full_name")}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-12 pr-4 py-3 text-slate-900 dark:text-white outline-none transition focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20"
                      placeholder={t("placeholder_name")}
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t("email")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input
                      type="email"
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-12 pr-4 py-3 text-slate-900 dark:text-white outline-none transition focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20"
                      placeholder="email@gmail.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t("message")}
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 text-slate-400 dark:text-slate-500" size={18} />
                    <textarea
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-12 pr-4 py-3 h-36 text-slate-900 dark:text-white outline-none transition focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 resize-none"
                      placeholder={t("placeholder_message")}
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t("cv")}
                  </label>

                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 py-10 transition hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-900/10">
                    <UploadCloud size={32} className="mb-2 text-slate-400 dark:text-slate-500" />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                      {t("cv_upload_label")}
                    </span>
                    <span className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {t("cv_upload_hint")}
                    </span>

                    {form.cv && (
                      <span className="mt-3 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 border dark:border-slate-700">
                        {form.cv.name}
                      </span>
                    )}

                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => update("cv", e.target.files?.[0] || null)}
                      required
                    />
                  </label>
                </div>

                <button
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:shadow-xl disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      {t("submitting_btn")}
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {t("submit_btn")}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}