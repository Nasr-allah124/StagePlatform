import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import
import {
  BriefcaseBusiness,
  MapPin,
  Clock,
  FileText,
  Send,
  Layers,
  Sparkles,
  Building2,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Rocket,
  Target,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Info,
  ShieldCheck,
  Zap
} from "lucide-react";

/**
 * Composant Create_offer
 * Gère la création d'offres de stage avec un formulaire multi-étapes
 */

export default function Create_offer() {
  const { t } = useTranslation(); // Hook de traduction
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // État du formulaire
  const [form, setForm] = useState({
    title: "",
    city: "",
    duration: "",
    sector: "",
    description: "",
    requirements: "",
    remote: "no",
    salary: "",
    experience: "beginner",
    startDate: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Configuration des données (Les noms des secteurs peuvent aussi être traduits via t())
  const sectors = [
    { id: "tech", name: t("sector_tech"), icon: "💻", color: "from-blue-500 to-cyan-400" },
    { id: "marketing", name: t("sector_marketing"), icon: "📢", color: "from-pink-500 to-rose-400" },
    { id: "finance", name: t("sector_finance"), icon: "💰", color: "from-emerald-500 to-teal-400" },
    { id: "design", name: t("sector_design"), icon: "🎨", color: "from-purple-500 to-violet-400" },
    { id: "engineering", name: t("sector_engineering"), icon: "⚙️", color: "from-orange-500 to-amber-400" },
    { id: "hr", name: t("sector_hr"), icon: "👥", color: "from-indigo-500 to-blue-400" },
    { id: "sales", name: t("sector_sales"), icon: "📈", color: "from-yellow-500 to-orange-400" },
    { id: "legal", name: t("sector_legal"), icon: "⚖️", color: "from-slate-500 to-slate-400" }
  ];

  const durations = [
    { value: "1-2", label: t("duration_1_2"), desc: t("desc_short") },
    { value: "3-4", label: t("duration_3_4"), desc: t("desc_operational") },
    { value: "5-6", label: t("duration_5_6"), desc: t("desc_long") },
    { value: "6+", label: t("duration_6_plus"), desc: t("desc_pre_emp") },
  ];

  // Handlers
  const update = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'description') setCharCount(value.length);
    
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const touch = useCallback((name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!form.title?.trim() || form.title.length < 3) newErrors.title = t("error_title_short", "Le titre doit faire au moins 3 caractères");
    if (!form.city?.trim()) newErrors.city = t("error_city_req");
    if (!form.duration) newErrors.duration = t("error_duration_req");
    if (!form.sector) newErrors.sector = t("error_sector_req");
    if (!form.description?.trim() || form.description.length < 50) newErrors.description = t("error_desc_min");
    if (!form.requirements?.trim() || form.requirements.length < 20) newErrors.requirements = t("error_req_min");
    
    console.log("Validation check:", { hasErrors: Object.keys(newErrors).length > 0, errors: newErrors });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep = (stepNum) => {
    const stepErrors = {};
    if (stepNum === 1) {
      if (!form.title?.trim()) stepErrors.title = t("required");
      if (!form.sector) stepErrors.sector = t("required");
    }
    if (stepNum === 2) {
      if (!form.city?.trim()) stepErrors.city = t("required");
      if (!form.duration) stepErrors.duration = t("required");
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit called");
    console.log("Form data before validation:", form);
    
    if (!validate()) {
      console.log("Validation FAILED - Errors:", errors);
      return;
    }
    
    console.log("Validation PASSED");
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));

    try {
      // Convertir les valeurs du formulaire au format attendu par le backend
      const dataToSend = {
        ...form,
        remote: form.remote === "full" ? "remote" : form.remote === "hybrid" ? "hybrid" : "on-site"
      };

      console.log("Sending data to backend:", dataToSend);

      const res = await fetch("http://localhost:8010/api/create_offer.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Backend response:", data);

      if (data.ok) {
        console.log("SUCCESS - Showing success screen");
        setShowSuccess(true);
        setTimeout(() => navigate("/offers"), 2500);
      } else {
        const errorMsg = data.error || t("submission_failed");
        console.error("Error from backend:", errorMsg);
        setErrors({ global: errorMsg });
        alert("❌ Erreur: " + errorMsg);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("❌ Erreur réseau: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6 animate-in zoom-in duration-500">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
            <div className="relative bg-emerald-500 rounded-full p-6 shadow-xl">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t("offer_published")}</h2>
          <p className="text-slate-500 dark:text-slate-400">{t("offer_published_desc")}</p>
          <div className="pt-4">
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 animate-progress-loading"></div>
            </div>
            <p className="mt-2 text-xs text-slate-400">{t("redirecting")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] dark:bg-blue-500/10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] dark:bg-purple-500/10"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 px-4 py-2 rounded-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          {t("back")}
        </button>

        <div className="mb-12 text-center lg:text-left lg:flex lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Zap className="w-3 h-3" /> {t("talent_acquisition")}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t("create_an")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">{t("offer_word")}</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              {t("create_offer_subtitle")}
            </p>
          </div>
          
          <div className="hidden lg:block">
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-bold text-slate-900 dark:text-white">{t("candidate_count")}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">{t("waiting_roles")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-500" />
                {t("quick_tips")}
              </h3>
              
              <div className="space-y-6">
                {[
                  { t: t("tip_1_title"), d: t("tip_1_desc") },
                  { t: t("tip_2_title"), d: t("tip_2_desc") },
                  { t: t("tip_3_title"), d: t("tip_3_desc") }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                      <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">{idx + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{item.t}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">{t("quality_check")}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{t("quality_desc")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-900/80 px-8 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        step === num 
                          ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/30" 
                          : step > num ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                      }`}>
                        {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
                      </div>
                      <span className={`text-xs font-bold hidden sm:block ${step === num ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`}>
                        {num === 1 ? t("step_basics") : num === 2 ? t("step_conditions") : t("step_description")}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                  {t("step_x_of_y", { current: step, total: 3 })}
                </div>
              </div>

              {step === 1 && (
                <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t("offer_title")}</label>
                      <div className="relative group">
                        <BriefcaseBusiness className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                          type="text"
                          value={form.title}
                          onChange={(e) => update("title", e.target.value)}
                          onBlur={() => touch("title")}
                          placeholder={t("title_placeholder")}
                          className={`w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl outline-none transition-all dark:text-white ${
                            errors.title && touched.title ? "border-red-300 ring-4 ring-red-50" : "border-slate-100 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20"
                          }`}
                        />
                      </div>
                      {errors.title && touched.title && <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.title}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">{t("activity_sector")}</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {sectors.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => update("sector", s.id)}
                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 group ${
                              form.sector === s.id 
                                ? `border-transparent bg-gradient-to-br ${s.color} text-white shadow-lg scale-[1.02]` 
                                : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-200 dark:hover:border-slate-600"
                            }`}
                          >
                            <span className={`text-2xl transition-transform group-hover:scale-110 ${form.sector === s.id ? "filter brightness-0 invert" : ""}`}>{s.icon}</span>
                            <span className="text-[10px] font-bold text-center uppercase tracking-tighter">{s.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t("location_city")}</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => update("city", e.target.value)}
                          placeholder={t("city_placeholder")}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t("remote_policy")}</label>
                      <select 
                        value={form.remote}
                        onChange={(e) => update("remote", e.target.value)}
                        className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500 dark:text-white appearance-none"
                      >
                        <option value="no">{t("on_site")}</option>
                        <option value="hybrid">{t("hybrid")}</option>
                        <option value="full">{t("full_remote")}</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">{t("duration")}</label>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {durations.map((d) => (
                          <div 
                            key={d.value}
                            onClick={() => update("duration", d.value)}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                              form.duration === d.value 
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                                : "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            }`}
                          >
                            <div>
                              <p className={`font-bold text-sm ${form.duration === d.value ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"}`}>{d.label}</p>
                              <p className="text-[11px] text-slate-500">{d.desc}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.duration === d.value ? "border-blue-500 bg-blue-500" : "border-slate-300 dark:border-slate-600"}`}>
                              {form.duration === d.value && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t("job_description")}</label>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${charCount < 50 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                          {charCount} {t("chars")}
                        </span>
                      </div>
                      <textarea
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        placeholder={t("desc_placeholder")}
                        rows={6}
                        className="w-full p-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500 dark:text-white text-sm leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t("required_skills")}</label>
                      <textarea
                        value={form.requirements}
                        onChange={(e) => update("requirements", e.target.value)}
                        placeholder={t("skills_placeholder")}
                        rows={4}
                        className="w-full p-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-blue-500 dark:text-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" /> {t("back")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate("/offers")}
                    className="text-slate-400 dark:text-slate-500 text-sm font-bold hover:underline"
                  >
                    {t("cancel_exit")}
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-slate-200 dark:shadow-none"
                  >
                    {t("next_step")} <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-blue-500/20 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {t("publishing")}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" /> {t("confirm_publish")}
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>

            <div className="mt-6 flex items-center justify-center gap-6 text-slate-400 dark:text-slate-500">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <Info className="w-3.5 h-3.5" /> {t("data_encrypted")}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <Clock className="w-3.5 h-3.5" /> {t("auto_save")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress-loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress-loading {
          animation: progress-loading 2.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
