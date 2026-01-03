"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Briefcase, 
  Calendar, 
  IndianRupee, 
  ArrowLeft,
  Building2,
  Search,
  UserPlus,
  ShieldCheck
} from "lucide-react";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

export default function CreateProjectPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [loading, setLoading] = useState(false);
  const [contractors, setContractors] = useState<any[]>([]);
  const [isNewContractor, setIsNewContractor] = useState(false);

  const [form, setForm] = useState({
    projectName: "",
    description: "",
    budgetId: "",
    totalCost: "",
    startDate: "",
    endDate: "",
    contractorId: "", 
  });

  const [newContractor, setNewContractor] = useState({
    companyName: "",
    registrationNo: "",
    contactPerson: "",
    phone: "",
    email: "",
  });

  // Inside your CreateProjectPage component
useEffect(() => {
    const fetchContractors = async () => {
      try {
        const res = await fetch("/api/admin/contractors");
        if (res.ok) {
          const data = await res.json();
          setContractors(data);
        }
      } catch (err) {
        console.error("Failed to load contractor list", err);
      }
    };
  
    fetchContractors();
  }, []);
  
  useEffect(() => {
    fetch("/api/admin/projects") // Assuming your GET route returns all projects/contractors
      .then((res) => res.json())
      .then((data) => {
        // Extract unique contractors from the project list or a separate endpoint
        const uniqueContractors = data.map((p: any) => p.contractor).filter(Boolean);
        const seen = new Set();
        const filtered = uniqueContractors.filter((el: any) => {
          const duplicate = seen.has(el.id);
          seen.add(el.id);
          return !duplicate;
        });
        setContractors(filtered);
      })
      .catch(err => console.error("Error fetching contractors", err));
  }, []);

  if (status === "loading") return <Loader />;
  if (session?.user?.role !== "ADMIN") router.push("/");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      ...form,
      totalCost: parseFloat(form.totalCost),
      newContractor: isNewContractor ? newContractor : null,
      contractorId: isNewContractor ? null : form.contractorId,
    };

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/dashboard/projects");
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2 font-bold text-xs uppercase text-slate-500">
            <ArrowLeft size={16} /> Back to Records
          </Button>
          <div className="text-right">
            <span className="text-[10px] font-black text-blue-900 bg-blue-50 px-2 py-1 rounded uppercase tracking-tighter">Administrative Console</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Commission New Project</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 border-slate-200 shadow-sm space-y-8">
              <div className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <Briefcase size={14} className="text-blue-900" /> Project Definition
                </h2>
                <Input
                  placeholder="Official Project Title"
                  required
                  className="text-lg font-bold h-12 border-slate-200 focus:ring-blue-900"
                  value={form.projectName}
                  onChange={(e) => setForm({...form, projectName: e.target.value})}
                />
                <Textarea
                  placeholder="Executive summary and technical scope..."
                  className="min-h-[120px] bg-slate-50/30 border-slate-200"
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Budget Reference (ID)</label>
                  <Input 
                    placeholder="Enter Budget UUID" 
                    required 
                    className="font-mono text-xs"
                    value={form.budgetId}
                    onChange={(e) => setForm({...form, budgetId: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Total Allocation (INR)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 text-slate-400" size={14} />
                    <Input 
                      type="number" 
                      step="0.01"
                      className="pl-8 font-bold border-slate-200" 
                      placeholder="0.00" 
                      required 
                      value={form.totalCost}
                      onChange={(e) => setForm({...form, totalCost: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                    <Calendar size={12} /> Expected Commencement
                  </label>
                  <Input type="date" required value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2">
                    <Calendar size={12} /> Statutory Deadline
                  </label>
                  <Input type="date" required value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} />
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className={`p-6 border-2 transition-all duration-300 ${isNewContractor ? 'border-blue-900 bg-blue-50/20' : 'border-slate-200 bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Building2 size={14} /> Execution Partner
                </h3>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm" 
                  className={`text-[9px] font-black uppercase h-7 px-3 ${isNewContractor ? 'bg-blue-900 text-white hover:bg-blue-800' : 'text-blue-900 border-blue-200'}`}
                  onClick={() => setIsNewContractor(!isNewContractor)}
                >
                  {isNewContractor ? "Use Existing" : "Add New +"}
                </Button>
              </div>

              {!isNewContractor ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-slate-400" size={14} />
                    <select
                      required={!isNewContractor}
                      className="w-full h-10 pl-9 pr-3 rounded-md border border-slate-200 text-sm focus:ring-2 focus:ring-blue-900 appearance-none bg-white font-medium"
                      value={form.contractorId}
                      onChange={(e) => setForm({...form, contractorId: e.target.value})}
                    >
                      <option value="">Select Registered Vendor</option>
                      {contractors.map((c) => (
                        <option key={c.id} value={c.id}>{c.companyName}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-tight">Linking an existing contractor ensures historical performance tracking.</p>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-2 mb-2 text-blue-900">
                    <UserPlus size={16} />
                    <span className="text-[10px] font-black uppercase">Vendor Registration</span>
                  </div>
                  <Input 
                    placeholder="Company Legal Name" 
                    required={isNewContractor} 
                    value={newContractor.companyName}
                    onChange={(e) => setNewContractor({...newContractor, companyName: e.target.value})}
                  />
                  <Input 
                    placeholder="Trade License / Reg No." 
                    required={isNewContractor} 
                    value={newContractor.registrationNo}
                    onChange={(e) => setNewContractor({...newContractor, registrationNo: e.target.value})}
                  />
                  <Input 
                    placeholder="Authorised Signatory" 
                    required={isNewContractor} 
                    value={newContractor.contactPerson}
                    onChange={(e) => setNewContractor({...newContractor, contactPerson: e.target.value})}
                  />
                  <Input 
                    placeholder="Contact Phone" 
                    required={isNewContractor} 
                    value={newContractor.phone}
                    onChange={(e) => setNewContractor({...newContractor, phone: e.target.value})}
                  />
                  <Input 
                    placeholder="Official Correspondence Email" 
                    type="email" 
                    required={isNewContractor} 
                    value={newContractor.email}
                    onChange={(e) => setNewContractor({...newContractor, email: e.target.value})}
                  />
                </div>
              )}
            </Card>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-900 hover:bg-slate-900 text-white font-black uppercase text-xs tracking-widest h-14 transition-all"
            >
              {loading ? "Validating Credentials..." : "Finalize Deployment"}
            </Button>

            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
              <div className="flex gap-3">
                <ShieldCheck size={18} className="text-slate-400 shrink-0" />
                <p className="text-[9px] text-slate-500 leading-normal">
                  By clicking deploy, you confirm that this project adheres to the current fiscal year's guidelines and that the contractor has been vetted for compliance.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}