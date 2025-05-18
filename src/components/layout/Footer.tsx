
import Link from "next/link";
import { Dog } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background/80">
      <div className="container py-8 text-center text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
                <Dog className="h-6 w-6 text-primary" />
                <span className="font-semibold text-primary">Pet Waste Management</span>
            </div>
            <p>&copy; {new Date().getFullYear()} Pet Waste Management. All rights reserved.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
                <Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
                <Link href="/terms-of-service" className="hover:text-primary">Terms of Service</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
