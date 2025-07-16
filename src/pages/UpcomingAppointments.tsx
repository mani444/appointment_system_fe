import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar, Clock, User, Edit, Trash2 } from "lucide-react";
import { AppointmentForm } from "@/pages/AppointmentForm";

interface Appointment {
  id: string;
  title: string;
  time: string;
  date: string;
  provider: string;
  type: string;
  clientId?: string;
}

export function UpcomingAppointments() {
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      title: "Wellness Consultation",
      time: "10:00 AM",
      date: "Today",
      provider: "Dr. Sarah Johnson",
      type: "Virtual",
      clientId: "1", // Emma Johnson
    },
    {
      id: "2",
      title: "Nutrition Planning",
      time: "2:30 PM",
      date: "Tomorrow",
      provider: "Lisa Chen, RD",
      type: "In-person",
      clientId: "3", // Sarah Williams
    },
    {
      id: "3",
      title: "Fitness Assessment",
      time: "9:15 AM",
      date: "July 16",
      provider: "Mike Rodriguez",
      type: "Virtual",
      clientId: "5", // Lisa Thompson
    },
  ]);

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentForm(true);
  };

  const handleAddAppointment = () => {
    setSelectedAppointment(null);
    setShowAppointmentForm(true);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your wellness overview.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming Appointments</span>
                </CardTitle>
                <CardDescription>
                  Your scheduled wellness sessions and consultations
                </CardDescription>
              </div>
              <Button onClick={() => handleAddAppointment()}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule New Appointment
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        {appointment.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {appointment.provider}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.time}</span>
                      </div>
                      <p className="text-sm font-medium">{appointment.date}</p>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {appointment.type}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Cancel Appointment
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel this appointment
                              with {appointment.provider}? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              Keep Appointment
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleCancelAppointment(appointment.id)
                              }
                            >
                              Cancel Appointment
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button variant="default" size="sm">
                        Join
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {appointments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">
                    No upcoming appointments
                  </p>
                  <p>Schedule your first wellness session to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AppointmentForm
        open={showAppointmentForm}
        appointment={selectedAppointment}
        onOpenChange={(open) => {
          setShowAppointmentForm(open);
          if (!open) {
            setSelectedAppointment(null);
          }
        }}
      />
    </div>
  );
}
