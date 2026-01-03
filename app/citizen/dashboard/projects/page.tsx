"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProjectsCitizen() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects/citizen")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-slate-50 min-h-screen">
      <header className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900">Public Projects</h1>
        <p className="text-slate-600">Monitor ongoing government initiatives and community developments.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/citizen/dashboard/projects/${p.id}`}
            className="group bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 overflow-hidden flex flex-col"
          >
            {/* Project Header */}
            <div className="p-5 border-b border-slate-50 bg-white">
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  p.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-800'
                }`}>
                  {p.status}
                </span>
                <span className="text-sm font-bold text-slate-900">NPR {p.totalCost.toLocaleString()}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                {p.projectName}
              </h2>
            </div>

            {/* Project Body */}
            <div className="p-5 flex-grow">
              <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                {p.description}
              </p>
              
              {/* Progress Bar */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Progress</span>
                  <span>{p.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-blue-700 h-2 rounded-full transition-all" 
                    style={{ width: `${p.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 text-xs text-slate-500">
                <div>
                  <p className="font-semibold text-slate-400 uppercase tracking-wider">Start Date</p>
                  <p className="text-slate-700">{new Date(p.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-400 uppercase tracking-wider">Contractor</p>
                  <p className="text-slate-700 truncate">{p.contractor?.companyName || 'TBD'}</p>
                </div>
              </div>
            </div>

            {/* Project Footer (Engagement) */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-sm">
              <div className="flex space-x-4">
                <span className="flex items-center text-slate-600">
                  <span className="mr-1">👍</span> {p.upvotes}
                </span>
                <span className="flex items-center text-slate-600">
                  <span className="mr-1">💬</span> {p.commentsCount}
                </span>
              </div>
              <span className="text-blue-700 font-semibold group-hover:underline">View Details →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}