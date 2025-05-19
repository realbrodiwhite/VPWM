
"use client";
import { AppSidebarLayout, type NavItem } from "@/components/layout/AppSidebar";
import { LayoutDashboard, CalendarCheck, UserCircle } from "lucide-react";

const employeeNavItems: NavItem[] = [
  { href: "/employee", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, matchExact: true },
  { href: "/employee/schedule", label: "My Schedule", icon: <CalendarCheck className="w-5 h-5" /> },
  { href: "/employee/profile", label: "My Profile", icon: <UserCircle className="w-5 h-5" /> },
];

const mockEmployeeUser = {
  name: "John Smith (Technician)",
  email: "employee@example.com",
  avatarUrl: "https://placehold.co/100x100.png?text=JS"
};

export default function EmployeeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppSidebarLayout navItems={employeeNavItems} user={mockEmployeeUser} dashboardType="Employee">
      {children}
    </AppSidebarLayout>
  );
}
