import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Sun, 
  Coffee, 
  Moon, 
  Apple,
  Utensils,
  Beef
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MealModal } from "@/components/meal-modal";

export default function Meals() {
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: meals, isLoading } = useQuery({
    queryKey: ["/api/meals", selectedDate],
    queryFn: async () => {
      const response = await fetch(`/api/meals?date=${selectedDate}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch meals');
      return response.json();
    },
  });

  const getMealIcon = (type: string) => {
    switch (type) {
      case "breakfast":
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case "lunch":
        return <Sun className="w-5 h-5 text-orange-500" />;
      case "dinner":
        return <Moon className="w-5 h-5 text-purple-500" />;
      case "snack":
        return <Apple className="w-5 h-5 text-green-500" />;
      default:
        return <Utensils className="w-5 h-5 text-gray-500" />;
    }
  };

  const getMealTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getFoodIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('chicken') || lowerName.includes('beef') || lowerName.includes('fish') || lowerName.includes('salmon')) {
      return <Beef className="w-4 h-4 text-red-600" />;
    }
    if (lowerName.includes('bread') || lowerName.includes('oat') || lowerName.includes('rice')) {
      return <Coffee className="w-4 h-4 text-orange-600" />;
    }
    return <Apple className="w-4 h-4 text-green-600" />;
  };

  // Group meals by type
  const mealsByType = meals?.reduce((acc: any, meal: any) => {
    if (!acc[meal.type]) acc[meal.type] = [];
    acc[meal.type].push(meal);
    return acc;
  }, {}) || {};

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
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
          <h2 className="text-3xl font-bold text-foreground">Meals & Diet</h2>
          <p className="text-muted-foreground">Track your nutrition and manage your diet</p>
        </div>
        <Button 
          onClick={() => setShowMealModal(true)}
          data-testid="button-log-meal"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Meal
        </Button>
      </div>

      {/* Daily Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Calories</h3>
            <div className="text-2xl font-bold text-foreground mb-1" data-testid="text-daily-calories">
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
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Protein</h3>
            <div className="text-2xl font-bold text-foreground mb-1" data-testid="text-daily-protein">
              {stats?.todayProtein || 0}g
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              Goal: {stats?.goals?.protein || 120}g
            </div>
            <Progress 
              value={((stats?.todayProtein || 0) / (stats?.goals?.protein || 120)) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Carbs</h3>
            <div className="text-2xl font-bold text-foreground mb-1" data-testid="text-daily-carbs">
              {stats?.todayCarbs || 0}g
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              Goal: {stats?.goals?.carbs || 250}g
            </div>
            <Progress 
              value={((stats?.todayCarbs || 0) / (stats?.goals?.carbs || 250)) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Fat</h3>
            <div className="text-2xl font-bold text-foreground mb-1" data-testid="text-daily-fat">
              {stats?.todayFat || 0}g
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              Goal: {stats?.goals?.fat || 75}g
            </div>
            <Progress 
              value={((stats?.todayFat || 0) / (stats?.goals?.fat || 75)) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Meal Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daily Meals</CardTitle>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-sm border border-input rounded-md px-3 py-1 bg-background"
              data-testid="input-meal-date-filter"
            />
          </div>
        </CardHeader>

        <CardContent>
          {Object.keys(mealsByType).length > 0 ? (
            <div className="space-y-6">
              {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
                const mealsOfType = mealsByType[mealType] || [];
                if (mealsOfType.length === 0) return null;

                const totalCalories = mealsOfType.reduce((sum: number, meal: any) => 
                  sum + (meal.totalCalories || 0), 0
                );

                return (
                  <div key={mealType}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-foreground flex items-center">
                        {getMealIcon(mealType)}
                        <span className="ml-2">{getMealTypeLabel(mealType)}</span>
                      </h4>
                      <div className="text-sm text-muted-foreground" data-testid={`text-${mealType}-calories`}>
                        {totalCalories} kcal
                      </div>
                    </div>

                    <div className="space-y-3">
                      {mealsOfType.map((meal: any) => (
                        <div key={meal.id} className="bg-muted rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-foreground">{meal.name}</h5>
                            <div className="text-sm font-medium text-foreground">
                              {meal.totalCalories || 0} kcal
                            </div>
                          </div>

                          {meal.foodItems?.map((item: any, index: number) => (
                            <div 
                              key={item.id || index} 
                              className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
                              data-testid={`food-item-${meal.id}-${index}`}
                            >
                              <div className="flex items-center">
                                <div className="w-6 h-6 bg-background rounded flex items-center justify-center mr-3">
                                  {getFoodIcon(item.name)}
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">{item.quantity}g</p>
                                </div>
                              </div>
                              <div className="text-sm font-medium text-foreground">
                                {Math.round(item.quantity * item.caloriesPerGram)} kcal
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Utensils className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No meals logged today</h3>
              <p className="mb-4">Start tracking your nutrition by logging your first meal</p>
              <Button 
                onClick={() => setShowMealModal(true)}
                data-testid="button-log-first-meal"
              >
                <Plus className="w-4 h-4 mr-2" />
                Log Your First Meal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <MealModal 
        open={showMealModal} 
        onClose={() => setShowMealModal(false)} 
      />
    </div>
  );
}
