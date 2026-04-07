import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Ajout de l'import
import {
  MapPin,
  Briefcase,
  Clock,
  Search,
  Trash2,
  Send,
  Building2,
  Sparkles,
  FileText,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

const API = "http://localhost:8000/api";

export default function Offers() {
  const { t } = useTranslation(); // Initialisation de la traduction
  const navigate = useNavigate(); // Initialisation du hook navigate
  const [offers, setOffers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [role, setRole] = useState(null);
  const [search, setSearch] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* ---------------- USER ROLE ---------------- */
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(`${API}/me.php`, {
          credentials: "include",
        });

        const data = await res.json();

        if (data.ok) {
          setRole(data.user.role);
        }
      } catch (error) {
        console.error("Erreur me.php", error);
      } finally {
        setLoadingUser(false);
      }
    }

    loadUser();
  }, []);

  /* ---------------- OFFERS ---------------- */
  useEffect(() => {
    async function loadOffers() {
      try {
        const res = await fetch(`${API}/offers.php`, {
          credentials: "include",
        });

        const data = await res.json();

        if (data.ok) {
          setOffers(data.offers || []);
          if (data.offers?.length) {
            setSelected(data.offers[0]);
          } else {
            setSelected(null);
          }
        } else {
          setMessage(data.error || t("error_load_offers"));
          setMessageType("error");
        }
      } catch (error) {
        console.error("Erreur offers.php", error);
        setMessage(t("error_connexion"));
        setMessageType("error");
      } finally {
        setLoadingOffers(false);
      }
    }

    loadOffers();
  }, [t]);

  /* ---------------- APPLY ---------------- */
  async function apply(id) {
    try {
      setApplying(true);
      setMessage("");

      const res = await fetch(`${API}/apply.php`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          internship_id: id,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        setMessage(t("apply_success"));
        setMessageType("success");
      } else {
        setMessage(data.error || t("apply_error"));
        setMessageType("error");
      }
    } catch (error) {
      console.error("Erreur apply.php", error);
      setMessage(t("apply_server_error"));
      setMessageType("error");
    } finally {
      setApplying(false);
    }
  }

  /* ---------------- DELETE OFFER ---------------- */
  async function deleteOffer(id) {
    const confirmDelete = window.confirm(t("confirm_delete_offer"));

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API}/delete_offer.php`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offer_id: id,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        const updated = offers.filter((o) => o.id !== id);
        setOffers(updated);
        setSelected(updated[0] || null);
        setMessage(t("delete_success"));
        setMessageType("success");
      } else {
        setMessage(data.error || t("delete_error"));
        setMessageType("error");
      }
    } catch (error) {
      console.error("Erreur delete_offer.php", error);
      setMessage(t("delete_server_error"));
      setMessageType("error");
    }
  }

  /* ---------------- FILTER ---------------- */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return offers;

    return offers.filter((o) =>
      [o.title, o.company_name, o.city, o.level, o.duration, o.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(q)),
    );
  }, [offers, search]);

  const pageTitle =
    role === "company" ? t("title_my_offers") : t("title_find_stage");

  const pageSubtitle =
    role === "company"
      ? t("subtitle_company_offers")
      : t("subtitle_student_offers");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-200/30 dark:bg-blue-900/20 blur-3xl" />
        <div className="absolute top-1/2 -left-16 h-64 w-64 rounded-full bg-indigo-200/20 dark:bg-indigo-900/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-cyan-100/30 dark:bg-cyan-900/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* BOUTON RETOUR */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back", "Retour")}
        </button>

        {/* HEADER */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur px-4 py-2 shadow-sm mb-4">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {role === "company" ? t("space_company") : t("space_student")}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{pageTitle}</h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">{pageSubtitle}</p>

          <div className="mt-6">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
              <input
                placeholder={
                  role === "company"
                    ? t("search_my_offers")
                    : t("search_stage")
                }
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur pl-14 pr-4 py-4 outline-none shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-medium ${
              messageType === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400"
                : "border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        {/* MAIN */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-4">
            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {loadingUser || loadingOffers ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm animate-pulse"
                    >
                      <div className="h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-800 mb-3"></div>
                      <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800 mb-4"></div>
                      <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800/50"></div>
                    </div>
                  ))}
                </>
              ) : filtered.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm text-center">
                  <Briefcase className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    {t("no_offers_found")}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-500 mt-1">
                    {t("try_another_search")}
                  </p>
                </div>
              ) : (
                filtered.map((offer) => (
                  <button
                    key={offer.id}
                    onClick={() => setSelected(offer)}
                    className={`w-full text-left rounded-3xl border p-5 transition-all shadow-sm hover:shadow-md ${
                      selected?.id === offer.id
                        ? "border-blue-500 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/20"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-blue-200 dark:hover:border-blue-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2
                          className={`font-bold text-lg leading-snug ${
                            selected?.id === offer.id
                              ? "text-white"
                              : "text-slate-900 dark:text-white"
                          }`}
                        >
                          {offer.title}
                        </h2>

                        <p
                          className={`mt-1 text-sm ${
                            selected?.id === offer.id
                              ? "text-blue-100"
                              : "text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {offer.company_name || t("company_default")}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex flex-wrap gap-2 mt-4 text-xs ${
                        selected?.id === offer.id
                          ? "text-blue-100"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {offer.city && (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${
                            selected?.id === offer.id
                              ? "bg-white/15 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          <MapPin size={12} />
                          {offer.city}
                        </span>
                      )}

                      {offer.level && (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${
                            selected?.id === offer.id
                              ? "bg-white/15 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          <Briefcase size={12} />
                          {offer.level}
                        </span>
                      )}

                      {offer.duration && (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 ${
                            selected?.id === offer.id
                              ? "bg-white/15 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          <Clock size={12} />
                          {offer.duration}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur shadow-sm min-h-[600px] p-8">
              {!selected ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <Building2 className="w-14 h-14 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                    <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                      {t("select_offer_title")}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-500 mt-2">
                      {t("select_offer_desc")}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 text-sm font-medium mb-4">
                        <Briefcase size={14} />
                        {role === "company"
                          ? t("your_offer")
                          : t("available_offer")}
                      </div>

                      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                        {selected.title}
                      </h2>

                      <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                        {selected.company_name}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-5">
                        {selected.city && (
                          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-slate-700 dark:text-slate-300">
                            <MapPin size={16} />
                            {selected.city}
                          </div>
                        )}

                        {selected.level && (
                          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-slate-700 dark:text-slate-300">
                            <Briefcase size={16} />
                            {selected.level}
                          </div>
                        )}

                        {selected.duration && (
                          <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-slate-700 dark:text-slate-300">
                            <Clock size={16} />
                            {selected.duration}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {role === "student" && (
                        <Link
                          to={`/apply/${selected.id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all"
                        >
                          <Send size={16} />
                          {t("apply_btn")}
                        </Link>
                      )}

                      {role === "company" && (
                        <button
                          onClick={() => deleteOffer(selected.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3 text-white font-semibold shadow-lg shadow-red-500/20 hover:shadow-xl transition-all"
                        >
                          <Trash2 size={16} />
                          {t("delete_btn")}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 grid md:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                        {t("company_label")}
                      </div>
                      <div className="font-semibold text-slate-800 dark:text-white">
                        {selected.company_name || t("not_specified")}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t("city_label")}</div>
                      <div className="font-semibold text-slate-800 dark:text-white">
                        {selected.city || t("not_specified")}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t("duration_label")}</div>
                      <div className="font-semibold text-slate-800 dark:text-white">
                        {selected.duration || t("not_specified")}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {t("offer_desc_title")}
                      </h3>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-8 whitespace-pre-line">
                      {selected.description || t("no_desc_available")}
                    </p>
                  </div>

                  {role === "student" && (
                    <div className="mt-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/10 dark:to-blue-900/10 p-5">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        {t("quick_apply_title")}
                      </div>
                      <p className="mt-2 text-slate-600 dark:text-slate-400">
                        {t("quick_apply_desc")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}