import { useContext } from "react";
import { AppointmentsContext } from "@/contexts/AppointmentsContext";

export function useAppointments() {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error(
      "useAppointments must be used within an AppointmentsProvider",
    );
  }
  return context;
}
