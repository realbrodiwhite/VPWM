
import { AppSidebarLayout, type NavItem } from "@/components/layout/AppSidebar";
import { LayoutDashboard, Users, CalendarDays, CreditCard, Route, Settings } from "lucide-react";

const adminNavItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, matchExact: true },
  { href: "/admin/customers", label: "Customers", icon: <Users className="w-5 h-5" /> },
  { href: "/admin/schedules", label: "Schedules", icon: <CalendarDays className="w-5 h-5" /> },
  { href: "/admin/payments", label: "Payments", icon: <CreditCard className="w-5 h-5" /> },
  { href: "/admin/smart-routes", label: "Smart Routes", icon: <Route className="w-5 h-5" /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

const mockAdminUser = {
  name: "Admin User",
  email: "admin@example.com",
  avatarUrl: "https://placehold.co/100x100.png?text=AU"
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppSidebarLayout navItems={adminNavItems} user={mockAdminUser} dashboardType="Admin">
      {children}
    </AppSidebarLayout>
  );
}
