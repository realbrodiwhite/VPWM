
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
import { MailOpen } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormInputs = z.infer<typeof contactFormSchema>;

export default function ContactFormSection() {
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
    <section id="contact-form" className="py-16 md:py-24 bg-accent"> {/* Changed to bg-accent */}
      <div className="container">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <MailOpen className="w-12 h-12 text-accent-foreground" /> {/* Changed icon color */}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground">Send Us a Message</h2> {/* Changed text color */}
          <p className="mt-4 text-lg text-accent-foreground/80 max-w-2xl mx-auto"> {/* Changed text color */}
            Have questions or want to schedule a service? Fill out the form below!
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg bg-card text-card-foreground">
            <CardContent className="pt-6">
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
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting}> {/* Changed button color */}
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
