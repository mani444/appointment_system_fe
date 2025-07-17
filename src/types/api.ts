// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiError {
  success: false;
  errors: string[];
}

// Client Types
export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone: string;
}

export type UpdateClientRequest = Partial<CreateClientRequest>;

// Appointment Types
export interface Appointment {
  id: number;
  client_id: number;
  time: string; // ISO datetime string
}

export interface CreateAppointmentRequest {
  client_id: number;
  time: string; // ISO datetime string
}

export type UpdateAppointmentRequest = Partial<CreateAppointmentRequest>;
