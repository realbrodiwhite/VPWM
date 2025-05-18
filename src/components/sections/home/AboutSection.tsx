
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, ShieldCheck, Smile } from "lucide-react";
import Image from "next/image";

const coreValues = [
  {
    icon: <Leaf className="w-10 h-10 text-primary" />,
    title: "Eco-Friendly",
    description: "We use environmentally safe practices and disposal methods."
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-primary" />,
    title: "Reliable Service",
    description: "Count on us for timely and consistent pet waste removal."
  },
  {
    icon: <Smile className="w-10 h-10 text-primary" />,
    title: "Customer Satisfaction",
    description: "Your happiness is our priority. We strive for excellence in every cleanup."
  }
];

export default function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">About Valley Pet Waste Management</h2>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
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
                <div className="flex-shrink-0 p-3 bg-primary/10 rounded-full">
                  {value.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary">{value.title}</h3>
                  <p className="text-foreground/70 mt-1">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
