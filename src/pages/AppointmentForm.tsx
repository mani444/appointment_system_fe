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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Plus,
  Loader2,
  Clock,
  Search,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useAppointments } from "@/hooks/useAppointments";
import type { Appointment } from "@/types/api";
import { cn } from "@/lib/utils";

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
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [clientPopoverOpen, setClientPopoverOpen] = useState(false);
  const { clients, refetch: refetchClients } = useClients();
  const {
    createAppointment,
    updateAppointment,
    error,
    setError,
    refetch: refetchAppointments,
  } = useAppointments();

  // Filter clients based on search term
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
      client.phone.includes(clientSearchTerm),
  );

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
    setError(null); // Clear any existing errors
    try {
      // Convert separate date and time inputs to ISO datetime string
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
        // Refresh data from server to ensure we have the latest state
        await Promise.all([refetchAppointments(), refetchClients()]);

        reset();
        onOpenChange(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setClientSearchTerm("");
    setClientPopoverOpen(false);
    onOpenChange(false);
  };

  // Clear error when user starts interacting with the form
  const clearErrorOnChange = () => {
    if (error) {
      setError(null);
    }
  };

  // Get selected client display name
  const getSelectedClientName = (clientId: string) => {
    const client = clients.find((c) => c.id.toString() === clientId);
    return client ? client.name : "Choose a client";
  };

  // Handle client selection
  const handleClientSelect = (
    clientId: string,
    onChange: (value: string) => void,
  ) => {
    onChange(clientId);
    setClientPopoverOpen(false);
    setClientSearchTerm("");
    clearErrorOnChange();
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

        {/* Display backend errors */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Select Client</Label>
            <Controller
              name="client_id"
              control={control}
              render={({ field }) => (
                <Popover
                  open={clientPopoverOpen}
                  onOpenChange={setClientPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={clientPopoverOpen}
                      className="w-full justify-between"
                    >
                      {getSelectedClientName(field.value)}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <div className="p-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search clients by name, email, or phone..."
                          value={clientSearchTerm}
                          onChange={(e) => setClientSearchTerm(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredClients.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          {clientSearchTerm
                            ? `No clients found matching "${clientSearchTerm}"`
                            : "No clients available"}
                        </div>
                      ) : (
                        filteredClients.map((client) => (
                          <div
                            key={client.id}
                            className={cn(
                              "flex items-center px-4 py-2 hover:bg-accent cursor-pointer",
                              field.value === client.id.toString() &&
                                "bg-accent",
                            )}
                            onClick={() =>
                              handleClientSelect(
                                client.id.toString(),
                                field.onChange,
                              )
                            }
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === client.id.toString()
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <div className="flex-1">
                              <div className="font-medium">{client.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {client.email}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
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
                  onDateChange={(date) => {
                    field.onChange(date);
                    clearErrorOnChange();
                  }}
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
                onChange={(e) => {
                  register("time").onChange(e);
                  clearErrorOnChange();
                }}
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
