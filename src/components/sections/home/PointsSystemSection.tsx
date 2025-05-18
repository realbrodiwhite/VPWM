
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Calculator, CheckCircle } from "lucide-react";

const pointsFactors = [
  "Number of Dogs",
  "Yard Size",
  "Yard Accessibility & Terrain",
  "Visit Frequency (or One-Time)",
  "Initial Cleanup Condition (for first visits)",
  "Optional Add-on Services"
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

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <PawPrint className="w-7 h-7" /> How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-card-foreground/90">
                We assess several factors to assign points for each cleanup visit. This allows us to tailor the service price to the specific needs of your property and pets.
              </p>
              <h4 className="font-semibold text-primary">Key Factors Include:</h4>
              <ul className="space-y-2">
                {pointsFactors.map((factor) => (
                  <li key={factor} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <span className="text-card-foreground/80">{factor}</span>
                  </li>
                ))}
              </ul>
               <p className="text-sm text-muted-foreground pt-4">
                Each factor contributes points to a total score for the visit. This score then corresponds to a specific pricing tier.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
