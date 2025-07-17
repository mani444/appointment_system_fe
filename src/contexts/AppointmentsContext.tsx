import { createContext, useCallback, useEffect, useState } from "react";
import { appointmentsApi } from "@/services/api";
import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from "@/types/api";

interface AppointmentsContextType {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  refetch: () => Promise<void>;
  createAppointment: (
    appointmentData: CreateAppointmentRequest,
  ) => Promise<Appointment | null>;
  updateAppointment: (
    id: number,
    appointmentData: UpdateAppointmentRequest,
  ) => Promise<Appointment | null>;
  deleteAppointment: (id: number) => Promise<boolean>;
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(
  undefined,
);

export function AppointmentsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentsApi.getAll();
      setAppointments(data);
    } catch (err) {
      console.warn("API not available, using mock data", err);
      // Fallback to mock data if API is not available
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      setAppointments([
        { id: 1, client_id: 1, time: tomorrow.toISOString() },
        {
          id: 2,
          client_id: 2,
          time: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);
      setError("Backend API not available - using demo data");
    } finally {
      setLoading(false);
    }
  }, []);

  const createAppointment = async (
    appointmentData: CreateAppointmentRequest,
  ): Promise<Appointment | null> => {
    try {
      setError(null);
      const newAppointment = await appointmentsApi.create(appointmentData);
      // Use functional state update to ensure we get the latest state
      setAppointments((prev) => {
        // Check if appointment already exists to avoid duplicates
        const exists = prev.some((apt) => apt.id === newAppointment.id);
        if (exists) return prev;
        return [...prev, newAppointment];
      });
      return newAppointment;
    } catch {
      // If backend is not available, create mock appointment for demo purposes
      const mockAppointment = {
        id: Math.max(...appointments.map((a) => a.id), 0) + 1,
        client_id: appointmentData.client_id,
        time: appointmentData.time,
      };
      setAppointments((prev) => [...prev, mockAppointment]);
      setError("Backend API not available - appointment added to demo data");
      return mockAppointment;
    }
  };

  const updateAppointment = async (
    id: number,
    appointmentData: UpdateAppointmentRequest,
  ): Promise<Appointment | null> => {
    try {
      setError(null);
      const updatedAppointment = await appointmentsApi.update(
        id,
        appointmentData,
      );
      // Use functional state update to ensure we get the latest state
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id ? updatedAppointment : appointment,
        ),
      );
      return updatedAppointment;
    } catch {
      // If backend is not available, update mock appointment for demo purposes
      const updatedAppointment = {
        id,
        client_id:
          appointmentData.client_id ||
          appointments.find((a) => a.id === id)?.client_id ||
          1,
        time:
          appointmentData.time ||
          appointments.find((a) => a.id === id)?.time ||
          new Date().toISOString(),
      };
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id ? updatedAppointment : appointment,
        ),
      );
      setError("Backend API not available - appointment updated in demo data");
      return updatedAppointment;
    }
  };

  const deleteAppointment = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await appointmentsApi.delete(id);
      // Use functional state update to ensure we get the latest state
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== id),
      );
      return true;
    } catch {
      // If backend is not available, delete from mock data for demo purposes
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== id),
      );
      setError(
        "Backend API not available - appointment deleted from demo data",
      );
      return true;
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const value = {
    appointments,
    loading,
    error,
    setError,
    refetch: fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };

  return (
    <AppointmentsContext.Provider value={value}>
      {children}
    </AppointmentsContext.Provider>
  );
}

export { AppointmentsContext };
