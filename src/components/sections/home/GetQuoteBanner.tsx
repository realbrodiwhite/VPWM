
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import Link from "next/link";

export default function GetQuoteBanner() {
  return (
    <section id="get-quote-banner" className="py-12 md:py-16 bg-accent">
      <div className="container text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-6">
            Ready to See Your Personalized Price?
          </h2>
          <p className="text-lg text-accent-foreground/80 mb-8">
            Our transparent points system makes it easy to understand your service costs. Click below to use our instant quote calculator!
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md text-lg px-8 py-6"
          >
            <Link href="/get-quote">
              <Calculator className="mr-2 h-6 w-6" />
              Get Your Instant Quote
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
