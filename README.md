# OpenBudget Nepal 🇳🇵

**OpenBudget Nepal** is a transparent e-governance platform developed for the **Digital Nepal Framework Initiative**. It serves as a central hub for tracking federal budgets, provincial spending, and national infrastructure projects, ensuring accountability through the Open Data Initiative.



## 🏗️ Project Vision
Our goal is to ensure a prosperous Nepal through digital transparency. Every taxpayer has the right to know where their money is being spent—from National Pride Projects to local community park renovations.

## 🚀 Core Features

### 🏛️ Admin & Public Official Portal
* **Budget Entry:** Simplified tools for departmental budget allocation.
* **KYC Verification:** Secure queue for reviewing and approving citizen identity documents.
* **Project Management:** Real-time progress updates for infrastructure projects.
* **Contractor Tracking:** Performance scoring and registration management for vendors.

### 👥 Citizen Portal
* **Live Budget Tracking:** Real-time data across all 7 Provinces and 753 Local Levels.
* **Public Grievance:** Integrated complaint system (Hello Sarkar style) with status tracking.
* **Project Analytics:** Data-driven insights into spending patterns and fiscal efficiency.
* **Verified Profile:** Secure KYC-backed accounts for official interactions.

## 🛠️ Technical Stack

* **Frontend:** Next.js (App Router)
* **Backend:** Prisma ORM & Next.js API Routes
* **Database:** PostgreSQL (Neon Serverless)
* **Authentication:** NextAuth.js
* **UI/UX:** Tailwind CSS, Shadcn/UI, Lucide Icons



## 📋 Installation & Setup

### 1. Clone & Install
```bash
git clone [https://github.com/your-username/e-governance.git](https://github.com/your-username/e-governance.git)
cd e-governance
npm install

# Generate the Prisma Client
npx prisma generate

# Apply migrations to update your Database schema
npx prisma migrate dev --name init

# Push seed data (Departments, Projects, Admin Users)
npx prisma db seed

Run:
npm run dev


