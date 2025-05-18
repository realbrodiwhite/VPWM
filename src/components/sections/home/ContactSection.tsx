
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
import { MailOpen } from "lucide-react"; // Changed Icon

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;

export default function ContactFormSection() { // Renamed component for clarity
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
      variant: "default", // Ensure toast is visible on green background
    });
    reset();
  };

  return (
    <section id="contact-form" className="py-16 md:py-24 bg-primary"> {/* Changed to Green background */}
      <div className="container">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <MailOpen className="w-12 h-12 text-primary-foreground" /> {/* Icon color for contrast on green */}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Send Us a Message</h2> {/* Text color for contrast */}
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto"> {/* Text color for contrast */}
            Have questions or want to schedule a service? Fill out the form below!
          </p>
        </div>
        <div className="max-w-2xl mx-auto"> {/* Center the card */}
          <Card className="shadow-lg bg-card text-card-foreground">
            {/* CardHeader can be removed if title is above the card */}
            <CardContent className="pt-6"> {/* Added pt-6 since CardHeader might be removed */}
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
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
