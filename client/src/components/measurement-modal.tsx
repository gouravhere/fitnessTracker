import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const measurementSchema = z.object({
  date: z.string().min(1, "Date is required"),
  weight: z.coerce.number().min(1).optional(),
  bodyFatPercentage: z.coerce.number().min(0).max(100).optional(),
  muscleMass: z.coerce.number().min(0).optional(),
  waist: z.coerce.number().min(0).optional(),
  chest: z.coerce.number().min(0).optional(),
  bicep: z.coerce.number().min(0).optional(),
  thigh: z.coerce.number().min(0).optional(),
  height: z.coerce.number().min(0).optional(),
});

type MeasurementForm = z.infer<typeof measurementSchema>;

interface MeasurementModalProps {
  open: boolean;
  onClose: () => void;
}

export function MeasurementModal({ open, onClose }: MeasurementModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MeasurementForm>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      weight: undefined,
      bodyFatPercentage: undefined,
      muscleMass: undefined,
      waist: undefined,
      chest: undefined,
      bicep: undefined,
      thigh: undefined,
      height: undefined,
    },
  });

  const createMeasurementMutation = useMutation({
    mutationFn: async (data: MeasurementForm) => {
      // Filter out undefined values
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined && value !== "")
      );
      
      const measurementData = {
        ...cleanData,
        date: new Date(data.date),
      };
      
      const response = await apiRequest("POST", "/api/measurements", measurementData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/measurements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Measurement added!",
        description: "Your body measurement has been successfully recorded.",
      });
      form.reset();
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add measurement. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MeasurementForm) => {
    createMeasurementMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Body Measurement</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...form.register("date")}
              data-testid="input-measurement-date"
            />
            {form.formState.errors.date && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.date.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="75.5"
                {...form.register("weight")}
                data-testid="input-measurement-weight"
              />
            </div>

            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                placeholder="175"
                {...form.register("height")}
                data-testid="input-measurement-height"
              />
            </div>

            <div>
              <Label htmlFor="bodyFatPercentage">Body Fat (%)</Label>
              <Input
                id="bodyFatPercentage"
                type="number"
                step="0.1"
                placeholder="15.5"
                {...form.register("bodyFatPercentage")}
                data-testid="input-measurement-body-fat"
              />
            </div>

            <div>
              <Label htmlFor="muscleMass">Muscle Mass (kg)</Label>
              <Input
                id="muscleMass"
                type="number"
                step="0.1"
                placeholder="45.2"
                {...form.register("muscleMass")}
                data-testid="input-measurement-muscle-mass"
              />
            </div>

            <div>
              <Label htmlFor="waist">Waist (cm)</Label>
              <Input
                id="waist"
                type="number"
                step="0.1"
                placeholder="80"
                {...form.register("waist")}
                data-testid="input-measurement-waist"
              />
            </div>

            <div>
              <Label htmlFor="chest">Chest (cm)</Label>
              <Input
                id="chest"
                type="number"
                step="0.1"
                placeholder="95"
                {...form.register("chest")}
                data-testid="input-measurement-chest"
              />
            </div>

            <div>
              <Label htmlFor="bicep">Bicep (cm)</Label>
              <Input
                id="bicep"
                type="number"
                step="0.1"
                placeholder="35"
                {...form.register("bicep")}
                data-testid="input-measurement-bicep"
              />
            </div>

            <div>
              <Label htmlFor="thigh">Thigh (cm)</Label>
              <Input
                id="thigh"
                type="number"
                step="0.1"
                placeholder="55"
                {...form.register("thigh")}
                data-testid="input-measurement-thigh"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-testid="button-cancel-measurement"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMeasurementMutation.isPending}
              data-testid="button-save-measurement"
            >
              {createMeasurementMutation.isPending ? "Saving..." : "Save Measurement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
