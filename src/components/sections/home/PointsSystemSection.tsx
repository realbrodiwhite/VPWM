
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Calculator, CheckCircle } from "lucide-react";

const pointsFactors = [
  "Number of Dogs",
  "Yard Size",
  "Yard Accessibility & Terrain",
  "Visit Frequency (or One-Time)",
  "Initial Cleanup Condition (for first visits)",
  "Optional Add-on Services (like deodorizing or off-site disposal)"
];

export default function PointsSystemSection() {
  return (
    <section id="points-system" className="py-16 md:py-24 bg-muted">
      <div className="container">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Calculator className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Understanding Our Points System</h2>
          <p className="mt-4 text-lg text-foreground/80 max-w-3xl mx-auto">
            Our transparent points system determines service effort, ensuring fair and consistent pricing. More complex jobs accrue more points.
          </p>
        </div>

        <div> 
          <Card className="shadow-xl bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <PawPrint className="w-7 h-7" /> How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-base">
              <p className="text-card-foreground/90">
                Our Points System ensures fair and transparent pricing. Instead of flat rates, we assess key factors for each service, meaning you only pay for the work required. This guarantees a personalized and equitable price for every cleanup.
              </p>
              <div>
                <h4 className="font-semibold text-lg text-primary mb-3">Key Factors We Consider:</h4>
                <ul className="space-y-2 pl-2">
                  {pointsFactors.map((factor) => (
                    <li key={factor} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <span className="text-card-foreground/80">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
               <p className="text-card-foreground/90">
                Each factor choice adds points to your visit's total score. More complex jobs (e.g., more dogs, larger yard, heavier initial cleanup) accrue more points. This total score then directly corresponds to one of our clear pricing tiers. See this system in action and get an instant estimate on our 'Get Quote' page to understand your costs upfront.
              </p>
               <p className="text-sm text-muted-foreground pt-4 border-t mt-6">
                This tailored approach provides fair pricing for your specific needs and allows us to deliver efficient, thorough service.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

