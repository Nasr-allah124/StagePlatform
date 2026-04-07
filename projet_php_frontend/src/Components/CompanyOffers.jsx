import { useEffect, useState } from "react";
import { BriefcaseBusiness, MapPin, Clock } from "lucide-react";

export default function CompanyOffers() {

  const [offers,setOffers] = useState([]);

  const API = "http://localhost:8000/api";

  useEffect(()=>{
    fetch(`${API}/get_company_offers.php`,{
      credentials:"include"
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.ok){
        setOffers(data.offers);
      }
    });
  },[]);

  return(
    <div className="min-h-screen bg-slate-50">

      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-2xl font-semibold text-slate-900 mb-6">
          Mes offres de stage
        </h1>

        <div className="grid gap-6 md:grid-cols-2">

          {offers.map(o=>(
            <div key={o.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

              <h3 className="text-lg font-semibold text-slate-900">
                {o.title}
              </h3>

              <p className="text-sm text-slate-600 mt-2">
                {o.description}
              </p>

              <div className="flex gap-4 mt-4 text-sm text-slate-500">

                <div className="flex items-center gap-1">
                  <MapPin size={16}/>
                  {o.city}
                </div>

                <div className="flex items-center gap-1">
                  <Clock size={16}/>
                  {o.duration}
                </div>

              </div>

            </div>
          ))}

        </div>

        {offers.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <BriefcaseBusiness size={40} className="mx-auto mb-4"/>
            Aucune offre publiée
          </div>
        )}

      </div>

    </div>
  )
}