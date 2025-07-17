import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Plus, Loader2, Clock } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useAppointments } from "@/hooks/useAppointments";
import type { Appointment } from "@/types/api";

const appointmentSchema = z.object({
  client_id: z.string().min(1, "Please select a client"),
  date: z.date({
    message: "Please select a date",
  }),
  time: z.string().min(1, "Please select a time"),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment | null;
}

export function AppointmentForm({
  open,
  onOpenChange,
  appointment,
}: AppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { clients } = useClients();
  const { createAppointment, updateAppointment } = useAppointments();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  useEffect(() => {
    if (appointment) {
      setValue("client_id", appointment.client_id.toString());
      const appointmentDate = new Date(appointment.time);
      setValue("date", appointmentDate);
      setValue("time", appointmentDate.toTimeString().slice(0, 5)); // HH:MM format
    }
  }, [appointment, setValue]);

  const onSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    try {
      // Combine date and time into a single datetime
      const [hours, minutes] = data.time.split(":").map(Number);
      const combinedDateTime = new Date(data.date);
      combinedDateTime.setHours(hours, minutes, 0, 0);

      const appointmentData = {
        client_id: parseInt(data.client_id),
        time: combinedDateTime.toISOString(),
      };

      let result;
      if (appointment) {
        result = await updateAppointment(appointment.id, appointmentData);
      } else {
        result = await createAppointment(appointmentData);
      }

      if (result) {
        reset();
        onOpenChange(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Edit Appointment" : "Schedule New Appointment"}
          </DialogTitle>
          <DialogDescription>
            {appointment
              ? "Update the appointment details."
              : "Create a new appointment for a client."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Select Client</Label>
            <Controller
              name="client_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name} - {client.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.client_id && (
              <p className="text-sm text-red-500">{errors.client_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  date={field.value}
                  onDateChange={field.onChange}
                  placeholder="Select appointment date"
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                {...register("time")}
                disabled={isSubmitting}
                className="flex-1"
              />
            </div>
            {errors.time && (
              <p className="text-sm text-red-500">{errors.time.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {appointment ? "Updating..." : "Scheduling..."}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {appointment ? "Update Appointment" : "Schedule Appointment"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
