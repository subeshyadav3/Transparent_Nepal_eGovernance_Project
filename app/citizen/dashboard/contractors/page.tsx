"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Star, 
  Briefcase, 
  ShieldCheck, 
  Search,
  ExternalLink
} from "lucide-react";
import Loader from "@/components/Loader";

export default function CitizenContractorsPage() {
  const [contractors, setContractors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/citizen/contractors")
      .then((res) => res.json())
      .then((data) => {
        setContractors(data);
        setLoading(false);
      });
  }, []);

  const filtered = contractors.filter(c => 
    c.companyName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="p-6 md:p-10 bg-slate-50/50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
              <Building2 className="text-sky-600" size={28} /> Verified Contractors
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Public record of vendors and their project delivery performance.
            </p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search by company name..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Contractor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((c) => (
            <Card key={c.id} className="p-6 border-slate-200 bg-white hover:border-sky-300 transition-all shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 leading-tight">{c.companyName}</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {c.registrationNo}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-500 justify-end">
                    <Star size={16} fill="currentColor" />
                    <span className="text-lg font-black">{c.score?.toFixed(1) || "N/A"}</span>
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">Trust Score</p>
                </div>
              </div>

              {/* Projects Summary */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-black uppercase text-slate-400 border-b border-slate-50 pb-2">
                  <span className="flex items-center gap-1"><Briefcase size={12} /> Awarded Projects</span>
                  <span className="text-sky-600">{c._count.projects} Total</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {c.projects.length > 0 ? (
                    c.projects.slice(0, 3).map((p: any, i: number) => (
                      <Badge key={i} variant="outline" className="text-[10px] bg-slate-50 text-slate-600 border-slate-200 py-1">
                        {p.projectName}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs italic text-slate-400">No active projects linked.</span>
                  )}
                  {c.projects.length > 3 && (
                    <span className="text-[10px] font-bold text-slate-400 pt-1">+{c.projects.length - 3} more</span>
                  )}
                </div>
              </div>

              {/* Verified Badge Footer */}
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Verified Provider</span>
                </div>
                <button className="text-[10px] font-black uppercase text-sky-600 hover:underline flex items-center gap-1">
                  View Full Profile <ExternalLink size={10} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}   