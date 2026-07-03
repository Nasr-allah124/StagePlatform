import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import AutocompleteSelect from "./AutocompleteSelect.jsx";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
function validateGmail(email) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email.trim());
}
function validatePhone(phone) {
  if (!phone) return true;
  return /^[0-9+\s()-]{8,20}$/.test(phone.trim());
}
function isValidUrl(url) {
  if (!url) return true;
  return /^https?:\/\/.+/i.test(url.trim());
}

export default function Register() {
  const navigate = useNavigate();

  // ✅ tu peux compléter/adapter
 const SCHOOL_OPTIONS = [
  // =========================
  // UNIVERSITÉS (publiques & reconnues)
  // =========================
  "Université Mohammed V - Rabat",
  "Université Hassan II - Casablanca",
  "Université Cadi Ayyad - Marrakech",
  "Université Ibn Zohr - Agadir",
  "Université Abdelmalek Essaâdi - Tétouan/Tanger",
  "Université Sidi Mohamed Ben Abdellah - Fès",
  "Université Moulay Ismail - Meknès",
  "Université Chouaib Doukkali - El Jadida",
  "Université Sultan Moulay Slimane - Beni Mellal",
  "Université Ibn Tofail - Kénitra",
  "Université Hassan Ier - Settat",
  "Université Mohammed Premier - Oujda",
  "Université Al Akhawayn - Ifrane",
  "Université Internationale de Rabat (UIR)",
  "Université Privée de Marrakech (UPM)",
  "Université Internationale d’Agadir (UIA)",

  // =========================
  // ÉCOLES D’INGÉNIEURS / GRANDES ÉCOLES (Rabat/Casa/etc.)
  // =========================
  "EMI - École Mohammadia d’Ingénieurs (Rabat)",
  "INPT - Institut National des Postes et Télécommunications (Rabat)",
  "INSEA - Institut National de Statistique et d’Économie Appliquée (Rabat)",
  "EHTP - École Hassania des Travaux Publics (Casablanca)",
  "IAV Hassan II - Agronomie & Vétérinaire (Rabat)",
  "ENIM - École Nationale de l’Industrie Minérale (Rabat)",
  "ENSEM - École Nationale Supérieure d’Électricité et de Mécanique (Casablanca)",

  // =========================
  // ENSA (Écoles Nationales des Sciences Appliquées)
  // (liste des villes les plus connues)
  // =========================
  "ENSA Agadir",
  "ENSA Al Hoceima",
  "ENSA Béni Mellal",
  "ENSA Berrechid",
  "ENSA Casablanca",
  "ENSA El Jadida",
  "ENSA Fès",
  "ENSA Kénitra",
  "ENSA Khouribga",
  "ENSA Marrakech",
  "ENSA Oujda",
  "ENSA Safi",
  "ENSA Tanger",
  "ENSA Tétouan",

  // =========================
  // ENSAM (Arts & Métiers)
  // =========================
  "ENSAM Casablanca",
  "ENSAM Meknès",

  // =========================
  // ENCG (Commerce & Gestion)
  // =========================
  "ENCG Agadir",
  "ENCG Casablanca",
  "ENCG Dakhla",
  "ENCG El Jadida",
  "ENCG Fès",
  "ENCG Kénitra",
  "ENCG Marrakech",
  "ENCG Oujda",
  "ENCG Settat",
  "ENCG Tanger",

  // =========================
  // FST (Facultés des Sciences et Techniques)
  // =========================
  "FST Beni Mellal",
  "FST Errachidia",
  "FST Fès",
  "FST Marrakech",
  "FST Mohammedia",
  "FST Settat",
  "FST Tanger",

  // =========================
  // EST (Écoles Supérieures de Technologie)
  // (principales)
  // =========================
  "EST Agadir",
  "EST Béni Mellal",
  "EST Casablanca",
  "EST El Jadida",
  "EST Essaouira",
  "EST Fès",
  "EST Guelmim",
  "EST Kénitra",
  "EST Laâyoune",
  "EST Meknès",
  "EST Oujda",
  "EST Safi",

  // =========================
  // ÉCOLES DE PROF / ENSEIGNEMENT
  // =========================
  "ENS - École Normale Supérieure (Rabat)",
  "ENS (Casablanca)",
  "ENS (Fès)",
  "ENS (Marrakech)",
  "ENS (Tétouan)",
  "ENSET - École Normale Supérieure de l’Enseignement Technique (Mohammedia)",

  // =========================
  // ARCHITECTURE / ARTS
  // =========================
  "ENA - École Nationale d’Architecture (Rabat)",
  "ISADAC - Arts Dramatiques & Animation Culturelle (Rabat)",
  "INBA - Institut National des Beaux-Arts (Tétouan)",

  // =========================
  // MÉDECINE / PHARMACIE / DENTAIRE (facultés)
  // (villes principales)
  // =========================
  "Faculté de Médecine et de Pharmacie (Rabat)",
  "Faculté de Médecine et de Pharmacie (Casablanca)",
  "Faculté de Médecine et de Pharmacie (Fès)",
  "Faculté de Médecine et de Pharmacie (Marrakech)",
  "Faculté de Médecine et de Pharmacie (Oujda)",
  "Faculté de Médecine et de Pharmacie (Tanger)",
  "Faculté de Médecine Dentaire (Rabat)",
  "Faculté de Médecine Dentaire (Casablanca)",

  // =========================
  // SCIENCES / LETTRES / DROIT (générique, si tu veux)
  // =========================
  "Faculté des Sciences",
  "Faculté des Lettres et Sciences Humaines",
  "Faculté des Sciences Juridiques, Économiques et Sociales (FSJES)",

  // =========================
  // FORMATION PROFESSIONNELLE
  // =========================
  "OFPPT",
  "ISTA (OFPPT)",

  // =========================
  // AUTRE
  // =========================
  "Autre",
];

  const LEVEL_OPTIONS = [
    "Bac+1",
    "Bac+2",
    "Bac+3 (Licence)",
    "Bac+4",
    "Bac+5 (Master/Ingénieur)",
    "Doctorat",
  ];

  const SECTOR_OPTIONS = [
    "Informatique / Développement logiciel",
    "Intelligence artificielle / Data",
    "Cybersécurité",
    "Télécommunications",
    "Banque",
    "Assurance",
    "Finance",
    "Comptabilité / Audit",
    "Marketing",
    "Communication",
    "Commerce / Vente",
    "E-commerce",
    "Industrie",
    "Automobile",
    "Aéronautique",
    "Énergie",
    "Énergies renouvelables",
    "BTP / Construction",
    "Immobilier",
    "Transport",
    "Logistique",
    "Agriculture",
    "Agroalimentaire",
    "Tourisme",
    "Hôtellerie",
    "Restauration",
    "Santé",
    "Pharmaceutique",
    "Éducation / Formation",
    "Ressources humaines",
    "Consulting",
    "ONG / Association",
    "Autre",
  ];

  const [form, setForm] = useState({
    role: "student",

    // commun
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    acceptTerms: true,

    // student
    studentFullName: "",
    studentSchool: "",
    studentLevel: "",

    // company
    companyName: "",
    companySector: "",
    companyCity: "",
    companyWebsite: "",
  });

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  function updateField(name, value) {
    setForm((p) => ({ ...p, [name]: value }));
    setStatus((s) => ({ ...s, error: "", success: "" }));
  }

  const errors = useMemo(() => {
    const e = {};

    if (!form.role) e.role = "Choisis un rôle.";

    const email = form.email.trim();
    if (!email) e.email = "Email requis.";
    else if (!validateEmail(email)) e.email = "Email invalide.";
    else if (!validateGmail(email)) e.email = "Utilise un email Gmail valide (ex: nom@gmail.com).";

    if (!form.password) e.password = "Mot de passe requis.";
    else if (form.password.length < 6) e.password = "Minimum 6 caractères.";

    if (!form.confirmPassword) e.confirmPassword = "Confirmation requise.";
    else if (form.confirmPassword !== form.password) e.confirmPassword = "Les mots de passe ne correspondent pas.";

    if (!validatePhone(form.phone)) e.phone = "Téléphone invalide.";

    if (!form.acceptTerms) e.acceptTerms = "Tu dois accepter les conditions.";

    if (form.role === "student") {
      if (!form.studentFullName.trim()) e.studentFullName = "Nom complet requis.";
      if (!form.studentSchool.trim()) e.studentSchool = "École/Université requise.";
      if (!form.studentLevel) e.studentLevel = "Niveau requis.";
    } else {
      if (!form.companyName.trim()) e.companyName = "Nom de l’entreprise requis.";
      if (!form.companySector.trim()) e.companySector = "Secteur requis.";
      if (!form.companyCity.trim()) e.companyCity = "Ville requise.";
      if (!isValidUrl(form.companyWebsite)) e.companyWebsite = "Site web invalide (ex: https://...).";
    }

    return e;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0 && !status.loading;

  const showFieldError = (name) => (submitted || touched[name]) && errors[name];
  const markTouched = (name) => setTouched((t) => ({ ...t, [name]: true }));


  const inputClass = (value, hasError) =>
    [
      "mt-1 w-full rounded-xl border px-3.5 py-2.5 shadow-sm outline-none transition",
      "focus:ring-4 focus:ring-blue-100 focus:border-blue-600",
      hasError ? "border-red-300 focus:ring-red-100 focus:border-red-500" : "border-slate-200",
      value && String(value).trim().length > 0
        ? "bg-slate-900 text-white placeholder:text-slate-300"
        : "bg-slate-200 text-slate-900 placeholder:text-slate-500",
    ].join(" ");

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitted(true);

    const t = {
      role: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
      acceptTerms: true,
    };
    if (form.role === "student") {
      t.studentFullName = true;
      t.studentSchool = true;
      t.studentLevel = true;
    } else {
      t.companyName = true;
      t.companySector = true;
      t.companyCity = true;
      t.companyWebsite = true;
    }
    setTouched(t);

    if (!canSubmit) {
      setStatus((s) => ({ ...s, error: "Veuillez remplir les champs requis." }));
      return;
    }

    setStatus({ loading: true, error: "", success: "" });

    try {
      const payload = {
        role: form.role,
        email: form.email,
        password: form.password,
        phone: form.phone || null,
        profile:
          form.role === "student"
            ? { full_name: form.studentFullName, school: form.studentSchool, level: form.studentLevel }
            : {
                company_name: form.companyName,
                sector: form.companySector,
                city: form.companyCity,
                website: form.companyWebsite || null,
              },
      };

     const API_BASE_URL = "http://localhost:8010/api";

      const res = await fetch(`${API_BASE_URL}/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const raw = await res.text();
      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = null;
      }

      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.error ||
            `API ${res.status}: endpoint introuvable ou erreur serveur (${API_BASE_URL}/register.php)`
        );
      }

      setStatus({ loading: false, error: "", success: "Compte créé avec succès." });
      navigate("/");
    } catch (err) {
      const message =
        err instanceof TypeError
          ? "Impossible de contacter le serveur. Verifie que le backend PHP tourne et que l'URL API est correcte."
          : err?.message || "Erreur inconnue";
      setStatus({ loading: false, error: message, success: "" });
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="min-h-screen w-full grid lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-start gap-10 p-10 text-white bg-gradient-to-br from-blue-700 to-indigo-700">
                 <div className="flex items-center gap-3">
                   <div className="h-11 w-11 rounded-2xl bg-white/15 flex items-center justify-center font-bold">
                     S
                   </div>
                   <div>
                     <div className="text-lg font-semibold">StagePlatform</div>
                     <div className="text-white/80 text-sm">
                       Espace étudiants & entreprises
                     </div>
                   </div>
                 </div>
       
                 <div className="max-w-md">
                   <h2 className="text-4xl font-semibold leading-tight">
                     Trouve un stage plus facilement.
                   </h2>
                   <p className="mt-3 text-white/85 text-base">
                     Postule, suis tes candidatures, et gère les offres côté entreprise
                     — tout au même endroit.
                   </p>
       
                   <div className="mt-8 grid gap-3 text-sm text-white/90">
                     <div className="rounded-xl bg-white/10 p-4 flex items-center gap-3">
                       <CheckCircle2 size={18} className="shrink-0" />
                       Offres & candidatures
                     </div>
                     <div className="rounded-xl bg-white/10 p-4 flex items-center gap-3">
                       <CheckCircle2 size={18} className="shrink-0" />
                       Dashboard entreprise
                     </div>
                     <div className="rounded-xl bg-white/10 p-4 flex items-center gap-3">
                       <CheckCircle2 size={18} className="shrink-0" />
                       Suivi admin (optionnel)
                     </div>
                   </div>
                 </div>
       
                 <p className="text-xs text-white/70">
                   © {new Date().getFullYear()} StagePlatform
                 </p>
               </div>
        {/* RIGHT */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-slate-900">Créer un compte</h1>
              <p className="mt-1 text-sm text-slate-600">Les champs changent selon ton rôle.</p>
            </div>

            {status.error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {status.error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              {/* ROLE */}
              <div>
                <label className="block text-sm font-medium text-slate-800">Je suis</label>
                <div className="mt-1 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => updateField("role", "student")}
                    className={[
                      "rounded-xl border px-3.5 py-2.5 text-sm font-semibold shadow-sm",
                      form.role === "student"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    Étudiant
                  </button>

                  <button
                    type="button"
                    onClick={() => updateField("role", "company")}
                    className={[
                      "rounded-xl border px-3.5 py-2.5 text-sm font-semibold shadow-sm",
                      form.role === "company"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    Entreprise
                  </button>
                </div>
                {showFieldError("role") && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
              </div>

              {/* DYNAMIC */}
              {form.role === "student" ? (
                <>
                  <div>
                    <label  className="block text-sm font-medium text-slate-800">Nom complet</label>
                    <input
                      className={inputClass(form.studentFullName, !!showFieldError("studentFullName"))}
                      placeholder="ex: Ahmed El Idrissi"
                      value={form.studentFullName}
                      onChange={(e) => updateField("studentFullName", e.target.value)}
                      onBlur={() => markTouched("studentFullName")}
                    />
                    {showFieldError("studentFullName") && (
                      <p className="mt-1 text-xs text-red-600">{errors.studentFullName}</p>
                    )}
                  </div>

                  <AutocompleteSelect
                    label="École / Université"
                    placeholder="Tape: ENSA, UM5, Hassan II..."
                    options={SCHOOL_OPTIONS}
                    value={form.studentSchool}
                    onChange={(v) => updateField("studentSchool", v)}
                    onBlur={() => markTouched("studentSchool")}
                    error={showFieldError("studentSchool") ? errors.studentSchool : ""}
                    inputClassName={inputClass(form.studentSchool, !!showFieldError("studentSchool"))}
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-800">Niveau</label>
                    <select
                      className={inputClass(form.studentLevel, !!showFieldError("studentLevel"))}
                      value={form.studentLevel}
                      onChange={(e) => updateField("studentLevel", e.target.value)}
                      onBlur={() => markTouched("studentLevel")}
                    >
                      <option value="">-- Choisir --</option>
                      {LEVEL_OPTIONS.map((lvl) => (
                        <option key={lvl} value={lvl} className="text-slate-900 bg-white">
                          {lvl}
                        </option>
                      ))}
                    </select>
                    {showFieldError("studentLevel") && (
                      <p className="mt-1 text-xs text-red-600">{errors.studentLevel}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-800">Nom de l’entreprise</label>
                    <input
                      className={inputClass(form.companyName, !!showFieldError("companyName"))}
                      placeholder="ex: TechCorp"
                      value={form.companyName}
                      onChange={(e) => updateField("companyName", e.target.value)}
                      onBlur={() => markTouched("companyName")}
                    />
                    {showFieldError("companyName") && (
                      <p className="mt-1 text-xs text-red-600">{errors.companyName}</p>
                    )}
                  </div>

                  <AutocompleteSelect
                    label="Secteur"
                    placeholder="Tape: Informatique, Banque, ..."
                    options={SECTOR_OPTIONS}
                    value={form.companySector}
                    onChange={(v) => updateField("companySector", v)}
                    onBlur={() => markTouched("companySector")}
                    error={showFieldError("companySector") ? errors.companySector : ""}
                    inputClassName={inputClass(form.companySector, !!showFieldError("companySector"))}
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-800">Ville</label>
                    <input
                      className={inputClass(form.companyCity, !!showFieldError("companyCity"))}
                      placeholder="ex: Casablanca"
                      value={form.companyCity}
                      onChange={(e) => updateField("companyCity", e.target.value)}
                      onBlur={() => markTouched("companyCity")}
                    />
                    {showFieldError("companyCity") && (
                      <p className="mt-1 text-xs text-red-600">{errors.companyCity}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-800">Site web (optionnel)</label>
                    <input
                      className={inputClass(form.companyWebsite, !!showFieldError("companyWebsite"))}
                      placeholder="ex: https://mon-entreprise.com"
                      value={form.companyWebsite}
                      onChange={(e) => updateField("companyWebsite", e.target.value)}
                      onBlur={() => markTouched("companyWebsite")}
                    />
                    {showFieldError("companyWebsite") && (
                      <p className="mt-1 text-xs text-red-600">{errors.companyWebsite}</p>
                    )}
                  </div>
                </>
              )}

              {/* COMMUN */}
              <div>
                <label className="block text-sm font-medium text-slate-800">Téléphone (optionnel)</label>
                <input
                  className={inputClass(form.phone, !!showFieldError("phone"))}
                  placeholder="ex: +212 6 12 34 56 78"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  onBlur={() => markTouched("phone")}
                />
                {showFieldError("phone") && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label  className="block text-sm font-medium text-slate-800">Email</label>
                <input
                  type="email"
                  className={inputClass(form.email, !!showFieldError("email"))}
                  placeholder="ex: nom@gmail.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  onBlur={() => markTouched("email")}
                  autoComplete="email"
                />
                {showFieldError("email") && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label  className="block text-sm font-medium text-slate-800">Mot de passe</label>
                <div className="mt-1 relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    className={inputClass(form.password, !!showFieldError("password")) + " pr-12"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    onBlur={() => markTouched("password")}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 p-0 text-slate-500 hover:text-slate-700 focus:outline-none"
                  >
                    {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {showFieldError("password") && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label  className="block text-sm font-medium text-slate-800">Confirmer le mot de passe</label>
                <div className="mt-1 relative">
                  <input
                    type={showConfirmPwd ? "text" : "password"}
                    className={inputClass(form.confirmPassword, !!showFieldError("confirmPassword")) + " pr-12"}
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    onBlur={() => markTouched("confirmPassword")}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 p-0 text-slate-500 hover:text-slate-700 focus:outline-none"
                  >
                    {showConfirmPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {showFieldError("confirmPassword") && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm text-slate-700 select-none">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={form.acceptTerms}
                    onChange={(e) => updateField("acceptTerms", e.target.checked)}
                    onBlur={() => markTouched("acceptTerms")}
                  />
                  J’accepte les conditions d’utilisation.
                </label>
                {showFieldError("acceptTerms") && (
                  <p className="mt-1 text-xs text-red-600">{errors.acceptTerms}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status.loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Création...
                  </span>
                ) : (
                  "Créer mon compte"
                )}
              </button>

              <p className="pt-2 text-center text-sm text-slate-600">
                Déjà un compte ?{" "}
                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
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
