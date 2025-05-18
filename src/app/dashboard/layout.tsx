
import { AppSidebarLayout, type NavItem } from "@/components/layout/AppSidebar";
import { LayoutDashboard, CalendarDays, CreditCard, ShoppingBag, UserCircle } from "lucide-react";

const customerNavItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, matchExact: true },
  { href: "/dashboard/services", label: "My Services", icon: <ShoppingBag className="w-5 h-5" /> },
  { href: "/dashboard/book", label: "Book Service", icon: <CalendarDays className="w-5 h-5" /> },
  { href: "/dashboard/billing", label: "Billing", icon: <CreditCard className="w-5 h-5" /> },
  { href: "/dashboard/profile", label: "Profile", icon: <UserCircle className="w-5 h-5" /> },
];

const mockUser = {
  name: "Jane Doe",
  email: "customer@example.com",
  avatarUrl: "https://placehold.co/100x100.png?text=JD"
};

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppSidebarLayout navItems={customerNavItems} user={mockUser} dashboardType="Customer">
      {children}
    </AppSidebarLayout>
  );
}
