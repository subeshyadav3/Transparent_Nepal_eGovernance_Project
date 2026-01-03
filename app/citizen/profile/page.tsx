"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  ShieldCheck, 
  ShieldAlert, 
  MessageSquare, 
  AlertCircle,
  FileText
} from "lucide-react";
import Loader from "@/components/Loader";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [kycForm, setKycForm] = useState({ citizenshipNumber: "", idPhotoUrl: "" });

  useEffect(() => {
    fetch("/api/profile").then(res => res.json()).then(data => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(kycForm),
    });
    if (res.ok) alert("Documents submitted. Admin will review your profile.");
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-sky-900 rounded-full flex items-center justify-center text-white text-2xl font-black">
            {profile.name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{profile.name}</h1>
            <p className="text-slate-500 font-medium text-sm">{profile.email}</p>
          </div>
        </div>
        <Badge className={profile.kycVerified ? "bg-emerald-500" : "bg-amber-500"}>
          {profile.kycVerified ? <ShieldCheck size={14} className="mr-1"/> : <ShieldAlert size={14} className="mr-1"/>}
          {profile.kycVerified ? "KYC Verified" : "KYC Pending"}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* KYC Verification Form */}
        {!profile.kycVerified && (
          <Card className="p-6 border-slate-200 h-fit">
            <h2 className="text-xs font-black uppercase text-slate-400 mb-4">Complete Verification</h2>
            <form onSubmit={handleKycSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">Citizenship Number</label>
                <Input 
                  placeholder="e.g. 12-34-56-789" 
                  value={kycForm.citizenshipNumber}
                  onChange={e => setKycForm({...kycForm, citizenshipNumber: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500">ID Photo URL</label>
                <Input 
                  placeholder="https://image-link.com/photo.jpg" 
                  value={kycForm.idPhotoUrl}
                  onChange={e => setKycForm({...kycForm, idPhotoUrl: e.target.value})}
                  required 
                />
              </div>
              <Button className="w-full bg-sky-900 text-white font-bold h-11 uppercase text-xs tracking-widest">
                Submit for Review
              </Button>
            </form>
          </Card>
        )}

        {/* User Activity Lists */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaints Section */}
          <section className="space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 flex items-center gap-2">
              <AlertCircle size={14} /> My Reported Grievances ({profile.complaints.length})
            </h2>
            {profile.complaints.map((c: any) => (
              <Card key={c.id} className="p-4 border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-sky-600 uppercase">{c.project.projectName}</p>
                    <h3 className="font-bold text-slate-800">{c.title}</h3>
                  </div>
                  <Badge variant="outline" className="text-[9px] uppercase font-black">{c.status}</Badge>
                </div>
              </Card>
            ))}
          </section>

          {/* Comments Section */}
          <section className="space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 flex items-center gap-2">
              <MessageSquare size={14} /> Project Discussion ({profile.comments.length})
            </h2>
            {profile.comments.map((cmt: any) => (
              <Card key={cmt.id} className="p-4 border-slate-200 shadow-sm bg-slate-50/30">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">On: {cmt.project.projectName}</p>
                <p className="text-sm text-slate-700 italic">"{cmt.message}"</p>
                <p className="text-[9px] text-slate-400 mt-2">{new Date(cmt.createdAt).toLocaleDateString()}</p>
              </Card>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}