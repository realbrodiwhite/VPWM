
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(data);
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. We'll get back to you soon.",
      variant: "default",
    });
    reset();
  };

  return (
    <section id="contact" className="min-h-screen flex items-center bg-accent">
      <div className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground">Get In Touch</h2>
          <p className="mt-4 text-lg text-accent-foreground/80 max-w-2xl mx-auto">
            Have questions or want to schedule a service? Contact us today!
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <Card className="shadow-lg bg-card text-card-foreground">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Send Us a Message</CardTitle>
              <CardDescription className="text-muted-foreground">We typically respond within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-card-foreground">Full Name</Label>
                  <Input id="name" {...register("name")} placeholder="John Doe" className="mt-1" />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email" className="text-card-foreground">Email Address</Label>
                  <Input id="email" type="email" {...register("email")} placeholder="you@example.com" className="mt-1" />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="message" className="text-card-foreground">Message</Label>
                  <Textarea id="message" {...register("message")} placeholder="Your inquiry..." className="mt-1 min-h-[120px]" />
                  {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="space-y-8 pt-8 md:pt-0">
            <h3 className="text-2xl font-semibold text-accent-foreground">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-accent-foreground" />
                <a href="mailto:info@valleypetwaste.com" className="text-accent-foreground/90 hover:text-accent-foreground">info@valleypetwaste.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-accent-foreground" />
                <a href="tel:+15551234567" className="text-accent-foreground/90 hover:text-accent-foreground">(555) 123-4567</a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-accent-foreground" />
                <p className="text-accent-foreground/90">123 Clean Street, Petville, CA 90210</p>
              </div>
            </div>
            <div className="mt-6">
                <h4 className="text-lg font-semibold text-accent-foreground mb-2">Business Hours</h4>
                <p className="text-accent-foreground/90">Monday - Friday: 8:00 AM - 5:00 PM</p>
                <p className="text-accent-foreground/90">Saturday: 9:00 AM - 1:00 PM</p>
                <p className="text-accent-foreground/90">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
