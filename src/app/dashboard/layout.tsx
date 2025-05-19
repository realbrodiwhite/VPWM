
import { AppSidebarLayout, type NavItem } from "@/components/layout/AppSidebar";
import { LayoutDashboard, CalendarDays, CreditCard, ShoppingBag, UserCircle } from "lucide-react";

const customerNavItems: NavItem[] = [
  { href: "/account", label: "Overview", icon: <LayoutDashboard className="w-5 h-5" />, matchExact: true },
  { href: "/account/services", label: "My Services", icon: <ShoppingBag className="w-5 h-5" /> },
  { href: "/account/book", label: "Book Service", icon: <CalendarDays className="w-5 h-5" /> },
  { href: "/account/billing", label: "Billing", icon: <CreditCard className="w-5 h-5" /> },
  { href: "/account/profile", label: "Profile", icon: <UserCircle className="w-5 h-5" /> },
];

const mockUser = {
  name: "Jane Doe",
  email: "customer@example.com",
  avatarUrl: "https://placehold.co/100x100.png?text=JD"
};

export default function CustomerAccountLayout({ // Renamed component
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
