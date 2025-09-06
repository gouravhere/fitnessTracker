import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const workoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  date: z.string().min(1, "Date is required"),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute"),
  caloriesBurned: z.coerce.number().min(0, "Calories must be non-negative").optional(),
  type: z.enum(["strength", "cardio", "flexibility", "sports"]),
  notes: z.string().optional(),
  exercises: z.array(z.object({
    name: z.string().min(1, "Exercise name is required"),
    sets: z.coerce.number().min(1).optional(),
    reps: z.coerce.number().min(1).optional(),
    weight: z.coerce.number().min(0).optional(),
    distance: z.coerce.number().min(0).optional(),
    duration: z.coerce.number().min(1).optional(),
  })).optional(),
});

type WorkoutForm = z.infer<typeof workoutSchema>;

interface WorkoutModalProps {
  open: boolean;
  onClose: () => void;
}

export function WorkoutModal({ open, onClose }: WorkoutModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<WorkoutForm>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      name: "",
      date: new Date().toISOString().split('T')[0],
      duration: 60,
      caloriesBurned: 0,
      type: "strength",
      notes: "",
      exercises: [{ name: "", sets: 3, reps: 10, weight: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "exercises",
  });

  const createWorkoutMutation = useMutation({
    mutationFn: async (data: WorkoutForm) => {
      const workoutData = {
        ...data,
        date: new Date(data.date),
        exercises: data.exercises?.filter(ex => ex.name.trim() !== "") || [],
      };
      const response = await apiRequest("POST", "/api/workouts", workoutData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Workout added!",
        description: "Your workout has been successfully logged.",
      });
      form.reset();
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add workout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WorkoutForm) => {
    createWorkoutMutation.mutate(data);
  };

  const addExercise = () => {
    append({ name: "", sets: 3, reps: 10, weight: 0 });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Workout</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Workout Name</Label>
              <Input
                id="name"
                placeholder="e.g., Upper Body Strength"
                {...form.register("name")}
                data-testid="input-workout-name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...form.register("date")}
                data-testid="input-workout-date"
              />
              {form.formState.errors.date && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="60"
                {...form.register("duration")}
                data-testid="input-workout-duration"
              />
              {form.formState.errors.duration && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.duration.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="caloriesBurned">Calories Burned</Label>
              <Input
                id="caloriesBurned"
                type="number"
                placeholder="500"
                {...form.register("caloriesBurned")}
                data-testid="input-workout-calories"
              />
            </div>

            <div>
              <Label htmlFor="type">Workout Type</Label>
              <Select onValueChange={(value) => form.setValue("type", value as any)}>
                <SelectTrigger data-testid="select-workout-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strength">Strength Training</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about your workout..."
              {...form.register("notes")}
              data-testid="input-workout-notes"
            />
          </div>

          {/* Exercises Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Exercises</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExercise}
                data-testid="button-add-exercise"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Exercise
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border border-border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Input
                        placeholder="Exercise name"
                        {...form.register(`exercises.${index}.name`)}
                        data-testid={`input-exercise-name-${index}`}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Sets"
                        {...form.register(`exercises.${index}.sets`)}
                        data-testid={`input-exercise-sets-${index}`}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Reps"
                        {...form.register(`exercises.${index}.reps`)}
                        data-testid={`input-exercise-reps-${index}`}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        step="0.5"
                        placeholder="Weight (kg)"
                        {...form.register(`exercises.${index}.weight`)}
                        data-testid={`input-exercise-weight-${index}`}
                      />
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                          data-testid={`button-remove-exercise-${index}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-testid="button-cancel-workout"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createWorkoutMutation.isPending}
              data-testid="button-save-workout"
            >
              {createWorkoutMutation.isPending ? "Saving..." : "Save Workout"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
