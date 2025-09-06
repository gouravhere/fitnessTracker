import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Flame, 
  Weight, 
  Clock, 
  Droplets, 
  TrendingUp, 
  TrendingDown,
  Dumbbell,
  Activity,
  Zap
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: user } = useQuery({
    queryKey: ["/api/user/profile"],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 90) return "bg-accent";
    if (percentage >= 70) return "bg-primary";
    return "bg-orange-500";
  };

  return (
    <div className="p-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-lg text-white mb-8">
        <h2 className="text-2xl font-bold mb-2">
          {greeting()}, {user?.firstName || "there"}!
        </h2>
        <p className="text-primary-foreground/90 mb-4">Ready to crush your fitness goals today?</p>
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold" data-testid="text-streak">7</div>
            <div className="text-sm text-primary-foreground/80">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" data-testid="text-weekly-workouts">
              {stats?.weeklyWorkouts || 0}
            </div>
            <div className="text-sm text-primary-foreground/80">This Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" data-testid="text-total-workouts">
              {stats?.totalWorkouts || 0}
            </div>
            <div className="text-sm text-primary-foreground/80">Total Workouts</div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Today's Calories</h3>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-2" data-testid="text-calories">
              {stats?.todayCalories || 0}
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              Goal: {stats?.goals?.calories || 2200}
            </div>
            <Progress 
              value={((stats?.todayCalories || 0) / (stats?.goals?.calories || 2200)) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Weight Progress</h3>
              <Weight className="w-5 h-5 text-accent" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-2" data-testid="text-weight">
              {stats?.currentWeight ? `${stats.currentWeight} kg` : "No data"}
            </div>
            <div className="text-sm text-accent">Track your progress</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-3 h-3 text-accent mr-1" />
              <span className="text-xs text-accent">Stay consistent</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Weekly Workouts</h3>
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-2" data-testid="text-weekly-sessions">
              {stats?.weeklyWorkouts || 0}
            </div>
            <div className="text-sm text-muted-foreground">This week</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-3 h-3 text-accent mr-1" />
              <span className="text-xs text-accent">Keep it up!</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Water Intake</h3>
              <Droplets className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-2" data-testid="text-water">
              {stats?.todayWater || 0}L
            </div>
            <div className="text-sm text-muted-foreground mb-2">Goal: 3.0L</div>
            <Progress 
              value={((stats?.todayWater || 0) / 3.0) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart Placeholder */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Weight Progress</CardTitle>
              <select className="text-sm border border-input rounded-md px-2 py-1 bg-background">
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                <p>Weight Progress Chart</p>
                <p className="text-sm">Start tracking to see your progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Workouts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Workouts</CardTitle>
              <Link href="/workouts">
                <Button variant="ghost" size="sm" data-testid="link-view-all-workouts">
                  View all
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentWorkouts?.length > 0 ? (
                stats.recentWorkouts.map((workout: any, index: number) => (
                  <div 
                    key={workout.id} 
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    data-testid={`workout-item-${index}`}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        {workout.type === 'strength' ? (
                          <Dumbbell className="w-4 h-4 text-white" />
                        ) : workout.type === 'cardio' ? (
                          <Activity className="w-4 h-4 text-white" />
                        ) : (
                          <Zap className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-foreground">{workout.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(workout.date).toLocaleDateString()} • {workout.duration}m
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {workout.caloriesBurned || 0} kcal
                      </p>
                      <p className="text-xs text-muted-foreground">burned</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No workouts yet</p>
                  <p className="text-sm">Start your first workout to see it here</p>
                  <Link href="/workouts">
                    <Button className="mt-4" data-testid="button-start-first-workout">
                      Start First Workout
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
