import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Play, 
  List, 
  Users, 
  Dumbbell, 
  Activity, 
  Zap,
  Calendar,
  Clock,
  Flame,
  Trash2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkoutModal } from "@/components/workout-modal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Workouts() {
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workouts, isLoading } = useQuery({
    queryKey: ["/api/workouts"],
  });

  const deleteWorkoutMutation = useMutation({
    mutationFn: async (workoutId: string) => {
      await apiRequest("DELETE", `/api/workouts/${workoutId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Workout deleted",
        description: "The workout has been removed from your history.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete workout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getWorkoutIcon = (type: string) => {
    switch (type) {
      case "strength":
        return <Dumbbell className="w-5 h-5 text-white" />;
      case "cardio":
        return <Activity className="w-5 h-5 text-white" />;
      case "flexibility":
        return <Zap className="w-5 h-5 text-white" />;
      case "sports":
        return <Play className="w-5 h-5 text-white" />;
      default:
        return <Dumbbell className="w-5 h-5 text-white" />;
    }
  };

  const getWorkoutColor = (type: string) => {
    switch (type) {
      case "strength":
        return "bg-primary";
      case "cardio":
        return "bg-accent";
      case "flexibility":
        return "bg-orange-500";
      case "sports":
        return "bg-purple-500";
      default:
        return "bg-primary";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Workouts</h2>
          <p className="text-muted-foreground">Track and manage your workout routines</p>
        </div>
        <Button 
          onClick={() => setShowWorkoutModal(true)}
          data-testid="button-add-workout"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Workout
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="cursor-pointer hover:bg-muted transition-colors">
          <CardContent className="p-6 text-center">
            <Play className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Start Quick Workout</h3>
            <p className="text-sm text-muted-foreground">Begin a workout session</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted transition-colors">
          <CardContent className="p-6 text-center">
            <List className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">My Routines</h3>
            <p className="text-sm text-muted-foreground">Access saved routines</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted transition-colors">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Workout Plans</h3>
            <p className="text-sm text-muted-foreground">Browse training plans</p>
          </CardContent>
        </Card>
      </div>

      {/* Workout History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Workout History</CardTitle>
            <div className="flex items-center space-x-2">
              <select className="text-sm border border-input rounded-md px-3 py-1 bg-background">
                <option>All Types</option>
                <option>Strength</option>
                <option>Cardio</option>
                <option>Flexibility</option>
                <option>Sports</option>
              </select>
              <input 
                type="date" 
                className="text-sm border border-input rounded-md px-3 py-1 bg-background"
                data-testid="input-date-filter"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {workouts?.length > 0 ? (
            <div className="space-y-4">
              {workouts.map((workout: any) => (
                <div 
                  key={workout.id} 
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                  data-testid={`workout-card-${workout.id}`}
                >
                  <div className="flex items-center flex-1">
                    <div className={`w-12 h-12 ${getWorkoutColor(workout.type)} rounded-lg flex items-center justify-center`}>
                      {getWorkoutIcon(workout.type)}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-semibold text-foreground">{workout.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(workout.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {workout.duration}m
                        </div>
                        <div className="flex items-center">
                          <Dumbbell className="w-3 h-3 mr-1" />
                          {workout.exercises?.length || 0} exercises
                        </div>
                      </div>
                      {workout.exercises?.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {workout.exercises.slice(0, 3).map((ex: any) => ex.name).join(", ")}
                          {workout.exercises.length > 3 && "..."}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <div className="flex items-center text-lg font-bold text-foreground">
                      <Flame className="w-4 h-4 mr-1 text-orange-500" />
                      {workout.caloriesBurned || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">calories</div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      data-testid={`button-view-workout-${workout.id}`}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteWorkoutMutation.mutate(workout.id)}
                      disabled={deleteWorkoutMutation.isPending}
                      data-testid={`button-delete-workout-${workout.id}`}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Dumbbell className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No workouts yet</h3>
              <p className="mb-4">Start tracking your workouts to see them here</p>
              <Button 
                onClick={() => setShowWorkoutModal(true)}
                data-testid="button-first-workout"
              >
                <Plus className="w-4 h-4 mr-2" />
                Log Your First Workout
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <WorkoutModal 
        open={showWorkoutModal} 
        onClose={() => setShowWorkoutModal(false)} 
      />
    </div>
  );
}
