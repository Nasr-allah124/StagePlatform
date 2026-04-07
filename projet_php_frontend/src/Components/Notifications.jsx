import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import
import {
  Bell,
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  BriefcaseBusiness,
  FileText,
  Dot,
  Trash2,
} from "lucide-react";

export default function Notifications() {
  const { t } = useTranslation(); // Hook de traduction

  // Mock notifications
  const initial = useMemo(
    () => [
      {
        id: 1,
        type: "status",
        title: t("notif_status_title"), // Traduction dynamique
        body: t("notif_status_body"),
        time: t("time_2h"),
        read: false,
      },
      {
        id: 2,
        type: "offer",
        title: t("notif_offer_title"),
        body: t("notif_offer_body"),
        time: t("time_today"),
        read: false,
      },
      {
        id: 3,
        type: "message",
        title: t("notif_msg_title"),
        body: t("notif_msg_body"),
        time: t("time_yesterday"),
        read: true,
      },
    ],
    [t] // Ajout de t dans les dépendances
  );

  const [items, setItems] = useState(initial);

  const unreadCount = items.filter((n) => !n.read).length;

  function markAllRead() {
    setItems((p) => p.map((n) => ({ ...n, read: true })));
  }

  function toggleRead(id) {
    setItems((p) =>
      p.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  }

  function remove(id) {
    setItems((p) => p.filter((n) => n.id !== id));
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft size={16} />
              {t("back")}
            </Link>

            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center">
                <Bell className="text-blue-700 dark:text-blue-400" size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {t("notifications")}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {unreadCount} {t("unread_count")}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          >
            <CheckCircle2 size={16} />
            {t("mark_all_read")}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          {items.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-lg font-semibold text-slate-900 dark:text-white">
                {t("no_notif")}
              </div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {t("no_notif_desc")}
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800">
              {items.map((n) => (
                <li key={n.id} className="p-4 sm:p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <IconBadge type={n.type} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {n.title}
                          </div>
                          {!n.read && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400">
                              <Dot className="-ml-1" size={18} />
                              {t("new_tag")}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          {n.body}
                        </div>
                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                          {n.time}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() => toggleRead(n.id)}
                            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            {n.read ? t("mark_unread") : t("mark_read")}
                          </button>
                          <button
                            onClick={() => remove(n.id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            <Trash2 size={14} />
                            {t("delete_btn_notif")}
                          </button>
                        </div>
                      </div>
                    </div>

                    <span
                      className={[
                        "mt-1 h-2.5 w-2.5 rounded-full",
                        n.read ? "bg-slate-200 dark:bg-slate-700" : "bg-blue-600 dark:bg-blue-500",
                      ].join(" ")}
                      title={n.read ? t("read") : t("unread")}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

function IconBadge({ type }) {
  const common = "h-10 w-10 rounded-2xl flex items-center justify-center border transition-colors";
  if (type === "offer") {
    return (
      <div className={`${common} border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20`}>
        <BriefcaseBusiness className="text-blue-700 dark:text-blue-400" size={18} />
      </div>
    );
  }
  if (type === "message") {
    return (
      <div className={`${common} border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20`}>
        <MessageSquare className="text-blue-700 dark:text-blue-400" size={18} />
      </div>
    );
  }
  if (type === "status") {
    return (
      <div className={`${common} border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20`}>
        <FileText className="text-blue-700 dark:text-blue-400" size={18} />
      </div>
    );
  }
  return (
    <div className={`${common} border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800`}>
      <Bell className="text-slate-700 dark:text-slate-300" size={18} />
    </div>
  );
}