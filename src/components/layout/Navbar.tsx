
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Dog, Calculator } from "lucide-react"; // Added Calculator
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#pricing", label: "Pricing Plans" },
  { href: "/get-quote", label: "Get Quote", icon: <Calculator className="w-4 h-4 md:mr-1" /> },
  { href: "/#contact", label: "Contact Us" },
];

export default function Navbar() {
  const pathname = usePathname();

  const NavLinksContent = ({isMobile}: {isMobile?: boolean}) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary flex items-center",
            pathname === link.href || (link.href.includes("#") && pathname === "/" && link.href !== "/get-quote")
              ? "text-primary"
              : "text-muted-foreground",
            isMobile && "block py-2 text-lg" 
          )}
        >
          {isMobile && link.icon ? <span className="mr-2">{link.icon}</span> : link.icon && !isMobile ? link.icon : null}
          {link.label}
        </Link>
      ))}
    </>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Dog className="h-7 w-7 text-primary" />
          <span className="font-bold text-lg text-primary">Pet Waste Management</span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6">
          <NavLinksContent />
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/login">Customer Login</Link>
          </Button>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="grid gap-4 py-6">
                  <Link href="/" className="flex items-center gap-2 mb-4">
                     <Dog className="h-7 w-7 text-primary" />
                    <span className="font-bold text-lg text-primary">Pet Waste Management</span>
                  </Link>
                  <NavLinksContent isMobile={true} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

