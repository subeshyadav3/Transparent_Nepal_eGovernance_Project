"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  UserPlus, 
  Phone, 
  Mail, 
  FileText, 
  Star,
  HardHat
} from "lucide-react";
import Loader from "@/components/Loader";

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    companyName: "",
    registrationNo: "",
    contactPerson: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    const res = await fetch("/api/admin/contractors");
    const data = await res.json();
    setContractors(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/admin/contractors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ companyName: "", registrationNo: "", contactPerson: "", phone: "", email: "" });
      fetchContractors();
    }
    setSubmitting(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-900 rounded-lg text-white">
            <HardHat size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Vendor Management</h1>
            <p className="text-slate-500 text-xs font-medium italic">Verified Government Contractors & Service Providers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Registration Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-slate-200 sticky top-10">
              <h2 className="text-sm font-black uppercase mb-6 flex items-center gap-2 text-blue-900">
                <UserPlus size={16} /> Register New Vendor
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                  placeholder="Company Legal Name" 
                  value={form.companyName} 
                  onChange={(e) => setForm({...form, companyName: e.target.value})} 
                  required 
                />
                <Input 
                  placeholder="Business Reg No (PAN/GST)" 
                  value={form.registrationNo} 
                  onChange={(e) => setForm({...form, registrationNo: e.target.value})} 
                  required 
                />
                <Input 
                  placeholder="Primary Contact Person" 
                  value={form.contactPerson} 
                  onChange={(e) => setForm({...form, contactPerson: e.target.value})} 
                  required 
                />
                <Input 
                  placeholder="Phone Number" 
                  value={form.phone} 
                  onChange={(e) => setForm({...form, phone: e.target.value})} 
                  required 
                />
                <Input 
                  placeholder="Official Email" 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => setForm({...form, email: e.target.value})} 
                  required 
                />
                <Button 
                  disabled={submitting} 
                  className="w-full bg-blue-900 hover:bg-slate-900 text-white font-bold h-12"
                >
                  {submitting ? "Processing..." : "Onboard Contractor"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Contractors List */}
          <div className="lg:col-span-2 space-y-4">
            {contractors.map((c) => (
              <Card key={c.id} className="p-6 border-slate-200 hover:border-blue-200 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Building2 size={18} className="text-slate-400" /> {c.companyName}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Reg: {c.registrationNo}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-600">
                      <div className="flex items-center gap-2"><Phone size={14} /> {c.phone}</div>
                      <div className="flex items-center gap-2"><Mail size={14} /> {c.email}</div>
                      <div className="flex items-center gap-2"><FileText size={14} /> {c._count.projects} Projects Commissioned</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-black">{c.score?.toFixed(1) || "100"}</span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">Performance Score</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}