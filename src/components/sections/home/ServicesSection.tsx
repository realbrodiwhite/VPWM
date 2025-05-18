
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CalendarDays, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const services = [
  {
    title: "Weekly Cleanup",
    description: "Regularly scheduled visits to keep your yard consistently clean.",
    price: "$15/visit",
    features: ["Once per week", "Thorough scooping", "Waste hauled away"],
    image: "https://placehold.co/400x300.png",
    imageHint: "clean garden"
  },
  {
    title: "Bi-Weekly Cleanup",
    description: "A popular choice for maintaining a tidy yard with less frequent visits.",
    price: "$20/visit",
    features: ["Every two weeks", "Complete yard coverage", "Eco-friendly disposal"],
    image: "https://placehold.co/400x300.png",
    imageHint: "suburban yard"
  },
  {
    title: "One-Time Cleanup",
    description: "Perfect for special occasions or when you need an extra hand.",
    price: "Starts at $50",
    features: ["Thorough single cleanup", "Ideal for parties or events", "Flexible scheduling"],
    image: "https://placehold.co/400x300.png",
    imageHint: "event setup"
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24 bg-secondary/20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Pet Waste Removal Services</h2>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            Choose the plan that best suits your needs. We offer flexible and reliable solutions for a poop-free yard.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.title} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image src={service.image} alt={service.title} layout="fill" objectFit="cover" data-ai-hint={service.imageHint} />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
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
