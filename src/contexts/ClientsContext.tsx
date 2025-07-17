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
      setClients([
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "+1-555-0123",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+1-555-0456",
        },
        {
          id: 3,
          name: "Bob Johnson",
          email: "bob@example.com",
          phone: "+1-555-0789",
        },
      ]);
      setError("Backend API not available - using demo data");
    } finally {
      setLoading(false);
    }
  }, []);

  const createClient = async (
    clientData: CreateClientRequest,
  ): Promise<Client | null> => {
    try {
      setError(null);

      // Check for duplicate email in existing clients
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
      // Use functional state update to ensure we get the latest state
      setClients((prev) => {
        // Check if client already exists to avoid duplicates
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
        // If backend is not available, create mock client for demo purposes
        const mockClient = {
          id: Math.max(...clients.map((c) => c.id), 0) + 1,
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
        };
        setClients((prev) => [...prev, mockClient]);
        setError("Backend API not available - client added to demo data");
        return mockClient;
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
        // If backend is not available, update mock client for demo purposes
        const updatedClient = {
          id,
          name: clientData.name || clients.find((c) => c.id === id)?.name || "",
          email:
            clientData.email || clients.find((c) => c.id === id)?.email || "",
          phone:
            clientData.phone || clients.find((c) => c.id === id)?.phone || "",
        };
        setClients((prev) =>
          prev.map((client) => (client.id === id ? updatedClient : client)),
        );
        setError("Backend API not available - client updated in demo data");
        return updatedClient;
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
    } catch {
      // If backend is not available, delete from mock data for demo purposes
      setClients((prev) => prev.filter((client) => client.id !== id));
      setError("Backend API not available - client deleted from demo data");
      return true;
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
