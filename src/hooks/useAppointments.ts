import { useState, useEffect, useCallback } from "react";
import { appointmentsApi } from "@/services/api";
import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from "@/types/api";

export function useAppointments(clientId?: number) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentsApi.getAll(clientId);
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
  }, [clientId]);

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
      setError(
        err instanceof Error ? err.message : "Failed to create appointment",
      );
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
      setError(
        err instanceof Error ? err.message : "Failed to update appointment",
      );
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
      setError(
        err instanceof Error ? err.message : "Failed to delete appointment",
      );
      return false;
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
}
