"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye, ShieldAlert } from "lucide-react";

export default function AdminKYCPage() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    // This endpoint should filter: { role: 'CITIZEN', kycVerified: false }
    const res = await fetch("/api/admin/kyc");
    const data = await res.json();
    setPendingUsers(data);
    setLoading(false);
  };

  useEffect(() => { fetchPending(); }, []);

  const handleVerify = async (userId: string, approve: boolean) => {
    await fetch("/api/admin/kyc", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, approve }),
    });
    fetchPending();
  };

  if (loading) return <div className="p-10 text-center">Loading submissions...</div>;

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tight">KYC Verification Queue</h1>
        <p className="text-slate-500 text-sm">Review citizenship documents for account verification.</p>
      </div>

      <div className="grid gap-4">
        {pendingUsers.length === 0 ? (
          <Card className="p-10 text-center border-dashed text-slate-400">
            No pending KYC requests.
          </Card>
        ) : (
          pendingUsers.map((user) => (
            <Card key={user.id} className="p-6 flex items-center justify-between border-slate-200">
              <div className="flex gap-6 items-center">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900">{user.name}</h3>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <div className="h-10 w-px bg-slate-100" />
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">Citizenship No.</p>
                  <p className="text-sm font-mono font-bold">{user.citizenshipNumber || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open(user.idPhotoUrl, '_blank')}
                  className="text-xs font-bold"
                >
                  <Eye size={14} className="mr-2" /> View ID
                </Button>
                <Button 
                  onClick={() => handleVerify(user.id, true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-4"
                >
                  <Check size={16} className="mr-2" /> Approve
                </Button>
                <Button 
                  onClick={() => handleVerify(user.id, false)}
                  variant="destructive" 
                  className="h-9 px-4"
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