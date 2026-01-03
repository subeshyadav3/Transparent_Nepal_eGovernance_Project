import {
  PrismaClient,
  ProjectStatus,
  ComplaintStatus,
  Role,
} from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@gmail.com",
      password: await bcrypt.hash("admin123", 10),
      role: Role.ADMIN,
      kycVerified: true,
      citizenshipNumber: "ADMIN-001",
      idPhotoUrl: "https://example.com/admin.jpg",
    },
  });

  const citizen1 = await prisma.user.create({
    data: {
      name: "Ram Sharma",
      email: "ram@gmail.com",
      password: await bcrypt.hash("ram123", 10),
      role: Role.CITIZEN,
      kycVerified: true,
      citizenshipNumber: "CTZ-101-RAM",
      idPhotoUrl: "https://example.com/ram.jpg",
    },
  });

  const citizen2 = await prisma.user.create({
    data: {
      name: "Sita Karki",
      email: "sita@gmail.com",
      password: await bcrypt.hash("sita123", 10),
      role: Role.CITIZEN,
      kycVerified: false,
      citizenshipNumber: "CTZ-202-SITA",
      idPhotoUrl: "https://example.com/sita.jpg",
    },
  });

  const deptData = [
    { name: "Public Works", description: "Infrastructure", fiscalYear: "2082/83" },
    { name: "Health", description: "Hospitals", fiscalYear: "2082/83" },
    { name: "Education", description: "Schools", fiscalYear: "2082/83" },
    { name: "Environment", description: "Forests and Parks", fiscalYear: "2082/83" },
  ];

  const departments = [];
  for (const d of deptData) {
    departments.push(await prisma.department.create({ data: d }));
  }

  const budgets = [];
  for (const dept of departments) {
    budgets.push(
      await prisma.budget.create({
        data: {
          departmentId: dept.id,
          fiscalYear: dept.fiscalYear,
          allocatedAmount: 100_000_000 + Math.floor(Math.random() * 50_000_000),
          spentAmount: Math.floor(Math.random() * 50_000_000),
          remainingAmount: Math.floor(Math.random() * 50_000_000),
        },
      })
    );
  }

  const contractor1 = await prisma.contractor.create({
    data: {
      companyName: "Himalayan Infrastructure Pvt. Ltd.",
      registrationNo: "HIPL-2075",
      contactPerson: "Bikram Thapa",
      phone: "9841122334",
      email: "info@himalayaninfra.com",
      score: 4.6,
    },
  });

  const contractor2 = await prisma.contractor.create({
    data: {
      companyName: "Green Valley Builders",
      registrationNo: "GVB-2078",
      contactPerson: "Anita Shrestha",
      phone: "9803344556",
      email: "contact@greenvalley.com",
      score: 4.3,
    },
  });

  const project1 = await prisma.project.create({
    data: {
      budgetId: budgets[0].id,
      projectName: "Kathmandu Ring Road Expansion",
      description: "Widening of ring road to reduce traffic congestion",
      contractorId: contractor1.id,
      startDate: new Date("2024-01-15"),
      endDate: new Date("2025-12-30"),
      status: ProjectStatus.ONGOING,
      progress: 55,
      totalCost: 80_000_000,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      budgetId: budgets[0].id,
      projectName: "Bagmati River Bridge Construction",
      description: "New four-lane bridge over Bagmati River",
      contractorId: contractor1.id,
      startDate: new Date("2023-06-01"),
      endDate: new Date("2024-10-20"),
      status: ProjectStatus.COMPLETED,
      progress: 100,
      totalCost: 45_000_000,
      upvotes: 32,
      downvotes: 5,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      budgetId: budgets[1].id,
      projectName: "Hospital Renovation Project",
      description: "Upgrading hospital facilities and equipment",
      contractorId: contractor2.id,
      startDate: new Date("2024-03-01"),
      endDate: new Date("2025-08-30"),
      status: ProjectStatus.ONGOING,
      progress: 40,
      totalCost: 30_000_000,
    },
  });

  const project4 = await prisma.project.create({
    data: {
      budgetId: budgets[2].id,
      projectName: "School Building Construction",
      description: "Construction of new school building in rural area",
      contractorId: contractor2.id,
      startDate: new Date("2024-05-10"),
      endDate: new Date("2024-12-15"),
      status: ProjectStatus.PLANNED,
      progress: 0,
      totalCost: 15_000_000,
    },
  });

  const project5 = await prisma.project.create({
    data: {
      budgetId: budgets[3].id,
      projectName: "Community Park Renovation",
      description: "Renovation of public park with green spaces",
      contractorId: contractor2.id,
      startDate: new Date("2023-02-01"),
      endDate: new Date("2023-11-30"),
      status: ProjectStatus.COMPLETED,
      progress: 100,
      totalCost: 10_000_000,
      upvotes: 48,
      downvotes: 2,
    },
  });

  await prisma.projectReport.create({
    data: {
      projectId: project1.id,
      title: "Q2 Progress Report",
      summary: "Road widening completed up to Kalanki section",
    },
  });

  await prisma.rescheduleLog.create({
    data: {
      projectId: project1.id,
      oldDate: new Date("2025-09-30"),
      newDate: new Date("2025-12-30"),
      reason: "Monsoon delay",
    },
  });

  await prisma.complaint.create({
    data: {
      projectId: project2.id,
      userId: citizen1.id,
      title: "Cracks on bridge surface",
      description: "Small cracks noticed near the footpath area",
      status: ComplaintStatus.UNDER_REVIEW,
    },
  });

  await prisma.complaint.create({
    data: {
      projectId: project5.id,
      userId: citizen2.id,
      title: "Poor quality benches",
      description: "Wooden benches damaged after few months",
      status: ComplaintStatus.SUBMITTED,
    },
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });