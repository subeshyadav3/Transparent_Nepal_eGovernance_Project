"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "@/components/Loader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  LayoutDashboard, 
  ExternalLink, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from "lucide-react";

interface Project {
  id: string;
  projectName: string;
  status: string;
  progress: number;
  contractor: { companyName: string };
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/projects")
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;

  // Derived stats for the header
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <LayoutDashboard className="text-blue-900" size={32} />
              Project Administration
            </h1>
            <p className="text-slate-500 mt-1">Manage, monitor, and audit national infrastructure initiatives.</p>
          </div>
          <Link href="/admin/dashboard/projects/create">
            <Button className="bg-blue-900 hover:bg-blue-800 text-white px-6 shadow-lg shadow-blue-900/20 gap-2">
              <Plus size={18} /> Create New Project
            </Button>
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Projects" value={totalProjects} icon={<LayoutDashboard size={20}/>} color="text-blue-900" />
          <StatCard title="Active" value={totalProjects - completedProjects} icon={<Clock size={20}/>} color="text-amber-600" />
          <StatCard title="Completed" value={completedProjects} icon={<CheckCircle2 size={20}/>} color="text-emerald-600" />
          <StatCard title="Alerts" value="0" icon={<AlertCircle size={20}/>} color="text-red-600" />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {projects.map((p) => (
            <Card key={p.id} className="relative group overflow-hidden border-slate-200 hover:border-blue-900/30 transition-all hover:shadow-xl hover:shadow-blue-900/5 bg-white p-0">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${
                    p.status === "COMPLETED" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                    : "bg-blue-50 text-blue-900 border-blue-100"
                  }`}>
                    {p.status}
                  </span>
                  <p className="text-[10px] font-mono text-slate-400">ID: {p.id.slice(-6).toUpperCase()}</p>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-900 transition-colors">
                  {p.projectName}
                </h2>
                
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                  <Building2 size={14} />
                  <span className="font-medium truncate">{p.contractor.companyName}</span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Resource Progress</p>
                    <p className="text-sm font-black text-blue-900">{p.progress}%</p>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-900 transition-all duration-700 ease-in-out"
                      style={{ width: `${p.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
                <Link href={`/admin/dashboard/projects/${p.id}`}>
                  <Button variant="ghost" size="sm" className="text-blue-900 hover:bg-blue-900 hover:text-white gap-2 font-bold text-xs uppercase tracking-widest">
                    Manage Project <ExternalLink size={14} />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <Card className="p-5 flex items-center gap-4 bg-white border-slate-200">
      <div className={`p-3 rounded-xl bg-slate-50 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-black text-slate-900 leading-none mt-1">{value}</p>
      </div>
    </Card>
  );
}