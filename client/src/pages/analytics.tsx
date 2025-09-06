import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Download,
  Filter,
  PieChart,
  LineChart,
  Activity
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Analytics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: workouts } = useQuery({
    queryKey: ["/api/workouts"],
  });

  const { data: measurements } = useQuery({
    queryKey: ["/api/measurements"],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  const weeklyWorkouts = workouts?.filter((w: any) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(w.date) >= weekAgo;
  }).length || 0;

  const monthlyWorkouts = workouts?.filter((w: any) => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return new Date(w.date) >= monthAgo;
  }).length || 0;

  const totalCaloriesBurned = workouts?.reduce((sum: number, w: any) => sum + (w.caloriesBurned || 0), 0) || 0;

  const averageWorkoutDuration = workouts?.length 
    ? Math.round(workouts.reduce((sum: number, w: any) => sum + (w.duration || 0), 0) / workouts.length)
    : 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Analytics & Reports</h2>
          <p className="text-muted-foreground">Comprehensive insights into your fitness journey</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" data-testid="button-filter-analytics">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" data-testid="button-export-report">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Weekly Workouts</h3>
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-2" data-testid="text-weekly-workouts-analytics">
              {weeklyWorkouts}
            </div>
            <div className="text-sm text-muted-foreground">This week</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-3 h-3 text-accent mr-1" />
              <span className="text-xs text-accent">+2 from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Monthly Workouts</h3>
              <BarChart3 className="w-5 h-5 text-accent" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-2" data-testid="text-monthly-workouts">
              {monthlyWorkouts}
            </div>
            <div className="text-sm text-muted-foreground">This month</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-3 h-3 text-accent mr-1" />
              <span className="text-xs text-accent">Staying consistent</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Total Calories Burned</h3>
              <Activity className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-2" data-testid="text-total-calories-burned">
              {totalCaloriesBurned.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">All time</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-3 h-3 text-accent mr-1" />
              <span className="text-xs text-accent">Great progress!</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Avg Workout Duration</h3>
              <LineChart className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-2" data-testid="text-avg-workout-duration">
              {averageWorkoutDuration}m
            </div>
            <div className="text-sm text-muted-foreground">Average</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-3 h-3 text-accent mr-1" />
              <span className="text-xs text-accent">Optimal range</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Workout Frequency Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Workout Frequency</CardTitle>
              <select className="text-sm border border-input rounded-md px-2 py-1 bg-background">
                <option>Last 4 weeks</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                <p className="font-medium">Workout Frequency Chart</p>
                <p className="text-sm">Visualize your workout consistency</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calories Burned Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Calories Burned Over Time</CardTitle>
              <select className="text-sm border border-input rounded-md px-2 py-1 bg-background">
                <option>Last 4 weeks</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center text-muted-foreground">
                <LineChart className="w-12 h-12 mx-auto mb-4" />
                <p className="font-medium">Calories Burned Chart</p>
                <p className="text-sm">Track your calorie burn trends</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workout Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Workout Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center text-muted-foreground">
                <PieChart className="w-12 h-12 mx-auto mb-4" />
                <p className="font-medium">Workout Type Chart</p>
                <p className="text-sm">See your workout variety</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Total Workouts</p>
                  <p className="text-sm text-muted-foreground">All time</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground" data-testid="text-total-workouts-summary">
                    {workouts?.length || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Body Measurements</p>
                  <p className="text-sm text-muted-foreground">Recorded entries</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground" data-testid="text-total-measurements">
                    {measurements?.length || 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Average Calories/Workout</p>
                  <p className="text-sm text-muted-foreground">When logged</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground" data-testid="text-avg-calories-workout">
                    {workouts?.length 
                      ? Math.round(totalCaloriesBurned / workouts.length) 
                      : 0
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
