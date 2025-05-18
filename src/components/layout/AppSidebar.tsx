
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dog, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarProvider,
  SidebarInset
} from "@/components/ui/sidebar"; // Assuming this is the custom sidebar from shadcn
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  matchExact?: boolean;
}

interface AppSidebarProps {
  navItems: NavItem[];
  user: { name: string; email: string; avatarUrl?: string };
  children: React.ReactNode;
  dashboardType: "Customer" | "Admin";
}

export function AppSidebarLayout({ navItems, user, children, dashboardType }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    // Mock logout
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push("/login");
  };

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="p-4">
          <Link href={dashboardType === "Admin" ? "/admin" : "/dashboard"} className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Dog className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl text-primary group-data-[collapsible=icon]:hidden">
              Valley Pet
            </span>
          </Link>
        </SidebarHeader>
        <Separator className="mb-2 group-data-[collapsible=icon]:hidden" />
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={item.matchExact ? pathname === item.href : pathname.startsWith(item.href)}
                  tooltip={{ children: item.label, className: "group-data-[collapsible=icon]:block hidden" }}
                  className="justify-start"
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <Separator className="mt-auto group-data-[collapsible=icon]:hidden" />
        <SidebarFooter className="p-4 space-y-2">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatarUrl || "https://placehold.co/100x100.png"} alt={user.name} data-ai-hint="person portrait" />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="font-semibold text-sm text-sidebar-foreground">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/70">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent group-data-[collapsible=icon]:justify-center" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4 group-data-[collapsible=icon]:mr-0" />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
            <div className="md:hidden">
                 <SidebarTrigger />
            </div>
            <h1 className="text-xl font-semibold text-primary">{dashboardType} Dashboard</h1>
            {/* You can add more header elements here, like a search bar or notifications */}
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
