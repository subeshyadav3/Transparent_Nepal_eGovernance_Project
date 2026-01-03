// app/(admin)/admin/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.ts"; // <-- three dots

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return <p>Access Denied</p>;
  }

  return <div>Admin Dashboard Content</div>;
}
