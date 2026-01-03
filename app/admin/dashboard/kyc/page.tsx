"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";

export default function AdminKYCPage() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await fetch("/api/admin/kyc");
      const data = await res.json();
      setPendingUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch KYC queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleVerify = async (userId: string, approve: boolean) => {
    await fetch("/api/admin/kyc", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, approve }),
    });
    fetchPending();
  };

  if (loading) return <div className="p-10 text-slate-500 font-medium">Loading submissions...</div>;

  return (
    <div className="p-10 max-w-full">
      <header className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">
          KYC Verification
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Review and process pending citizen identity documents.
        </p>
      </header>

      <div className="flex flex-col gap-4 max-w-5xl">
        {pendingUsers.length === 0 ? (
          <Card className="p-12 text-left border-dashed bg-slate-50/50 text-slate-400">
            <p className="font-medium text-sm">No pending verification requests found.</p>
          </Card>
        ) : (
          pendingUsers.map((user) => (
            <Card 
              key={user.id} 
              className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between border-slate-200 hover:border-sky-300 transition-all shadow-sm gap-6"
            >
              <div className="flex gap-8 items-center">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-slate-900 text-lg">{user.name}</h3>
                  <p className="text-xs text-slate-500 font-medium lowercase tracking-wide">
                    {user.email}
                  </p>
                </div>

                <div className="hidden md:block h-10 w-px bg-slate-200" />

                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Citizenship No.
                  </p>
                  <p className="text-sm font-mono font-bold text-sky-900">
                    {user.citizenshipNumber || "MISSING"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open(user.idPhotoUrl, '_blank')}
                  className="text-xs font-bold border-slate-300 hover:bg-slate-50"
                >
                  <Eye size={14} className="mr-2" /> View Document
                </Button>
                
                <Button 
                  onClick={() => handleVerify(user.id, true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-5 font-bold"
                >
                  <Check size={16} className="mr-2" /> Approve
                </Button>
                
                <Button 
                  onClick={() => handleVerify(user.id, false)}
                  variant="ghost" 
                  className="h-9 px-4 text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold"
                >
                  <X size={16} className="mr-2" /> Reject
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}