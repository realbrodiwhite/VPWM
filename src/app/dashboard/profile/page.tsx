
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Edit2 } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(),
  address: z.string().min(5, "Address must be at least 5 characters."),
});

type ProfileFormInputs = z.infer<typeof profileSchema>;

// Mock user data
const currentUser = {
  name: "Jane Doe",
  email: "customer@example.com",
  phone: "555-123-4567",
  address: "123 Happy Lane, Petville, CA 90210",
  avatarUrl: "https://placehold.co/150x150.png?text=JD"
};

export default function ProfilePage() {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: currentUser,
  });

  const onSubmit: SubmitHandler<ProfileFormInputs> = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Profile update data:", data);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-2">
        <UserCircle className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-primary">My Profile</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-2 border-primary">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="person portrait"/>
                <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background hover:bg-muted">
                <Edit2 className="h-4 w-4 text-primary"/>
                <span className="sr-only">Edit Avatar</span>
              </Button>
            </div>
            <div>
              <CardTitle className="text-2xl">{currentUser.name}</CardTitle>
              <CardDescription>Manage your personal information and contact details.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register("name")} className="mt-1" />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" {...register("email")} className="mt-1" />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input id="phone" type="tel" {...register("phone")} className="mt-1" />
              {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <Label htmlFor="address">Service Address</Label>
              <Input id="address" {...register("address")} className="mt-1" />
              {errors.address && <p className="text-sm text-destructive mt-1">{errors.address.message}</p>}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" placeholder="••••••••" className="mt-1" />
                </div>
                <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" placeholder="••••••••" className="mt-1" />
                </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                {isSubmitting ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
