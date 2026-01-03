import { PrismaClient, ProjectStatus, ComplaintStatus, Role } from "../app/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");
  
  // Clear existing data
  // await prisma.complaint.deleteMany();
  // await prisma.project.deleteMany();
  // await prisma.budgetTransaction.deleteMany();
  // await prisma.budget.deleteMany();
  // await prisma.department.deleteMany();
  // await prisma.contractor.deleteMany();
  // await prisma.user.deleteMany();

  // --- Admin ---
  const admin = await prisma.user.create({
    data: { 
      name: "Admin User", 
      email: "admin@gmail.com", 
      password: await bcrypt.hash("admin123", 10), 
      role: Role.ADMIN, 
      kycVerified: true 
    },
  });

  // --- Citizens ---
  const citizens = [];
  for (let i = 1; i <= 20; i++) {
    citizens.push(await prisma.user.create({
      data: {
        name: `Citizen ${i}`,
        email: `citizen${i}@example.com`,
        password: await bcrypt.hash(`citizen${i}123`, 10),
        role: Role.CITIZEN,
        kycVerified: i % 2 === 0,
      },
    }));
  }

  // --- Departments ---
  const deptData = [
    { name: "Public Works", description: "Infrastructure", fiscalYear: "2082/83" },
    { name: "Health", description: "Hospitals", fiscalYear: "2082/83" },
    { name: "Education", description: "Schools", fiscalYear: "2082/83" },
    { name: "Environment", description: "Forests and Parks", fiscalYear: "2082/83" },
  ];
  const departments = [];
  for (const d of deptData) departments.push(await prisma.department.create({ data: d }));

  // --- Budgets (NPR) ---
  const budgets = [];
  for (const dept of departments) {
    budgets.push(await prisma.budget.create({
      data: {
        departmentId: dept.id,
        fiscalYear: dept.fiscalYear,
        allocatedAmount: 1_00_00_000 + Math.floor(Math.random() * 50_00_000), // NPR
        spentAmount: Math.floor(Math.random() * 50_00_000),
        remainingAmount: Math.floor(Math.random() * 50_00_000),
      },
    }));
  }

  // --- Contractors ---
  const contractorData = [
    { companyName: "Road Builders Ltd", registrationNo: "RB001", contactPerson: "Mr. Sharma", phone: "9812345670", email: "rb@builders.com", score: 4.5 },
    { companyName: "Health Solutions Pvt", registrationNo: "HS002", contactPerson: "Ms. Karki", phone: "9809876543", email: "hs@solutions.com", score: 4.2 },
    { companyName: "Edu Construct", registrationNo: "EC003", contactPerson: "Mr. Joshi", phone: "9811122233", email: "edu@construct.com", score: 4.0 },
    { companyName: "Green Parks Ltd", registrationNo: "GP004", contactPerson: "Ms. Shrestha", phone: "9809988776", email: "green@parks.com", score: 4.7 },
  ];
  const contractors = [];
  for (const c of contractorData) contractors.push(await prisma.contractor.create({ data: c }));

  // --- Projects ---
  const projectStatuses = [ProjectStatus.PLANNED, ProjectStatus.ONGOING, ProjectStatus.COMPLETED];
  const projects = [];
  for (let i = 0; i < 15; i++) {
    projects.push(await prisma.project.create({
      data: {
        budgetId: budgets[i % budgets.length].id,
        projectName: `Project ${i + 1}`,
        description: `Detailed description of project ${i + 1}`,
        contractorId: contractors[i % contractors.length].id,
        startDate: new Date(2025, i % 12, 1),
        endDate: new Date(2025, (i % 12) + 2, 28),
        status: projectStatuses[i % projectStatuses.length],
        progress: Math.floor(Math.random() * 101),
        totalCost: 5_00_00_000 + Math.floor(Math.random() * 50_00_000), // NPR
        upvotes: Math.floor(Math.random() * 300),
        downvotes: Math.floor(Math.random() * 100),
      },
    }));
  }

  // --- Budget Transactions ---
  for (const budget of budgets) {
    for (let i = 0; i < 3; i++) {
      await prisma.budgetTransaction.create({
        data: {
          budgetId: budget.id,
          projectId: projects[i % projects.length].id,
          amount: Math.floor(Math.random() * 5_00_000), // NPR
          transactionDate: new Date(2025, i, 15),
          remarks: `Transaction ${i + 1} for ${budget.departmentId}`,
        },
      });
    }
  }

  // --- Complaints ---
  const complaintStatuses = [ComplaintStatus.SUBMITTED, ComplaintStatus.UNDER_REVIEW, ComplaintStatus.VERIFIED, ComplaintStatus.RESOLVED];
  for (let i = 0; i < 10; i++) {
    await prisma.complaint.create({
      data: {
        projectId: projects[i % 7].id,
        userId: citizens[i % citizens.length].id,
        title: `Complaint ${i + 1}`,
        description: `Details of complaint ${i + 1}`,
        status: complaintStatuses[i % complaintStatuses.length],
      },
    });
  }

  console.log("Database seeded successfully with NPR amounts!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
