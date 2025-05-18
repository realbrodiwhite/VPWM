
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Calculator, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
            Our transparent points system helps determine the effort required for each service, ensuring fair and consistent pricing. The more complex the job, the more points it accrues.
          </p>
        </div>

        {/* Removed max-w-4xl mx-auto from this div to allow card to be wider */}
        <div> 
          <Card className="shadow-xl bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <PawPrint className="w-7 h-7" /> How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-base">
              <p className="text-card-foreground/90">
                Our unique Points System is designed with transparency and fairness at its core. Instead of flat rates that don't always account for the unique aspects of your situation, we assess several key factors to determine the specific effort required for each service. This means you only pay for the work needed, ensuring a personalized and equitable price for every cleanup.
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
                Each selected option within these factors contributes a set number of points to a total score for your requested visit. The higher the complexity (e.g., more dogs, larger yard, heavier initial cleanup), the more points are accrued. This total point score then directly corresponds to one of our clear pricing tiers. You can see this system in action and get an instant estimate on our 'Get Quote' page. This way, you understand exactly how your service cost is calculated before we even arrive.
              </p>
               <p className="text-sm text-muted-foreground pt-4 border-t mt-6">
                This system ensures you receive a fair price tailored to your specific needs, and it allows us to accurately allocate resources for efficient and thorough service.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
