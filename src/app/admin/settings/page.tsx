
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings, Bell, Users, Palette } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Settings className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-primary">System Settings</h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage general application settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" defaultValue="Valley Pet Waste Management" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Administrator Email</Label>
            <Input id="adminEmail" type="email" defaultValue="admin@valleypetwaste.com" />
          </div>
           <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="maintenance-mode" className="text-base">Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Temporarily disable customer access for system updates.
              </p>
            </div>
            <Switch id="maintenance-mode" aria-label="Maintenance mode" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <div className="flex items-center gap-2 mb-1">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle>Notification Settings</CardTitle>
            </div>
          <CardDescription>Configure how and when notifications are sent.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <p>New Booking Notifications (Admin)</p>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <p>Service Reminder (Customer)</p>
            <Switch defaultChecked />
          </div>
           <div className="flex items-center justify-between rounded-lg border p-3">
            <p>Payment Due Reminder (Customer)</p>
            <Switch />
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
            <div className="flex items-center gap-2 mb-1">
                <Users className="w-5 h-5 text-primary" />
                <CardTitle>User Management</CardTitle>
            </div>
          <CardDescription>Manage admin user roles and permissions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-muted-foreground">User roles and permissions settings will be available here.</p>
            <Button variant="outline">Manage Roles</Button>
        </CardContent>
      </Card>

       <Card className="shadow-lg">
        <CardHeader>
            <div className="flex items-center gap-2 mb-1">
                <Palette className="w-5 h-5 text-primary" />
                <CardTitle>Theme & Branding</CardTitle>
            </div>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="logoUpload">Upload Company Logo</Label>
                <Input id="logoUpload" type="file" />
            </div>
            <p className="text-muted-foreground">Advanced theme customization options will appear here.</p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Save All Settings</Button>
      </div>
    </div>
  );
}
