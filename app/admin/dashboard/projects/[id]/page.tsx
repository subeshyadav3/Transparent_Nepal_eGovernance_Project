"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { 
  FileText, 
  Settings2, 
  MessageSquare, 
  AlertTriangle, 
  History, 
  TrendingUp, 
  Calendar,
  Upload,
  CheckCircle2
} from "lucide-react";

const STATUS_OPTIONS = ["PLANNED", "ONGOING", "COMPLETED"];

export default function ProjectDetailsAdmin() {
  const params = useParams();
  const { data: session } = useSession();
  const [project, setProject] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({ status: "", progress: 0 });
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [newReportTitle, setNewReportTitle] = useState("");
  const [newReportSummary, setNewReportSummary] = useState("");
  const [newReportFile, setNewReportFile] = useState<File | null>(null);

  useEffect(() => {
    fetch(`/api/admin/projects/admin?id=${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setForm({ status: data.status, progress: data.progress });
        if ((data.rescheduleLogs?.length ?? 0) < 2) {
          setRescheduleDate(data.endDate?.split("T")[0] ?? "");
        }
      });
  }, [params.id]);

  const handleSave = async () => {
    const body: any = { id: project.id, ...form };
    if (rescheduleDate && (project.rescheduleLogs?.length ?? 0) < 2) {
      body.endDate = rescheduleDate;
    }
    await fetch(`/api/admin/projects/admin?id=${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const res = await fetch(`/api/admin/projects/admin?id=${project.id}`);
    const updated = await res.json();
    setProject(updated);
    setEditing(false);
  };

  const handleUploadReport = async () => {
    if (!newReportTitle) return;
    const formData = new FormData();
    formData.append("title", newReportTitle);
    formData.append("summary", newReportSummary);
    if (newReportFile) formData.append("file", newReportFile);
    formData.append("projectId", project.id);

    const res = await fetch(`/api/admin/projects/report?id=${project.id}`, {
      method: "POST",
      body: formData,
    });
    const updatedReport = await res.json();
    setProject({ ...project, projectReports: [...(project.projectReports ?? []), updatedReport] });
    setNewReportTitle(""); setNewReportSummary(""); setNewReportFile(null);
  };

  if (!project) return <div className="p-20 text-center text-slate-500 italic">Loading administrative records...</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-900 bg-blue-50 px-2 py-0.5 rounded">Admin View</span>
            <span className="text-[10px] font-mono text-slate-400">ID: {project.id}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{project.projectName}</h1>
        </div>
        <Button 
          variant={editing ? "destructive" : "outline"} 
          className="gap-2 font-bold uppercase text-xs tracking-widest"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Exit Edit Mode" : <><Settings2 size={16} /> Edit Project</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Control Panel */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 border-slate-200 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <TrendingUp size={120} className="text-blue-900" />
            </div>

            {editing ? (
              <div className="space-y-6 relative z-10">
                <h2 className="text-lg font-black text-blue-900 uppercase tracking-tighter italic border-b pb-2">Modify Project State</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Project Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Progress (%)</label>
                    <Input
                      type="number"
                      value={form.progress}
                      onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                    />
                  </div>

                  {(project.rescheduleLogs?.length ?? 0) < 2 && (
                    <div className="space-y-2 md:col-span-2 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
                      <label className="text-[10px] font-black uppercase text-slate-400">Request Deadline Extension</label>
                      <Input
                        type="date"
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="bg-white"
                      />
                      <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">
                        Available Reschedules: {2 - (project.rescheduleLogs?.length ?? 0)} remaining
                      </p>
                    </div>
                  )}
                </div>
                <Button onClick={handleSave} className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-6">
                  Save Official Update
                </Button>
              </div>
            ) : (
              <div className="space-y-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <DetailItem label="Status" value={project.status} color="text-blue-900" />
                  <DetailItem label="Progress" value={`${project.progress}%`} />
                  <DetailItem label="Budget" value={`₹${project.totalCost?.toLocaleString()}`} />
                  <DetailItem label="Contractor" value={project.contractor?.companyName} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Current Completion Audit</span>
                    <span className="text-blue-900">{project.progress}% Complete</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full bg-blue-900 transition-all duration-1000" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                   <div className="flex gap-3 items-center">
                      <Calendar className="text-slate-400" size={18} />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Commencement</p>
                        <p className="text-sm font-bold">{new Date(project.startDate).toLocaleDateString()}</p>
                      </div>
                   </div>
                   <div className="flex gap-3 items-center">
                      <History className="text-slate-400" size={18} />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Current Deadline</p>
                        <p className="text-sm font-bold text-red-700">{new Date(project.endDate).toLocaleDateString()}</p>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </Card>

          {/* Project Reports Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight italic">
              <FileText size={22} className="text-blue-900" /> Administrative Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(project.projectReports ?? []).map((r: any) => (
                <Card key={r.id} className="p-4 flex items-center justify-between border-slate-200 group hover:border-blue-900 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded group-hover:bg-blue-50 transition-colors text-slate-400 group-hover:text-blue-900">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{r.title}</p>
                      <p className="text-[10px] text-slate-400 uppercase">Audit Record</p>
                    </div>
                  </div>
                  <a href={`/uploads/${r.title}.pdf`} target="_blank" rel="noreferrer" className="text-blue-900 hover:underline text-xs font-black uppercase">View</a>
                </Card>
              ))}

              {editing && (
                <Card className="p-6 border-2 border-dashed border-slate-200 bg-white space-y-4 md:col-span-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-blue-900 flex items-center gap-2">
                    <Upload size={14} /> Upload New Report
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Report Title" value={newReportTitle} onChange={(e) => setNewReportTitle(e.target.value)} />
                    <input type="file" accept="application/pdf" className="text-xs mt-2" onChange={(e) => e.target.files && setNewReportFile(e.target.files[0])} />
                    <Textarea placeholder="Brief summary of findings..." className="md:col-span-2" value={newReportSummary} onChange={(e) => setNewReportSummary(e.target.value)} />
                  </div>
                  <Button onClick={handleUploadReport} className="bg-slate-900 text-white font-bold text-xs uppercase w-full">Commit Report to Registry</Button>
                </Card>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar: Citizen Feedback & Complaints */}
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight italic">
              <MessageSquare size={18} className="text-blue-900" /> Public Pulse ({project.comments?.length ?? 0})
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {(project.comments ?? []).map((c: any) => (
                <div key={c.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-blue-900">
                  <p className="text-[10px] font-black text-blue-900 uppercase mb-1">{c.user?.name}</p>
                  <p className="text-sm text-slate-600 italic">"{c.message}"</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight italic">
              <AlertTriangle size={18} className="text-red-600" /> Active Grievances ({project.complaints?.length ?? 0})
            </h2>
            <div className="space-y-3">
              {(project.complaints ?? []).map((c: any) => (
                <div key={c.id} className="bg-red-50/30 p-4 rounded-xl border border-red-100 shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-black text-red-900 uppercase leading-tight">{c.title}</p>
                    <span className="text-[9px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase">{c.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Filed by: {c.user?.name}</p>
                  <Button variant="outline" size="xs" className="h-7 text-[10px] font-black uppercase border-red-200 text-red-700 hover:bg-red-700 hover:text-white w-full">Take Action</Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, color = "text-slate-800" }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-sm font-black ${color} truncate`}>{value || "N/A"}</p>
    </div>
  );
}