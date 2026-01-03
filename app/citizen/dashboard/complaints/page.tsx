"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Building2, 
  Construction, 
  Clock, 
  ShieldCheck 
} from "lucide-react";
import Loader from "@/components/Loader";

export default function PublicComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/citizen/complaints")
      .then((res) => res.json())
      .then((data) => {
        setComplaints(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 md:p-10 bg-slate-50/50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
              <AlertTriangle className="text-amber-500" size={28} /> Public Grievances
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Transparency Ledger: All reported issues and responsible contractors.
            </p>
          </div>
          <Badge variant="outline" className="py-1.5 px-4 border-slate-300 bg-white text-slate-600 font-bold gap-2">
            <ShieldCheck size={14} className="text-emerald-500" /> Immutable Record
          </Badge>
        </div>

        {/* Complaints Feed */}
        <div className="grid grid-cols-1 gap-6">
          {complaints.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium font-mono text-sm uppercase">No complaints on record.</p>
            </div>
          ) : (
            complaints.map((item) => (
              <Card key={item.id} className="p-0 overflow-hidden border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  
                  {/* Status Sidebar (Color Coded) */}
                  <div className={`w-2 h-auto ${item.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />

                  <div className="p-6 flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <Badge className="bg-slate-900 text-[10px] font-black">{item.status}</Badge>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                        <Clock size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                      {item.title}
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {item.description}
                    </p>

                    {/* Responsibility Tags */}
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded">
                          <Construction size={14} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Project</p>
                          <p className="text-xs font-bold text-slate-700">{item.project.projectName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-50 text-purple-600 rounded">
                          <Building2 size={14} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Lead Contractor</p>
                          <p className="text-xs font-bold text-slate-700">{item.project.contractor.companyName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}