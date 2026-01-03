"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
const STATUS_OPTIONS = ["PLANNED", "ONGOING", "COMPLETED"];

export default function ProjectDetailsAdmin() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({ status: "", progress: 0 });
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [newReportTitle, setNewReportTitle] = useState("");
  const [newReportSummary, setNewReportSummary] = useState("");
  const [newReportFile, setNewReportFile] = useState<File | null>(null);
  const { data: session } = useSession();
  // Load project data
  useEffect(() => {
   
console.log("Client session:", session);

    fetch(`/api/projects?id=${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setForm({
          status: data.status,
          progress: data.progress,
        });
        if ((data.rescheduleLogs?.length ?? 0) < 2) {
          setRescheduleDate(data.endDate?.split("T")[0] ?? "");
        }
      });
  }, [params.id]);

  // Save changes (status, progress, reschedule)
  const handleSave = async () => {
    const body: any = { id: project.id, ...form };
  
    if (rescheduleDate && (project.rescheduleLogs?.length ?? 0) < 2) {
      body.endDate = rescheduleDate;
    }
    await fetch(`/api/projects?id=${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // only the fields to update
        credentials: "include",
      });
  
    // Refetch the full project after save
    const res = await fetch(`/api/projects?id=${project.id}`);
    const updated = await res.json();
    setProject(updated);
    setEditing(false);
  };
  
  // Upload new project report
  const handleUploadReport = async () => {
    if (!newReportTitle) return;

    const formData = new FormData();
    formData.append("title", newReportTitle);
    formData.append("summary", newReportSummary);
    if (newReportFile) formData.append("file", newReportFile);
    formData.append("projectId", project.id);

    const res = await fetch(`/api/projects/report?id=${project.id}`, {
      method: "POST",
      body: formData,
    });

    const updatedReport = await res.json();

    setProject({
      ...project,
      projectReports: [...(project.projectReports ?? []), updatedReport],
    });

    setNewReportTitle("");
    setNewReportSummary("");
    setNewReportFile(null);
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{project.projectName}</h1>
        <Button variant="outline" onClick={() => setEditing(!editing)}>
          {editing ? "Cancel" : "Edit Project"}
        </Button>
      </div>

      {/* Project Details */}
      <Card className="p-6 space-y-4">
        {editing ? (
          <div className="space-y-4">
            {/* Status Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
                className="border p-2 rounded w-full"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Progress */}
            <div>
              <label className="block text-sm font-medium mb-1">Progress</label>
              <Input
                type="number"
                value={form.progress}
                onChange={(e) =>
                  setForm({ ...form, progress: Number(e.target.value) })
                }
              />
            </div>

            {/* Reschedule End Date */}
            {(project.rescheduleLogs?.length ?? 0) < 2 && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Reschedule End Date
                </label>
                <Input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Reschedules used: {project.rescheduleLogs?.length ?? 0}/2
                </p>
              </div>
            )}

            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p>
              <strong>Description:</strong> {project.description}
            </p>
            <p>
              <strong>Status:</strong> {project.status}
            </p>
            <p>
              <strong>Progress:</strong> {project.progress}%
            </p>
            <p>
              <strong>Total Cost:</strong> {project.totalCost}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(project.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(project.endDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Contractor:</strong> {project.contractor?.companyName}
            </p>
            <p>
              <strong>Upvotes:</strong> {project.upvotes}
            </p>
            <p>
              <strong>Downvotes:</strong> {project.downvotes}
            </p>
            <p>
              <strong>Comments:</strong> {project.comments?.length ?? 0}
            </p>
            <p>
              <strong>Complaints:</strong> {project.complaints?.length ?? 0}
            </p>
          </div>
        )}
      </Card>

      {/* Project Reports */}
      <Card className="p-6 space-y-2">
        <h2 className="text-xl font-semibold mb-2">Project Reports</h2>
        {(project.projectReports ?? []).map((r: any) => (
          <div
            key={r.id}
            className="flex justify-between items-center p-2 border-b border-border"
          >
            <span>{r.title}</span>
            <a
              href={`/uploads/${r.title}.pdf`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              View PDF
            </a>
          </div>
        ))}

        {/* Add new report */}
        {editing && (
          <div className="mt-4 space-y-2">
            <Input
              placeholder="Report Title"
              value={newReportTitle}
              onChange={(e) => setNewReportTitle(e.target.value)}
            />
            <Textarea
              placeholder="Report Summary"
              value={newReportSummary}
              onChange={(e) => setNewReportSummary(e.target.value)}
            />
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                e.target.files && setNewReportFile(e.target.files[0])
              }
            />
            <Button onClick={handleUploadReport}>Add Report</Button>
          </div>
        )}
      </Card>

      {/* Comments */}
      <Card className="p-6 space-y-2">
        <h2 className="text-xl font-semibold mb-2">
          Comments ({project.comments?.length ?? 0})
        </h2>
        {(project.comments ?? []).map((c: any) => (
          <Card key={c.id} className="p-2">
            <p>
              <strong>{c.user?.name}:</strong> {c.message}
            </p>
          </Card>
        ))}
      </Card>

      {/* Complaints */}
      <Card className="p-6 space-y-2">
        <h2 className="text-xl font-semibold mb-2">
          Complaints ({project.complaints?.length ?? 0})
        </h2>
        {(project.complaints ?? []).map((c: any) => (
          <Card key={c.id} className="p-2">
            <p>
              <strong>{c.title}</strong> by {c.user?.name} - {c.status}
            </p>
          </Card>
        ))}
      </Card>
    </div>
  );
}
