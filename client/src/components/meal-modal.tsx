import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const mealSchema = z.object({
  name: z.string().min(1, "Meal name is required"),
  type: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  date: z.string().min(1, "Date is required"),
  foodItems: z.array(z.object({
    name: z.string().min(1, "Food name is required"),
    quantity: z.coerce.number().min(0.1, "Quantity must be greater than 0"),
    caloriesPerGram: z.coerce.number().min(0, "Calories per gram must be non-negative"),
    proteinPerGram: z.coerce.number().min(0).optional(),
    carbsPerGram: z.coerce.number().min(0).optional(),
    fatPerGram: z.coerce.number().min(0).optional(),
  })).min(1, "At least one food item is required"),
});

type MealForm = z.infer<typeof mealSchema>;

interface MealModalProps {
  open: boolean;
  onClose: () => void;
}

export function MealModal({ open, onClose }: MealModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MealForm>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: "",
      type: "breakfast",
      date: new Date().toISOString().split('T')[0],
      foodItems: [{ name: "", quantity: 100, caloriesPerGram: 0, proteinPerGram: 0, carbsPerGram: 0, fatPerGram: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "foodItems",
  });

  const createMealMutation = useMutation({
    mutationFn: async (data: MealForm) => {
      const mealData = {
        ...data,
        date: new Date(data.date),
        foodItems: data.foodItems.filter(item => item.name.trim() !== ""),
      };
      const response = await apiRequest("POST", "/api/meals", mealData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Meal logged!",
        description: "Your meal has been successfully added.",
      });
      form.reset();
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log meal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MealForm) => {
    createMealMutation.mutate(data);
  };

  const addFoodItem = () => {
    append({ name: "", quantity: 100, caloriesPerGram: 0, proteinPerGram: 0, carbsPerGram: 0, fatPerGram: 0 });
  };

  // Common food database for quick selection
  const commonFoods = [
    { name: "Chicken Breast", calories: 1.65, protein: 0.31, carbs: 0, fat: 0.036 },
    { name: "Brown Rice", calories: 1.23, protein: 0.023, carbs: 0.23, fat: 0.009 },
    { name: "Broccoli", calories: 0.34, protein: 0.028, carbs: 0.07, fat: 0.004 },
    { name: "Oatmeal", calories: 3.89, protein: 0.167, carbs: 0.66, fat: 0.069 },
    { name: "Greek Yogurt", calories: 0.59, protein: 0.10, carbs: 0.036, fat: 0.004 },
    { name: "Salmon", calories: 2.08, protein: 0.25, carbs: 0, fat: 0.12 },
  ];

  const selectCommonFood = (index: number, food: typeof commonFoods[0]) => {
    form.setValue(`foodItems.${index}.name`, food.name);
    form.setValue(`foodItems.${index}.caloriesPerGram`, food.calories);
    form.setValue(`foodItems.${index}.proteinPerGram`, food.protein);
    form.setValue(`foodItems.${index}.carbsPerGram`, food.carbs);
    form.setValue(`foodItems.${index}.fatPerGram`, food.fat);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Meal</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Meal Name</Label>
              <Input
                id="name"
                placeholder="e.g., Post-workout breakfast"
                {...form.register("name")}
                data-testid="input-meal-name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="type">Meal Type</Label>
              <Select onValueChange={(value) => form.setValue("type", value as any)}>
                <SelectTrigger data-testid="select-meal-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...form.register("date")}
                data-testid="input-meal-date"
              />
              {form.formState.errors.date && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>
          </div>

          {/* Food Items Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Food Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFoodItem}
                data-testid="button-add-food-item"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Food Item
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border border-border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-3">
                    <div className="md:col-span-2">
                      <Input
                        placeholder="Food name"
                        {...form.register(`foodItems.${index}.name`)}
                        data-testid={`input-food-name-${index}`}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Quantity (g)"
                        {...form.register(`foodItems.${index}.quantity`)}
                        data-testid={`input-food-quantity-${index}`}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Cal/g"
                        {...form.register(`foodItems.${index}.caloriesPerGram`)}
                        data-testid={`input-food-calories-${index}`}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Protein/g"
                        {...form.register(`foodItems.${index}.proteinPerGram`)}
                        data-testid={`input-food-protein-${index}`}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Carbs/g"
                        {...form.register(`foodItems.${index}.carbsPerGram`)}
                        data-testid={`input-food-carbs-${index}`}
                      />
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                          data-testid={`button-remove-food-${index}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Quick Select Common Foods */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground mr-2">Quick select:</span>
                    {commonFoods.map((food) => (
                      <Button
                        key={food.name}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs h-6"
                        onClick={() => selectCommonFood(index, food)}
                        data-testid={`button-quick-select-${food.name.toLowerCase().replace(/\s+/g, '-')}-${index}`}
                      >
                        {food.name}
                      </Button>
                    ))}
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
              data-testid="button-cancel-meal"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMealMutation.isPending}
              data-testid="button-save-meal"
            >
              {createMealMutation.isPending ? "Saving..." : "Log Meal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
