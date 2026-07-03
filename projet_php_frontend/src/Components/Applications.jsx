import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const API = "http://localhost:8000/api";

  const [applications, setApplications] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [showMessageForm, setShowMessageForm] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

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

  const handleSendMessage = async (applicationId, receiverId) => {
    if (!messageText.trim()) return;

    setSendingMessage(true);
    try {
      const res = await fetch(`${API}/send_message.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id: applicationId,
          receiver_id: receiverId,
          message: messageText,
        }),
        credentials: "include",
      });

      const data = await res.json();
      console.log("Response from send_message.php:", data, "Status:", res.status);
      
      if (data.success) {
        setMessageText("");
        setShowMessageForm(null);
        setSuccessMessage(t("message_sent", "Message envoyé avec succès!"));
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorMsg = data.error || "Erreur lors de l'envoi";
        console.error("Error from backend:", errorMsg);
        setSuccessMessage(errorMsg);
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setSuccessMessage(t("message_error", "Erreur lors de l'envoi"));
      setTimeout(() => setSuccessMessage(null), 5000);
    } finally {
      setSendingMessage(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* NOTIFICATION DE SUCCÈS */}
        {successMessage && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce z-50">
            {successMessage}
          </div>
        )}
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

                {role === "company" && app.status !== "pending" && (
                  <div className="mt-6 border-t dark:border-slate-800 pt-6">
                    <button
                      onClick={() => setShowMessageForm(showMessageForm === app.id ? null : app.id)}
                      className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 py-3 font-bold text-white transition-colors"
                    >
                      {showMessageForm === app.id ? t("close_form", "Fermer") : t("send_message_btn", "Envoyer un message")}
                    </button>
                    {showMessageForm === app.id && (
                      <div className="mt-4 space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        <textarea
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={t("your_message_placeholder", "Votre message...")}
                          rows="4"
                        ></textarea>
                        <button
                          onClick={() => handleSendMessage(app.id, app.student_id)}
                          disabled={sendingMessage || !messageText.trim()}
                          className={`w-full rounded-xl py-2 font-bold text-white transition-colors ${
                            sendingMessage || !messageText.trim()
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {sendingMessage ? t("sending", "Envoi en cours...") : t("send_btn", "Envoyer")}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {role === "student" && app.status !== "pending" && (
                  <div className="mt-6 border-t dark:border-slate-800 pt-6">
                    <button
                      onClick={() => setShowMessageForm(showMessageForm === app.id ? null : app.id)}
                      className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 py-3 font-bold text-white transition-colors"
                    >
                      {showMessageForm === app.id ? t("close_form", "Fermer") : t("reply_btn", "Répondre")}
                    </button>
                    {showMessageForm === app.id && (
                      <div className="mt-4 space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        <textarea
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={t("your_response_placeholder", "Votre réponse...")}
                          rows="4"
                        ></textarea>
                        <button
                          onClick={() => handleSendMessage(app.id, app.company_user_id)}
                          disabled={sendingMessage || !messageText.trim()}
                          className={`w-full rounded-xl py-2 font-bold text-white transition-colors ${
                            sendingMessage || !messageText.trim()
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {sendingMessage ? t("sending", "Envoi en cours...") : t("send_btn", "Envoyer")}
                        </button>
                      </div>
                    )}
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
