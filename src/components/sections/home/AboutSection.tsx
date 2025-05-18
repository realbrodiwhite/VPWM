
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, ShieldCheck, Smile } from "lucide-react";
import Image from "next/image";

const coreValues = [
  {
    icon: <Leaf className="w-10 h-10 text-accent" />, // Changed to accent (yellow) for contrast on green
    title: "Eco-Friendly",
    description: "We use environmentally safe practices and disposal methods."
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-accent" />, // Changed to accent (yellow)
    title: "Reliable Service",
    description: "Count on us for timely and consistent pet waste removal."
  },
  {
    icon: <Smile className="w-10 h-10 text-accent" />, // Changed to accent (yellow)
    title: "Customer Satisfaction",
    description: "Your happiness is our priority. We strive for excellence in every cleanup."
  }
];

export default function AboutSection() {
  return (
    <section id="about" className="min-h-screen flex items-center bg-primary"> {/* Changed to bg-primary */}
      <div className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">About Pet Waste Management</h2> {/* Changed text color */}
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto"> {/* Changed text color */}
            Founded with a passion for pets and clean environments, we are dedicated to providing top-notch pet waste removal services for our community.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <Image 
              src="https://placehold.co/600x450.png" 
              alt="Our team member with a friendly dog"
              layout="fill"
              objectFit="cover"
              data-ai-hint="person dog"
            />
          </div>
          <div className="space-y-8">
            {coreValues.map((value) => (
              <div key={value.title} className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-background/50 rounded-full"> {/* Icon background remains light */}
                  {value.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary-foreground">{value.title}</h3> {/* Changed text color */}
                  <p className="text-primary-foreground/70 mt-1">{value.description}</p> {/* Changed text color */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

