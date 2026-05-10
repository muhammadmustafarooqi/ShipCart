import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/admin-login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fa", overflow: "hidden" }}>
      <AdminSidebar />
      <div className="admin-content" style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}
