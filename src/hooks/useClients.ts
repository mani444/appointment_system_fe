import { useState, useEffect } from "react";
import { clientsApi } from "@/services/api";
import type {
  Client,
  CreateClientRequest,
  UpdateClientRequest,
} from "@/types/api";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
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
  };

  const createClient = async (
    clientData: CreateClientRequest,
  ): Promise<Client | null> => {
    try {
      setError(null);
      const newClient = await clientsApi.create(clientData);
      setClients((prev) => [...prev, newClient]);
      return newClient;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create client");
      return null;
    }
  };

  const updateClient = async (
    id: number,
    clientData: UpdateClientRequest,
  ): Promise<Client | null> => {
    try {
      setError(null);
      const updatedClient = await clientsApi.update(id, clientData);
      setClients((prev) =>
        prev.map((client) => (client.id === id ? updatedClient : client)),
      );
      return updatedClient;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update client");
      return null;
    }
  };

  const deleteClient = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await clientsApi.delete(id);
      setClients((prev) => prev.filter((client) => client.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete client");
      return false;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    error,
    refetch: fetchClients,
    createClient,
    updateClient,
    deleteClient,
  };
}
