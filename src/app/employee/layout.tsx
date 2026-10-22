import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SidebarLayout } from "@/components/layout/sidebar-layout";

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <SidebarLayout
      role={user.role}
      userName={user.fullName}
      userEmail={user.email}
      userDesignation={user.designation}
    >
      {children}
    </SidebarLayout>
  );
}
