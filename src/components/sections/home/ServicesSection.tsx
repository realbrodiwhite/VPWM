
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sun, Home, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const services = [
  {
    title: "Outdoor Cleanup",
    description: "Keep your yard, patio, and dog runs spotless with our thorough outdoor scooping service.",
    price: "Starts at $15/visit",
    features: ["Complete yard scooping", "Patio & deck cleaning", "Waste hauled away", "Regular yard sanitization (optional)"],
    image: "https://placehold.co/400x300.png",
    imageHint: "clean backyard",
    icon: <Sun className="w-8 h-8 text-primary" />
  },
  {
    title: "Indoor Cleanup",
    description: "Fresh and clean indoor spaces with litter box maintenance and accident cleanup.",
    price: "Starts at $12/visit",
    features: ["Litter box scooping & refresh", "Odor control for indoor spaces", "Pet accident spot cleaning", "Safe for pets & family"],
    image: "https://placehold.co/400x300.png",
    imageHint: "clean room cat",
    icon: <Home className="w-8 h-8 text-primary" />
  },
  {
    title: "Complete Care Package",
    description: "The ultimate solution for both indoor and outdoor pet waste removal. Total peace of mind.",
    price: "Custom Quote",
    features: ["All Outdoor & Indoor services", "Discounted package rate", "Flexible scheduling", "Top priority service"],
    image: "https://placehold.co/400x300.png",
    imageHint: "happy pet owner",
    icon: <ShieldCheck className="w-8 h-8 text-primary" />
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24 bg-primary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Our Pet Waste Removal Services</h2>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            From yards to litter boxes, we offer flexible and reliable solutions for a poop-free environment, inside and out.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.title} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-card text-card-foreground">
              <div className="relative h-48 w-full">
                <Image src={service.image} alt={service.title} layout="fill" objectFit="cover" data-ai-hint={service.imageHint} />
              </div>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {service.icon}
                  <CardTitle className="text-2xl text-primary">{service.title}</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-2xl font-bold text-accent mb-4">{service.price}</p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-foreground/90">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/login">Book Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
