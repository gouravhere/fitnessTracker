import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Download,
  Trash2,
  Save
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  dietaryPreference: z.enum(["omnivore", "vegetarian", "non-vegetarian"]),
  dailyCalorieGoal: z.coerce.number().min(1000).max(5000),
  dailyProteinGoal: z.coerce.number().min(50).max(300),
  dailyCarbGoal: z.coerce.number().min(100).max(500),
  dailyFatGoal: z.coerce.number().min(20).max(150),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/user/profile"],
  });

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: user ? {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      dietaryPreference: user.dietaryPreference || "omnivore",
      dailyCalorieGoal: user.dailyCalorieGoal || 2200,
      dailyProteinGoal: user.dailyProteinGoal || 120,
      dailyCarbGoal: user.dailyCarbGoal || 250,
      dailyFatGoal: user.dailyFatGoal || 75,
    } : undefined,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileForm) => {
      const response = await apiRequest("PUT", "/api/user/profile", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileForm) => {
    updateProfileMutation.mutate(data);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Skeleton className="h-96" />
          <div className="lg:col-span-3">
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Customize your Natural Aesthetics experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Settings Menu</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground hover:bg-muted"
                    }`}
                    data-testid={`tab-${tab.id}`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Update your account details and fitness goals
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          {...form.register("firstName")}
                          data-testid="input-first-name-settings"
                        />
                        {form.formState.errors.firstName && (
                          <p className="text-sm text-destructive mt-1">
                            {form.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          {...form.register("lastName")}
                          data-testid="input-last-name-settings"
                        />
                        {form.formState.errors.lastName && (
                          <p className="text-sm text-destructive mt-1">
                            {form.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...form.register("email")}
                          data-testid="input-email-settings"
                        />
                        {form.formState.errors.email && (
                          <p className="text-sm text-destructive mt-1">
                            {form.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          {...form.register("username")}
                          data-testid="input-username-settings"
                        />
                        {form.formState.errors.username && (
                          <p className="text-sm text-destructive mt-1">
                            {form.formState.errors.username.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Dietary Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Dietary Preferences</h3>
                    <div>
                      <Label htmlFor="dietaryPreference">Dietary Preference</Label>
                      <Select onValueChange={(value) => form.setValue("dietaryPreference", value as any)}>
                        <SelectTrigger data-testid="select-dietary-preference">
                          <SelectValue placeholder="Select dietary preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="omnivore">Omnivore</SelectItem>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  {/* Daily Goals */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Daily Nutrition Goals</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dailyCalorieGoal">Daily Calorie Goal</Label>
                        <Input
                          id="dailyCalorieGoal"
                          type="number"
                          {...form.register("dailyCalorieGoal")}
                          data-testid="input-calorie-goal"
                        />
                        {form.formState.errors.dailyCalorieGoal && (
                          <p className="text-sm text-destructive mt-1">
                            {form.formState.errors.dailyCalorieGoal.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="dailyProteinGoal">Daily Protein Goal (g)</Label>
                        <Input
                          id="dailyProteinGoal"
                          type="number"
                          {...form.register("dailyProteinGoal")}
                          data-testid="input-protein-goal"
                        />
                        {form.formState.errors.dailyProteinGoal && (
                          <p className="text-sm text-destructive mt-1">
                            {form.formState.errors.dailyProteinGoal.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="dailyCarbGoal">Daily Carb Goal (g)</Label>
                        <Input
                          id="dailyCarbGoal"
                          type="number"
                          {...form.register("dailyCarbGoal")}
                          data-testid="input-carb-goal"
                        />
                        {form.formState.errors.dailyCarbGoal && (
                          <p className="text-sm text-destructive mt-1">
                            {form.formState.errors.dailyCarbGoal.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="dailyFatGoal">Daily Fat Goal (g)</Label>
                        <Input
                          id="dailyFatGoal"
                          type="number"
                          {...form.register("dailyFatGoal")}
                          data-testid="input-fat-goal"
                        />
                        {form.formState.errors.dailyFatGoal && (
                          <p className="text-sm text-destructive mt-1">
                            {form.formState.errors.dailyFatGoal.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      data-testid="button-save-profile"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage how you receive notifications from Natural Aesthetics
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Workout Reminders</h4>
                    <p className="text-sm text-muted-foreground">Get reminded about your scheduled workouts</p>
                  </div>
                  <Switch data-testid="switch-workout-reminders" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Progress Updates</h4>
                    <p className="text-sm text-muted-foreground">Weekly progress summaries</p>
                  </div>
                  <Switch data-testid="switch-progress-updates" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Goal Achievements</h4>
                    <p className="text-sm text-muted-foreground">Celebrate when you reach your goals</p>
                  </div>
                  <Switch defaultChecked data-testid="switch-goal-achievements" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch data-testid="switch-email-notifications" />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "privacy" && (
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your privacy settings and account security
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-4">Data Export</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download all your fitness data in a portable format
                  </p>
                  <Button variant="outline" data-testid="button-export-data">
                    <Download className="w-4 h-4 mr-2" />
                    Export My Data
                  </Button>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-foreground mb-4">Account Deletion</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete your account and all associated data
                  </p>
                  <Button variant="destructive" data-testid="button-delete-account">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Customize the look and feel of Natural Aesthetics
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-4">Theme</h4>
                  <Select>
                    <SelectTrigger data-testid="select-theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-4">Language</h4>
                  <Select>
                    <SelectTrigger data-testid="select-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-4">Units</h4>
                  <div className="space-y-4">
                    <div>
                      <Label>Weight Unit</Label>
                      <Select>
                        <SelectTrigger data-testid="select-weight-unit">
                          <SelectValue placeholder="Select weight unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilograms (kg)</SelectItem>
                          <SelectItem value="lb">Pounds (lb)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Distance Unit</Label>
                      <Select>
                        <SelectTrigger data-testid="select-distance-unit">
                          <SelectValue placeholder="Select distance unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="km">Kilometers (km)</SelectItem>
                          <SelectItem value="mi">Miles (mi)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
