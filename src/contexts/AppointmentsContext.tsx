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
      setAppointments([]);
      setError("Backend API not available");
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
    } catch (err) {
      // No fallback - API must be available
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create appointment";
      setError(errorMessage);
      return null;
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
    } catch (err) {
      // No fallback - API must be available
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update appointment";
      setError(errorMessage);
      return null;
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
    } catch (err) {
      // No fallback - API must be available
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete appointment";
      setError(errorMessage);
      return false;
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
