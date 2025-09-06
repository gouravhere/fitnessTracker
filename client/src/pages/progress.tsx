import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Weight, 
  TrendingUp, 
  TrendingDown,
  Percent,
  Ruler,
  ExpandIcon,
  Flame,
  Activity,
  Edit,
  Trash2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MeasurementModal } from "@/components/measurement-modal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Progress() {
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: measurements, isLoading } = useQuery({
    queryKey: ["/api/measurements"],
  });

  const deleteMeasurementMutation = useMutation({
    mutationFn: async (measurementId: string) => {
      await apiRequest("DELETE", `/api/measurements/${measurementId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/measurements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Measurement deleted",
        description: "The measurement has been removed from your history.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete measurement. Please try again.",
        variant: "destructive",
      });
    },
  });

  const latestMeasurement = measurements?.[0];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
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
          <h2 className="text-3xl font-bold text-foreground">Progress Tracking</h2>
          <p className="text-muted-foreground">Monitor your fitness journey and body measurements</p>
        </div>
        <Button 
          onClick={() => setShowMeasurementModal(true)}
          data-testid="button-add-measurement"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Measurement
        </Button>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Weight Progress</CardTitle>
              <select className="text-sm border border-input rounded-md px-2 py-1 bg-background">
                <option>Last 3 months</option>
                <option>Last 6 months</option>
                <option>Last year</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center text-muted-foreground">
                <Weight className="w-12 h-12 mx-auto mb-4" />
                <p className="font-medium">Weight Progress Chart</p>
                <p className="text-sm">Start tracking to see your progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Body Fat %</CardTitle>
              <select className="text-sm border border-input rounded-md px-2 py-1 bg-background">
                <option>Last 3 months</option>
                <option>Last 6 months</option>
                <option>Last year</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center text-muted-foreground">
                <Percent className="w-12 h-12 mx-auto mb-4" />
                <p className="font-medium">Body Fat % Chart</p>
                <p className="text-sm">Add body fat data to visualize trends</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Measurements */}
      {latestMeasurement && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Weight className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground" data-testid="text-current-weight">
                {latestMeasurement.weight || "-"}
              </div>
              <div className="text-sm text-muted-foreground">kg</div>
              <div className="text-xs text-accent mt-1">Weight</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Percent className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground" data-testid="text-current-body-fat">
                {latestMeasurement.bodyFatPercentage || "-"}
              </div>
              <div className="text-sm text-muted-foreground">% BF</div>
              <div className="text-xs text-accent mt-1">Body Fat</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Ruler className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground" data-testid="text-current-waist">
                {latestMeasurement.waist || "-"}
              </div>
              <div className="text-sm text-muted-foreground">cm</div>
              <div className="text-xs text-accent mt-1">Waist</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <ExpandIcon className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground" data-testid="text-current-chest">
                {latestMeasurement.chest || "-"}
              </div>
              <div className="text-sm text-muted-foreground">cm</div>
              <div className="text-xs text-accent mt-1">Chest</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Flame className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground" data-testid="text-current-bicep">
                {latestMeasurement.bicep || "-"}
              </div>
              <div className="text-sm text-muted-foreground">cm</div>
              <div className="text-xs text-accent mt-1">Bicep</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Activity className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground" data-testid="text-current-thigh">
                {latestMeasurement.thigh || "-"}
              </div>
              <div className="text-sm text-muted-foreground">cm</div>
              <div className="text-xs text-accent mt-1">Thigh</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Measurement History */}
      <Card>
        <CardHeader>
          <CardTitle>Measurement History</CardTitle>
        </CardHeader>
        <CardContent>
          {measurements?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Weight</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Body Fat %</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Waist</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Chest</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {measurements.map((measurement: any) => (
                    <tr 
                      key={measurement.id} 
                      className="border-b border-border hover:bg-muted"
                      data-testid={`measurement-row-${measurement.id}`}
                    >
                      <td className="py-3 px-4 text-foreground">
                        {new Date(measurement.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        {measurement.weight ? `${measurement.weight} kg` : "-"}
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        {measurement.bodyFatPercentage ? `${measurement.bodyFatPercentage}%` : "-"}
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        {measurement.waist ? `${measurement.waist} cm` : "-"}
                      </td>
                      <td className="py-3 px-4 text-foreground">
                        {measurement.chest ? `${measurement.chest} cm` : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-edit-measurement-${measurement.id}`}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMeasurementMutation.mutate(measurement.id)}
                            disabled={deleteMeasurementMutation.isPending}
                            data-testid={`button-delete-measurement-${measurement.id}`}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No measurements yet</h3>
              <p className="mb-4">Start tracking your body measurements to monitor your progress</p>
              <Button 
                onClick={() => setShowMeasurementModal(true)}
                data-testid="button-first-measurement"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Measurement
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <MeasurementModal 
        open={showMeasurementModal} 
        onClose={() => setShowMeasurementModal(false)} 
      />
    </div>
  );
}
