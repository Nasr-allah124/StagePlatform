import { useTheme } from "../Context/ThemeContext";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Settings as SettingsIcon,
  User,
  Shield,
  SlidersHorizontal,
  Save,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { i18n, t } = useTranslation(); // AJOUT t
  const API_BASE_URL = useMemo(
    () =>
      (
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8010/api"
      ).replace(/\/$/, ""),
    [],
  );

  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") || "profile");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const role = user?.role || "";

  const [profile, setProfile] = useState({
    email: "",
    phone: "",
    full_name: "",
    school: "",
    level: "",
    company_name: "",
    sector: "",
    city: "",
    website: "",
  });

  const [prefs, setPrefs] = useState({
    language: i18n.language || "fr",
    theme: "light",
    preferred_city: "",
    preferred_sector: "",
    preferred_level: "",
    internship_type: "",
    remote_allowed: false,
  });

  const [security, setSecurity] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [ui, setUi] = useState({
    saving: false,
    message: "",
    error: "",
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  });

  function flash(ok, msg) {
    setUi((s) => ({ ...s, message: ok ? msg : "", error: ok ? "" : msg }));
    setTimeout(() => {
      setUi((s) => ({ ...s, message: "", error: "" }));
    }, 3000);
  }
  useEffect(() => {
    const tabParam = searchParams.get("tab") || "profile";
    setTab(tabParam);
  }, [searchParams]);

  useEffect(() => {
    let alive = true;

    async function loadProfile() {
      try {
        const res = await fetch(`${API_BASE_URL}/profile.php`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json().catch(() => null);

        if (!alive) return;

        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || t('error_save'));
        }

        const loadedUser = data.user;
        setUser(loadedUser);

        setProfile({
          email: loadedUser?.email || "",
          phone: loadedUser?.phone || "",
          full_name: loadedUser?.profile?.full_name || "",
          school: loadedUser?.profile?.school || "",
          level: loadedUser?.profile?.level || "",
          company_name: loadedUser?.profile?.company_name || "",
          sector: loadedUser?.profile?.sector || "",
          city: loadedUser?.profile?.city || "",
          website: loadedUser?.profile?.website || "",
        });
        
        if(loadedUser?.prefs?.language) {
            setPrefs(p => ({...p, language: loadedUser.prefs.language}));
            i18n.changeLanguage(loadedUser.prefs.language);
        }

      } catch (err) {
        if (!alive) return;
        flash(false, err?.message || t('error_save'));
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      alive = false;
    };
  }, [API_BASE_URL, i18n, t]);

  async function saveProfile() {
    setUi((s) => ({ ...s, saving: true }));

    try {
      const payload = {
        phone: profile.phone,
      };

      if (role === "student") {
        payload.full_name = profile.full_name;
        payload.school = profile.school;
        payload.level = profile.level;
      } else {
        payload.company_name = profile.company_name;
        payload.sector = profile.sector;
        payload.city = profile.city;
        payload.website = profile.website;
      }

      const res = await fetch(`${API_BASE_URL}/update_profile.php`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || t('error_save'));
      }

      flash(true, t('success_save'));
    } catch (err) {
      flash(
        false,
        err?.message || t('error_save'),
      );
    } finally {
      setUi((s) => ({ ...s, saving: false }));
    }
  }

  async function changePassword() {
    setUi((s) => ({ ...s, saving: true }));

    if (!security.current_password) {
      setUi((s) => ({ ...s, saving: false }));
      return flash(false, t('current_password'));
    }

    if (!security.new_password || security.new_password.length < 8) {
      setUi((s) => ({ ...s, saving: false }));
      return flash(false, t('pass_hint'));
    }

    if (security.new_password !== security.confirm_password) {
      setUi((s) => ({ ...s, saving: false }));
      return flash(false, "Confirmation error");
    }

    const payload = {
      current_password: security.current_password,
      new_password: security.new_password,
      confirm_password: security.confirm_password,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/change_password.php`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      setSecurity({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      flash(true, t('pass_success'));
    } catch (err) {
      flash(false, err?.message || t('error_save'));
    } finally {
      setUi((s) => ({ ...s, saving: false }));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-sm text-slate-700 dark:text-slate-300">{t('loading')}</div>
      </div>
    );
  }

  async function savePrefs() {
    setUi((s) => ({ ...s, saving: true }));
    try {
      setTheme(prefs.theme);

      const res = await fetch(`${API_BASE_URL}/update_preferences.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });

      flash(true, t('success_save'));
    } catch (err) {
      flash(false, t('error_save'));
    } finally {
      setUi((s) => ({ ...s, saving: false }));
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <ArrowLeft size={16} />
              {t('back')}
            </Link>

            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center">
                <SettingsIcon className="text-blue-700 dark:text-blue-400" size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {t('settings_title')}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {t('settings_desc')}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={tab === "prefs" ? savePrefs : saveProfile}
            disabled={ui.saving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
          >
            <Save size={16} />
            {ui.saving ? t('saving') : t('save')}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {(ui.message || ui.error) && (
          <div
            className={[
              "mb-5 rounded-xl border px-4 py-3 text-sm",
              ui.error
                ? "border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400",
            ].join(" ")}
          >
            {ui.error || ui.message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm">
              <TabButton
                active={tab === "profile"}
                onClick={() => setTab("profile")}
                icon={<User size={16} />}
                label={t('tab_profile')}
              />
              <TabButton
                active={tab === "security"}
                onClick={() => setTab("security")}
                icon={<Shield size={16} />}
                label={t('tab_security')}
              />
              <TabButton
                active={tab === "prefs"}
                onClick={() => setTab("prefs")}
                icon={<SlidersHorizontal size={16} />}
                label={t('tab_prefs')}
              />
            </div>

            <div className="mt-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">{t('account')}</div>
              <div className="mt-2 text-sm text-slate-700 dark:text-slate-300 truncate">{user?.email}</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t('role')} : <span className="font-semibold text-blue-600 dark:text-blue-400">{role}</span>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-9">
            {tab === "profile" && (
              <Panel title={t('profile_title')} desc={t('profile_desc')}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Email"
                    value={profile.email}
                    onChange={(v) => setProfile((p) => ({ ...p, email: v }))}
                    disabled
                  />

                  <Field
                    label={t('phone')}
                    value={profile.phone}
                    onChange={(v) => setProfile((p) => ({ ...p, phone: v }))}
                    placeholder="06..."
                  />

                  {role === "student" ? (
                    <>
                      <Field
                        label={t('full_name')}
                        value={profile.full_name}
                        onChange={(v) =>
                          setProfile((p) => ({ ...p, full_name: v }))
                        }
                      />

                      <Field
                        label={t('school')}
                        value={profile.school}
                        onChange={(v) =>
                          setProfile((p) => ({ ...p, school: v }))
                        }
                      />

                      <Field
                        label={t('level')}
                        value={profile.level}
                        onChange={(v) =>
                          setProfile((p) => ({ ...p, level: v }))
                        }
                        placeholder="Licence / Master ..."
                      />
                    </>
                  ) : (
                    <>
                      <Field
                        label={t('company_name')}
                        value={profile.company_name}
                        onChange={(v) =>
                          setProfile((p) => ({ ...p, company_name: v }))
                        }
                      />

                      <Field
                        label={t('sector')}
                        value={profile.sector}
                        onChange={(v) =>
                          setProfile((p) => ({ ...p, sector: v }))
                        }
                      />

                      <Field
                        label={t('city')}
                        value={profile.city}
                        onChange={(v) => setProfile((p) => ({ ...p, city: v }))}
                      />

                      <Field
                        label={t('website')}
                        value={profile.website}
                        onChange={(v) =>
                          setProfile((p) => ({ ...p, website: v }))
                        }
                        placeholder="https://..."
                      />
                    </>
                  )}
                </div>
              </Panel>
            )}

            {tab === "security" && (
              <Panel
                title={t('security_title')}
                desc={t('security_desc')}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <PasswordField
                    label={t('current_password')}
                    value={security.current_password}
                    show={ui.showCurrent}
                    onToggle={() =>
                      setUi((s) => ({ ...s, showCurrent: !s.showCurrent }))
                    }
                    onChange={(v) =>
                      setSecurity((p) => ({ ...p, current_password: v }))
                    }
                  />

                  <div className="hidden md:block" />

                  <PasswordField
                    label={t('new_password')}
                    value={security.new_password}
                    show={ui.showNew}
                    onToggle={() =>
                      setUi((s) => ({ ...s, showNew: !s.showNew }))
                    }
                    onChange={(v) =>
                      setSecurity((p) => ({ ...p, new_password: v }))
                    }
                    hint={t('pass_hint')}
                  />

                  <PasswordField
                    label={t('confirm_password')}
                    value={security.confirm_password}
                    show={ui.showConfirm}
                    onToggle={() =>
                      setUi((s) => ({ ...s, showConfirm: !s.showConfirm }))
                    }
                    onChange={(v) =>
                      setSecurity((p) => ({ ...p, confirm_password: v }))
                    }
                  />
                </div>

                <button
                  onClick={changePassword}
                  disabled={ui.saving}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
                >
                  <Lock size={16} />
                  {t('btn_change_pass')}
                </button>
              </Panel>
            )}

            {tab === "prefs" && (
              <Panel
                title={t('prefs_title')}
                desc={t('prefs_desc')}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField
                    label={t('label_lang')}
                    value={prefs.language}
                    onChange={(v) => { 
                      setPrefs((p) => ({ ...p, language: v }));
                      i18n.changeLanguage(v); 
                    }}
                    options={[
                      { value: "fr", label: "Français" },
                      { value: "en", label: "English" },
                    ]}
                  />

                  <SelectField
                    label={t('label_theme')}
                    value={theme}
                    onChange={(v) => setTheme(v)}
                    options={[
                      { value: "light", label: t('theme_light') },
                      { value: "dark", label: t('theme_dark') },
                    ]}
                  />

                  {role === "student" ? (
                    <>
                      <Field
                        label={t('pref_city')}
                        value={prefs.preferred_city}
                        onChange={(v) =>
                          setPrefs((p) => ({ ...p, preferred_city: v }))
                        }
                        placeholder="Casablanca..."
                      />

                      <Field
                        label={t('pref_sector')}
                        value={prefs.preferred_sector}
                        onChange={(v) =>
                          setPrefs((p) => ({ ...p, preferred_sector: v }))
                        }
                        placeholder="IT..."
                      />

                      <Field
                        label={t('pref_level')}
                        value={prefs.preferred_level}
                        onChange={(v) =>
                          setPrefs((p) => ({ ...p, preferred_level: v }))
                        }
                        placeholder="Licence..."
                      />
                    </>
                  ) : (
                    <>
                      <Field
                        label={t('internship_type')}
                        value={prefs.internship_type}
                        onChange={(v) =>
                          setPrefs((p) => ({ ...p, internship_type: v }))
                        }
                        placeholder="PFE..."
                      />

                      <Toggle
                        label={t('remote')}
                        checked={prefs.remote_allowed}
                        onChange={(v) =>
                          setPrefs((p) => ({ ...p, remote_allowed: v }))
                        }
                      />
                    </>
                  )}
                </div>
              </Panel>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function Panel({ title, desc, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="text-lg font-semibold text-slate-900 dark:text-white">{title}</div>
      <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{desc}</div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition",
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}

function Field({ label, value, onChange, placeholder, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
        {label}
      </label>
      <input
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={[
          "mt-1 w-full rounded-xl border px-3.5 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm outline-none",
          "focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 focus:border-blue-600 dark:focus:border-blue-500",
          disabled ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" : "bg-white dark:bg-slate-800",
          "border-slate-200 dark:border-slate-700",
        ].join(" ")}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-slate-900 dark:text-white shadow-sm outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 cursor-pointer">
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-slate-700"
      />
    </label>
  );
}

function PasswordField({ label, value, onChange, show, onToggle, hint }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
        {label}
      </label>
      <div className="mt-1 relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 pr-12 text-slate-900 dark:text-white shadow-sm outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {hint && <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</div>}
    </div>
  );
}
