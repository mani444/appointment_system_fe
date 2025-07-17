import axios from "axios";
import type {
  ApiResponse,
  Client,
  CreateClientRequest,
  UpdateClientRequest,
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from "@/types/api";

// Configure axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 5000, // Reduced timeout to fail faster
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      console.warn(
        "Backend API is not available. Make sure the Rails server is running on port 3000.",
      );
    } else if (error.response?.data?.errors) {
      // Backend API returned structured errors
      const backendErrors = error.response.data.errors;
      const errorMessage = Array.isArray(backendErrors) 
        ? backendErrors.join(", ") 
        : backendErrors;
      
      // Create a new error with the backend message
      const enhancedError = new Error(errorMessage);
      enhancedError.name = "BackendError";
      return Promise.reject(enhancedError);
    } else if (error.response?.data?.message) {
      // Backend API returned a single message
      const enhancedError = new Error(error.response.data.message);
      enhancedError.name = "BackendError";
      return Promise.reject(enhancedError);
    }
    return Promise.reject(error);
  },
);

// API Service for Clients
export const clientsApi = {
  // Get all clients
  getAll: async (): Promise<Client[]> => {
    const response = await api.get<ApiResponse<Client[]>>("/clients");
    return response.data.data;
  },

  // Get client by ID
  getById: async (id: number): Promise<Client> => {
    const response = await api.get<ApiResponse<Client>>(`/clients/${id}`);
    return response.data.data;
  },

  // Create new client
  create: async (clientData: CreateClientRequest): Promise<Client> => {
    const response = await api.post<ApiResponse<Client>>("/clients", {
      client: clientData,
    });
    return response.data.data;
  },

  // Update client
  update: async (
    id: number,
    clientData: UpdateClientRequest,
  ): Promise<Client> => {
    const response = await api.put<ApiResponse<Client>>(`/clients/${id}`, {
      client: clientData,
    });
    return response.data.data;
  },

  // Delete client
  delete: async (id: number): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};

// API Service for Appointments
export const appointmentsApi = {
  // Get all appointments
  getAll: async (clientId?: number): Promise<Appointment[]> => {
    const params = clientId ? { client_id: clientId } : {};
    const response = await api.get<ApiResponse<Appointment[]>>(
      "/appointments",
      { params },
    );
    return response.data.data;
  },

  // Get appointment by ID
  getById: async (id: number): Promise<Appointment> => {
    const response = await api.get<ApiResponse<Appointment>>(
      `/appointments/${id}`,
    );
    return response.data.data;
  },

  // Create new appointment
  create: async (
    appointmentData: CreateAppointmentRequest,
  ): Promise<Appointment> => {
    const response = await api.post<ApiResponse<Appointment>>("/appointments", {
      appointment: appointmentData,
    });
    return response.data.data;
  },

  // Update appointment
  update: async (
    id: number,
    appointmentData: UpdateAppointmentRequest,
  ): Promise<Appointment> => {
    const response = await api.put<ApiResponse<Appointment>>(
      `/appointments/${id}`,
      {
        appointment: appointmentData,
      },
    );
    return response.data.data;
  },

  // Delete appointment
  delete: async (id: number): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },
};

// Export the axios instance for custom requests if needed
export { api };
