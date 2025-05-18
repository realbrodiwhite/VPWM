
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-background to-secondary/30">
      <div className="container grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary">
            Keep Your Yard Clean, Effortlessly.
          </h1>
          <p className="text-lg md:text-xl text-foreground/80">
            Valley Pet Waste Management offers reliable and professional pet waste removal services so you can enjoy a spotless yard without the hassle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md">
              <Link href="/#services">Our Services</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="shadow-md">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-xl">
          <Image
            src="https://placehold.co/600x400.png"
            alt="Happy dog in a clean yard"
            layout="fill"
            objectFit="cover"
            data-ai-hint="dog park"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
