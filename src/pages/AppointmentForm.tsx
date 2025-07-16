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
import { Textarea } from "@/components/ui/textarea";
import { Plus, User } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

interface AppointmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: {
    id: string;
    title: string;
    time: string;
    date: string;
    provider: string;
    type: string;
    clientId?: string;
  } | null;
}

export function AppointmentForm({
  open,
  onOpenChange,
  appointment,
}: AppointmentFormProps) {
  // Mock client data (same as in Clients.tsx)
  const clients: Client[] = [
    {
      id: "1",
      name: "Emma Johnson",
      email: "emma.johnson@email.com",
      phoneNumber: "+1 (555) 123-4567",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phoneNumber: "+1 (555) 234-5678",
    },
    {
      id: "3",
      name: "Sarah Williams",
      email: "sarah.williams@email.com",
      phoneNumber: "+1 (555) 345-6789",
    },
    {
      id: "4",
      name: "David Rodriguez",
      email: "david.rodriguez@email.com",
      phoneNumber: "+1 (555) 456-7890",
    },
    {
      id: "5",
      name: "Lisa Thompson",
      email: "lisa.thompson@email.com",
      phoneNumber: "+1 (555) 567-8901",
    },
    {
      id: "6",
      name: "James Anderson",
      email: "james.anderson@email.com",
      phoneNumber: "+1 (555) 678-9012",
    },
  ];

  const getAppointmentTypeValue = (title: string) => {
    switch (title) {
      case "Wellness Consultation":
        return "wellness";
      case "Nutrition Planning":
        return "nutrition";
      case "Fitness Assessment":
        return "fitness";
      case "Mental Health Session":
        return "mental";
      default:
        return undefined;
    }
  };

  const getProviderValue = (provider: string) => {
    switch (provider) {
      case "Dr. Sarah Johnson":
        return "sarah";
      case "Lisa Chen, RD":
        return "lisa";
      case "Mike Rodriguez":
        return "mike";
      case "Dr. Anna Smith":
        return "anna";
      default:
        return undefined;
    }
  };

  const getSessionTypeValue = (type: string) => {
    return type.toLowerCase();
  };

  const convertDateToInput = (date: string) => {
    // Convert display dates like "Today", "Tomorrow", "July 16" to input format
    if (date === "Today") {
      return new Date().toISOString().split("T")[0];
    } else if (date === "Tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    } else if (date.includes("July")) {
      // For "July 16" format, use current year
      const year = new Date().getFullYear();
      const day = date.split(" ")[1];
      return `${year}-07-${day.padStart(2, "0")}`;
    }
    return undefined;
  };

  const convertTimeToInput = (time: string) => {
    // Convert "10:00 AM" to "10:00" format
    const [timePart, period] = time.split(" ");
    const [hours, minutes] = timePart.split(":");
    let hour24 = parseInt(hours);

    if (period === "PM" && hour24 !== 12) {
      hour24 += 12;
    } else if (period === "AM" && hour24 === 12) {
      hour24 = 0;
    }

    return `${hour24.toString().padStart(2, "0")}:${minutes}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Appointment scheduled");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Edit Appointment" : "Schedule New Appointment"}
          </DialogTitle>
          <DialogDescription>
            {appointment
              ? "Update the details for your appointment."
              : "Fill in the details to schedule a new wellness appointment."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Appointment Type</Label>
            <Select
              defaultValue={
                appointment
                  ? getAppointmentTypeValue(appointment.title)
                  : undefined
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wellness">Wellness Consultation</SelectItem>
                <SelectItem value="nutrition">Nutrition Planning</SelectItem>
                <SelectItem value="fitness">Fitness Assessment</SelectItem>
                <SelectItem value="mental">Mental Health Session</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Client</span>
            </Label>
            <Select defaultValue={appointment?.clientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{client.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {client.email}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">Provider</Label>
            <Select
              defaultValue={
                appointment ? getProviderValue(appointment.provider) : undefined
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sarah">Dr. Sarah Johnson</SelectItem>
                <SelectItem value="lisa">Lisa Chen, RD</SelectItem>
                <SelectItem value="mike">Mike Rodriguez</SelectItem>
                <SelectItem value="anna">Dr. Anna Smith</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                id="date"
                defaultValue={
                  appointment ? convertDateToInput(appointment.date) : undefined
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                type="time"
                id="time"
                defaultValue={
                  appointment ? convertTimeToInput(appointment.time) : undefined
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Session Type</Label>
            <Select
              defaultValue={
                appointment ? getSessionTypeValue(appointment.type) : undefined
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="in-person">In-person</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes or requirements..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              {appointment ? "Update Appointment" : "Schedule Appointment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
