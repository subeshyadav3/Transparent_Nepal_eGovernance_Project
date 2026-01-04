"use server"

import prisma from "@/lib/prisma" 

export async function getRealAnalytics() {
  // 1. Fetch Budget Stats
  const budgets = await prisma.budget.findMany({
    include: { department: true }
  });

  const totalAllocated = budgets.reduce((acc, curr) => acc + Number(curr.allocatedAmount), 0);
  const totalSpent = budgets.reduce((acc, curr) => acc + Number(curr.spentAmount), 0);

  // 2. Department Distribution
  const departmentBudgets = budgets.map(b => ({
    name: b.department.name,
    amount: Number(b.allocatedAmount),
    percentage: totalAllocated > 0 ? Math.round((Number(b.allocatedAmount) / totalAllocated) * 100) : 0
  }));

  // 3. Project Metrics
  const projects = await prisma.project.findMany();
  const projectMetrics = {
    total: projects.length,
    completed: projects.filter(p => p.status === "COMPLETED").length,
    ongoing: projects.filter(p => p.status === "ONGOING").length,
    planned: projects.filter(p => p.status === "PLANNED").length,
  };

  // 4. Complaint Metrics
  const complaints = await prisma.complaint.findMany();
  const complaintMetrics = {
    total: complaints.length,
    resolved: complaints.filter(c => c.status === "RESOLVED").length,
    open: complaints.filter(c => c.status !== "RESOLVED").length,
  };

  return {
    totalAllocated,
    totalSpent,
    departmentBudgets,
    projectMetrics,
    complaintMetrics,
  };
}