"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  AlertTriangle, 
  ThumbsUp, 
  ThumbsDown, 
  Lock,
  Building2,
  Wallet
} from "lucide-react";

export default function ProjectDetailsCitizen() {
  const params = useParams();
  const { data: session } = useSession();
  const [project, setProject] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [complaintTitle, setComplaintTitle] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProject = async () => {
    const res = await fetch(`/api/citizen/projects?id=${params.id}`);
    const data = await res.json();
    setProject(data);
  };

  useEffect(() => { fetchProject(); }, [params.id]);

  const handleAction = async (action: "comment" | "complaint" | "vote", type?: "up" | "down") => {
    if (!session?.user) return alert("Unauthorized: Please Login");
    setLoading(true);
    try {
      const payload: any = { projectId: project.id, action };
      if (action === "comment") payload.message = comment;
      if (action === "complaint") { payload.title = complaintTitle; payload.description = complaintDescription; }
      if (action === "vote") payload.type = type;

      const res = await fetch("/api/citizen/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setComment(""); setComplaintTitle(""); setComplaintDescription("");
        fetchProject();
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (!project) return <div className="p-20 text-center font-semibold text-slate-500 italic">Retrieving Government Records...</div>;

  const isCompleted = project.status === "COMPLETED";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                  isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {project.status}
                </span>
                <span className="text-slate-400 text-xs">Ref: {project.id.slice(-8).toUpperCase()}</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{project.projectName}</h1>
            </div>
            
            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Total Allocation</p>
                <p className="text-2xl font-black text-blue-900">₹{project.totalCost.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* LEFT COLUMN: Project Intelligence */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Timeline & Progress Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="flex items-center text-slate-400 gap-2 text-xs font-bold uppercase"><Calendar size={14}/> Duration</div>
              <p className="text-sm font-semibold">{new Date(project.startDate).toLocaleDateString()} — {new Date(project.endDate).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-slate-400 gap-2 text-xs font-bold uppercase"><Building2 size={14}/> Contractor</div>
              <p className="text-sm font-semibold">{project.contractor?.companyName}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-slate-400 gap-2 text-xs font-bold uppercase"><Clock size={14}/> Current Progress</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-900" style={{width: `${project.progress}%`}} />
                </div>
                <span className="text-sm font-bold text-blue-900">{project.progress}%</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
             <h2 className="text-lg font-bold mb-3 border-b pb-2 text-slate-800">Project Overview</h2>
             <p className="text-slate-600 leading-relaxed italic">"{project.description}"</p>
          </div>

          {/* Engagement History (Viewable by everyone, but logic handles content) */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800"><MessageSquare size={20} className="text-blue-900"/> Public Discussion</h2>
            {project.comments?.length > 0 ? (
              <div className="space-y-4">
                {project.comments.map((c: any) => (
                  <div key={c.id} className="bg-white p-4 rounded-lg border-l-4 border-blue-900 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-blue-900">{c.user?.name}</span>
                      <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-700">{c.message}</p>
                  </div>
                ))}
              </div>
            ) : <p className="text-slate-400 text-sm italic">No citizen comments recorded yet.</p>}

            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800"><AlertTriangle size={20} className="text-red-600"/> Grievance Records</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.complaints?.map((c: any) => (
                <div key={c.id} className="bg-red-50/50 border border-red-100 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-xs text-red-900 uppercase">{c.title}</p>
                    <span className="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-black">{c.status}</span>
                  </div>
                  <p className="text-xs text-red-700/80">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Citizen Interaction (LOCKED UNLESS COMPLETED) */}
        <div className="lg:col-span-1">
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-xl sticky top-8 overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              {isCompleted ? <CheckCircle2 className="text-emerald-500 opacity-20" size={60}/> : <Lock className="text-slate-200" size={60}/>}
            </div>

            <h3 className="text-lg font-black uppercase tracking-tight mb-6">Citizen Action Center</h3>
            
            {!isCompleted ? (
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl text-center space-y-3">
                <Lock className="mx-auto text-slate-400" size={32}/>
                <p className="text-sm font-bold text-slate-600 uppercase">Input Locked</p>
                <p className="text-xs text-slate-400 leading-relaxed">Voting, Feedback, and Complaints are only enabled for **COMPLETED** projects to ensure valid final assessments.</p>
              </div>
            ) : !session?.user ? (
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-sm font-medium text-blue-900">Sign in as a Citizen to participate in this project audit.</p>
              </div>
            ) : (
              <div className="space-y-8 relative z-10">
                {/* Voting Section */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Public Approval</p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 hover:bg-emerald-50 hover:text-emerald-700 gap-2 border-slate-200" onClick={() => handleAction("vote", "up")} disabled={loading}>
                      <ThumbsUp size={16}/> {project.upvotes}
                    </Button>
                    <Button variant="outline" className="flex-1 hover:bg-red-50 hover:text-red-700 gap-2 border-slate-200" onClick={() => handleAction("vote", "down")} disabled={loading}>
                      <ThumbsDown size={16}/> {project.downvotes}
                    </Button>
                  </div>
                </div>

                {/* Comment Section */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Post a Review</p>
                  <Textarea placeholder="How is the quality of work?" className="bg-slate-50 border-slate-200 min-h-[80px]" value={comment} onChange={(e) => setComment(e.target.value)} />
                  <Button className="w-full bg-blue-900 text-white" onClick={() => handleAction("comment")} disabled={loading}>Submit Feedback</Button>
                </div>

                <hr className="border-slate-100" />

                {/* Complaint Section */}
                <div className="space-y-3">
                   <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Report Infrastructure Defect</p>
                   <Input placeholder="Complaint Subject" className="bg-slate-50" value={complaintTitle} onChange={(e) => setComplaintTitle(e.target.value)} />
                   <Textarea placeholder="Details of the issue..." className="bg-slate-50 text-xs" value={complaintDescription} onChange={(e) => setComplaintDescription(e.target.value)} />
                   <Button variant="destructive" className="w-full font-bold" onClick={() => handleAction("complaint")} disabled={loading}>File Official Complaint</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}