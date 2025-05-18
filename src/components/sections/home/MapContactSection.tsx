
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Image from "next/image";

export default function MapContactSection() {
  return (
    <section id="location" className="py-16 md:py-24 bg-muted">
      <div className="container">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <MapPin className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Service Area & Contact Details</h2>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            We proudly serve the greater Valley area. Find us on the map and get in touch!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl border">
            {/* Placeholder for an actual map embed. For now, a static image. */}
            <Image
              src="https://placehold.co/800x600.png"
              alt="Map showing service area"
              layout="fill"
              objectFit="cover"
              data-ai-hint="map location"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-primary" />
                  <a href="mailto:info@valleypetwaste.com" className="text-foreground/90 hover:text-primary">info@valleypetwaste.com</a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-6 h-6 text-primary" />
                  <a href="tel:+15551234567" className="text-foreground/90 hover:text-primary">(555) 123-4567</a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  <p className="text-foreground/90">123 Clean Street, Petville, CA 90210</p>
                </div>
              </div>
            </div>

            <div>
                <h3 className="text-2xl font-semibold text-primary mb-4">Business Hours</h3>
                <div className="space-y-1 text-foreground/90">
                  <div className="flex items-center gap-2"> <Clock className="w-5 h-5 text-primary/80"/> Monday - Friday: 8:00 AM - 5:00 PM</div>
                  <div className="flex items-center gap-2"> <Clock className="w-5 h-5 text-primary/80"/> Saturday: 9:00 AM - 1:00 PM</div>
                  <div className="flex items-center gap-2"> <Clock className="w-5 h-5 text-primary/80"/> Sunday: Closed</div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
