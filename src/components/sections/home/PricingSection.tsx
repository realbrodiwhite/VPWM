
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sun, Home, Zap, Gem } from "lucide-react";
import Link from "next/link";

const pricingPlans = [
  {
    name: "Outdoor Oasis Weekly",
    price: "$50",
    frequency: "month",
    description: "Weekly outdoor cleanup for 1 dog. Enjoy a pristine yard all month long.",
    features: ["1 Dog Included", "Weekly Outdoor Visits (4-5/month)", "Thorough Scooping & Waste Haul-Away", "Eco-Friendly Disposal", "Yard Deodorizing (add $10/mo)"],
    popular: false,
    cta: "Choose Outdoor Oasis",
    icon: <Sun className="w-12 h-12 text-accent-foreground" />
  },
  {
    name: "Total Pet Pamper Weekly",
    price: "$80",
    frequency: "month",
    description: "The all-in-one weekly solution for 1-2 pets, covering both indoor and outdoor needs.",
    features: ["1-2 Pets (Dogs/Cats)", "Weekly Outdoor Cleanup", "Weekly Indoor Cleanup (up to 2 litter boxes)", "Complimentary Yard OR Litter Deodorizing", "Eco-Friendly Disposal", "Priority Scheduling"],
    popular: true,
    cta: "Choose Total Pamper",
    icon: <Zap className="w-12 h-12 text-primary" />
  },
  {
    name: "Indoor Fresh Weekly",
    price: "$40",
    frequency: "month",
    description: "Weekly indoor litter box care. Keep your home smelling fresh.",
    features: ["Up to 2 Litter Boxes", "Weekly Scooping & Litter Refresh", "Odor Neutralization Treatment", "Waste Disposal", "Safe for Pets & Family"],
    popular: false,
    cta: "Choose Indoor Fresh",
    icon: <Home className="w-12 h-12 text-accent-foreground" />
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-accent">
      <div className="container">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Gem className="w-12 h-12 text-accent-foreground" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-lg text-accent-foreground/80 max-w-2xl mx-auto">
            No hidden fees, just straightforward plans to fit your indoor, outdoor, or combined pet waste needs.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground ${
                plan.popular ? "border-2 border-primary ring-2 ring-primary/50 relative" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                  Most Popular
                </div>
              )}
              <CardHeader className="pt-8">
                <div className="flex justify-center mb-4">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl text-center text-primary">{plan.name}</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.frequency}</span>
                </div>
                <CardDescription className="text-center h-12 text-card-foreground/80">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span className="text-card-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                 <Button
                  asChild
                  className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
                ><Link href="/login">{plan.cta}</Link></Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <p className="text-center mt-12 text-accent-foreground/80">
          Need a custom package, bi-weekly, or one-time cleanup? <Link href="/#contact-form" className="text-accent-foreground hover:underline font-semibold">Contact us</Link> for a personalized quote.
        </p>
      </div>
    </section>
  );
}
