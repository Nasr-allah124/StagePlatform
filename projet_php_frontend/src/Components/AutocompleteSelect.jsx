import React, { useEffect, useMemo, useRef, useState } from "react";

export default function AutocompleteSelect({
  label,
  placeholder = "Tape pour chercher...",
  options = [],
  value,
  onChange,
  onBlur,
  error,
  inputClassName = "",
  maxResults = 8,
}) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return options.slice(0, maxResults);

    const out = options.filter((opt) => opt.toLowerCase().includes(q));
    return out.slice(0, maxResults);
  }, [query, options, maxResults]);

  // fermer si click dehors
  useEffect(() => {
    function onDocClick(e) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function pick(opt) {
    onChange(opt);
    setQuery(opt);
    setOpen(false);
  }

  return (
    <div ref={wrapRef} className="relative">
      {label ? <label className="block text-sm font-medium text-slate-800">{label}</label> : null}

      <input
        value={query}
        onChange={(e) => {
          const v = e.target.value;
          setQuery(v);
          onChange(v); // garde dans parent
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => onBlur?.()}
        placeholder={placeholder}
        className={inputClassName}
        autoComplete="off"
      />

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {/* ✅ max height + scroll */}
          <div className="max-h-56 overflow-auto">
            {filtered.length === 0 ? (
              <div className="px-3.5 py-2.5 text-sm text-slate-500">
                Aucun résultat
              </div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()} // évite blur
                  onClick={() => pick(opt)}
                  className="block w-full text-left px-3.5 py-2.5 text-sm text-slate-800 hover:bg-slate-50"
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
