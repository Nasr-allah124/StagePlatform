import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Clock,
  Building2,
  Send,
  BriefcaseBusiness,
  Upload,
  X,
} from "lucide-react";

export default function StudentOffers() {
    const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const [applyOffer, setApplyOffer] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    cv: null,
  });

  const API = "http://localhost:8000/api";

  /* -----------------------------
      LOAD OFFERS
  ----------------------------- */

  useEffect(() => {
    fetch(`${API}/get_offers.php`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setOffers(data.offers);
          setFiltered(data.offers);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  /* -----------------------------
      SEARCH FILTER
  ----------------------------- */

  useEffect(() => {
    let result = offers;

    if (search) {
      result = result.filter((o) =>
        o.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (cityFilter) {
      result = result.filter((o) =>
        o.city?.toLowerCase().includes(cityFilter.toLowerCase()),
      );
    }

    setFiltered(result);
  }, [search, cityFilter, offers]);

  /* -----------------------------
      UPDATE FORM
  ----------------------------- */

  function update(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  /* -----------------------------
      APPLY FUNCTION
  ----------------------------- */

  async function sendApplication(e) {
    e.preventDefault();

    const data = new FormData();

    data.append("internship_id", applyOffer.id);
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("message", form.message);
    data.append("cv", form.cv);

    try {
      const res = await fetch(`${API}/apply.php`, {
        method: "POST",
        credentials: "include",
        body: data,
      });

      const result = await res.json();

      if (result.ok) {
        alert("Candidature envoyée 🚀");

        setApplyOffer(null);

        setForm({
          name: "",
          email: "",
          message: "",
          cv: null,
        });
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            Offres de stage
          </h1>

          <p className="text-sm text-slate-500">
            Explore les opportunités proposées par les entreprises.
          </p>
        </div>

        {/* SEARCH */}

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />

            <input
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none"
              placeholder="Rechercher une offre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <input
            className="rounded-xl border border-slate-200 px-4 py-2.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none"
            placeholder="Filtrer par ville"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          />
        </div>

        {/* OFFERS GRID */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Building2 size={16} />
                  {offer.company_name || "Entreprise"}
                </div>

                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {offer.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                  {offer.description}
                </p>

                <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    {offer.city}
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    {offer.duration}
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/postule/${offer.id}`)}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white py-2.5 font-semibold hover:bg-blue-700 transition"
              >
                <Send size={16} />
                Postuler
              </button>
            </div>
          ))}
        </div>

        {/* EMPTY */}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <BriefcaseBusiness size={40} className="mx-auto mb-4" />
            Aucune offre trouvée
          </div>
        )}
      </div>

      {/* APPLY MODAL */}

      {applyOffer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[420px] shadow-lg relative">
            <button
              onClick={() => setApplyOffer(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Postuler au stage</h2>

            <form onSubmit={sendApplication} className="space-y-3">
              <input
                placeholder="Nom complet"
                className="border p-2 rounded w-full"
                onChange={(e) => update("name", e.target.value)}
                required
              />

              <input
                placeholder="Email"
                className="border p-2 rounded w-full"
                onChange={(e) => update("email", e.target.value)}
                required
              />

              <textarea
                placeholder="Message"
                className="border p-2 rounded w-full"
                onChange={(e) => update("message", e.target.value)}
              />

              <div className="flex items-center gap-2 border p-2 rounded">
                <Upload size={16} />

                <input
                  type="file"
                  onChange={(e) => update("cv", e.target.files[0])}
                  required
                />
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Envoyer candidature
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
