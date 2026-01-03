"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ShieldAlert,
  Search
} from "lucide-react";
import Loader from "@/components/Loader";

const statusColors: any = {
  SUBMITTED: "bg-slate-100 text-slate-700",
  UNDER_REVIEW: "bg-amber-100 text-amber-700",
  VERIFIED: "bg-blue-100 text-blue-700",
  REJECTED: "bg-red-100 text-red-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
};

export default function ComplaintsAdminPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const res = await fetch("/api/admin/complaints");
    const data = await res.json();
    setComplaints(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const res = await fetch("/api/admin/complaints", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (res.ok) fetchComplaints();
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Public Grievance Portal</h1>
            <p className="text-slate-500 text-xs font-medium">Audit-locked records: Complaints cannot be deleted to ensure transparency.</p>
          </div>
          <Badge variant="outline" className="h-8 gap-2 px-3 border-slate-300">
            <ShieldAlert size={14} className="text-red-500" />
            Immutable Ledger Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {complaints.map((item) => (
            <Card key={item.id} className="p-6 border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <Badge className={`${statusColors[item.status]} font-black text-[10px]`}>
                      {item.status.replace("_", " ")}
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Clock size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="pt-2 flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-[11px] font-bold text-slate-700">{item.project.projectName}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">Reported by: <strong>{item.user.name}</strong></span>
                  </div>
                </div>

                <div className="lg:w-48 flex flex-col gap-2 justify-center border-l border-slate-100 lg:pl-6">
                  <label className="text-[9px] font-black uppercase text-slate-400 mb-1">Update Status</label>
                  <select 
                    value={item.status}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className="text-xs font-bold p-2 rounded border border-slate-200 focus:ring-2 focus:ring-blue-900 bg-white"
                  >
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="RESOLVED">RESOLVED</option>
                  </select>
                </div>

              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}