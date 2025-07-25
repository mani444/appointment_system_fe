import { createContext, useCallback, useEffect, useState } from "react";
import { clientsApi } from "@/services/api";
import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
} from "@/types/api";

interface ClientsContextType {
  clients: Client[];
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  refetch: () => Promise<void>;
  createClient: (clientData: CreateClientRequest) => Promise<Client | null>;
  updateClient: (
    id: number,
    clientData: UpdateClientRequest,
  ) => Promise<Client | null>;
  deleteClient: (id: number) => Promise<boolean>;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

export function ClientsProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientsApi.getAll();
      setClients(data);
    } catch (err) {
      console.warn("API not available, using mock data", err);
      // Fallback to mock data if API is not available
      setClients([]);
      setError("Backend API not available");
    } finally {
      setLoading(false);
    }
  }, []);

  const createClient = async (
    clientData: CreateClientRequest,
  ): Promise<Client | null> => {
    try {
      setError(null);

      // Client-side duplicate check for immediate feedback
      const existingClient = clients.find(
        (client) =>
          client.email.toLowerCase() === clientData.email.toLowerCase(),
      );

      if (existingClient) {
        const duplicateError = `A client with email "${clientData.email}" already exists`;
        setError(duplicateError);
        return null;
      }

      const newClient = await clientsApi.create(clientData);
      setClients((prev) => {
        // Prevent duplicate entries from race conditions
        const exists = prev.some((client) => client.id === newClient.id);
        if (exists) return prev;
        return [...prev, newClient];
      });
      return newClient;
    } catch (err) {
      // Handle API errors, fallback to mock data creation
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create client";

      // Check if it's a duplicate email error from the server
      if (
        errorMessage.toLowerCase().includes("email") &&
        (errorMessage.toLowerCase().includes("taken") ||
          errorMessage.toLowerCase().includes("exists") ||
          errorMessage.toLowerCase().includes("duplicate"))
      ) {
        setError(`A client with email "${clientData.email}" already exists`);
      } else {
        // No fallback - API must be available
        setError(errorMessage);
      }
      return null;
    }
  };

  const updateClient = async (
    id: number,
    clientData: UpdateClientRequest,
  ): Promise<Client | null> => {
    try {
      setError(null);

      // Check for duplicate email in existing clients (excluding the current client)
      if (clientData.email) {
        const existingClient = clients.find(
          (client) =>
            client.id !== id &&
            client.email.toLowerCase() === clientData.email!.toLowerCase(),
        );

        if (existingClient) {
          const duplicateError = `A client with email "${clientData.email}" already exists`;
          setError(duplicateError);
          return null;
        }
      }

      const updatedClient = await clientsApi.update(id, clientData);
      // Use functional state update to ensure we get the latest state
      setClients((prev) =>
        prev.map((client) => (client.id === id ? updatedClient : client)),
      );
      return updatedClient;
    } catch (err) {
      // Handle API errors (including server-side duplicate validation)
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update client";

      // Check if it's a duplicate email error from the server
      if (
        clientData.email &&
        errorMessage.toLowerCase().includes("email") &&
        (errorMessage.toLowerCase().includes("taken") ||
          errorMessage.toLowerCase().includes("exists") ||
          errorMessage.toLowerCase().includes("duplicate"))
      ) {
        setError(`A client with email "${clientData.email}" already exists`);
      } else {
        // No fallback - API must be available
        setError(errorMessage);
      }
      return null;
    }
  };

  const deleteClient = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await clientsApi.delete(id);
      // Use functional state update to ensure we get the latest state
      setClients((prev) => prev.filter((client) => client.id !== id));
      return true;
    } catch (err) {
      // No fallback - API must be available
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete client";
      setError(errorMessage);
      return false;
    }
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const value = {
    clients,
    loading,
    error,
    setError,
    refetch: fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };

  return (
    <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>
  );
}

export { ClientsContext };
