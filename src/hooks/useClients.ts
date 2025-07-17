import { useContext } from "react";
import { ClientsContext } from "@/contexts/ClientsContext";

export function useClients() {
  const context = useContext(ClientsContext);
  if (context === undefined) {
    throw new Error("useClients must be used within a ClientsProvider");
  }
  return context;
}
