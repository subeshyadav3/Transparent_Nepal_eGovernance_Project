"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "@/components/Loader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/dashboard/projects/create">
          <Button>+ Add Project</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Card key={p.id} className="p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{p.projectName}</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Contractor: {p.contractor.companyName}
            </p>
            <p className="text-sm mb-2">Status: {p.status}</p>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${p.progress}%` }}
              ></div>
            </div>
            <p className="text-sm font-medium mb-2">Progress: {p.progress}%</p>
            <Link href={`/admin/dashboard/projects/${p.id}`}>
              <Button variant="outline" size="sm">View / Edit</Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
