
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Dog, Zap } from "lucide-react";
import Link from "next/link";

const pricingPlans = [
  {
    name: "Basic Pup",
    price: "$45",
    frequency: "month",
    description: "1 dog, weekly visits. Keep your yard consistently clean.",
    features: ["1 Dog", "Weekly Visits (4-5/month)", "Eco-Friendly Disposal", "Satisfaction Guaranteed"],
    popular: false,
    cta: "Choose Basic Pup",
  },
  {
    name: "Popular Pooch",
    price: "$65",
    frequency: "month",
    description: "Up to 2 dogs, weekly visits. Our most chosen plan!",
    features: ["Up to 2 Dogs", "Weekly Visits (4-5/month)", "Deodorizing Spray (Optional Add-on)", "Eco-Friendly Disposal", "Priority Scheduling", "Satisfaction Guaranteed"],
    popular: true,
    cta: "Choose Popular Pooch",
  },
  {
    name: "Multi-Dog Manor",
    price: "$85",
    frequency: "month",
    description: "3+ dogs, weekly visits. For the bustling furry family.",
    features: ["3+ Dogs (custom quote for 5+)", "Weekly Visits (4-5/month)", "Free Deodorizing Spray", "Eco-Friendly Disposal", "Top Priority Scheduling", "Satisfaction Guaranteed"],
    popular: false,
    cta: "Choose Multi-Dog",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            No hidden fees, just straightforward plans to fit your needs and budget.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                plan.popular ? "border-2 border-accent ring-2 ring-accent/50 relative" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                  Most Popular
                </div>
              )}
              <CardHeader className="pt-8">
                <div className="flex justify-center mb-4">
                  {plan.name === "Basic Pup" && <Dog className="w-12 h-12 text-primary" />}
                  {plan.name === "Popular Pooch" && <Zap className="w-12 h-12 text-accent" />}
                  {plan.name === "Multi-Dog Manor" && <Dog className="w-12 h-12 text-primary" />}
                </div>
                <CardTitle className="text-2xl text-center text-primary">{plan.name}</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold text-accent">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.frequency}</span>
                </div>
                <CardDescription className="text-center h-12">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span className="text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className={`w-full ${plan.popular ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}>
                  <Link href="/login">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <p className="text-center mt-12 text-muted-foreground">
          Need a custom plan or one-time cleanup? <Link href="/#contact" className="text-primary hover:underline font-semibold">Contact us</Link> for a personalized quote.
        </p>
      </div>
    </section>
  );
}
