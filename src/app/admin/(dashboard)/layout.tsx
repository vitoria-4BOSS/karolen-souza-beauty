import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/admin/login")

  return (
    <div className="flex min-h-screen">
      <AdminSidebar adminName={session.user.name ?? session.user.email ?? "Admin"} />
      <main className="bg-secondary/20 flex-1 overflow-x-hidden p-6 sm:p-8">
        {children}
      </main>
    </div>
  )
}
