// FIX: Removed incorrect import of `AppView` from './components/screens/MainScreen' which was causing a circular dependency.
export type UserRole = 'customer' | 'admin';

export type AppView = 'schedule' | 'appointments' | 'calendar' | 'reports' | 'clients' | 'professionals' | 'services_admin' | 'birthdays' | 'settings_admin' | 'admins' | 'settings_hub';

export interface User {
  id: string;
  name: string;
  birthday: string;
  whatsapp: string;
  email: string;
}

export interface Admin {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  description: string;
  color?: string;
}

export interface Professional {
  id: string;
  name: string;
  avatarUrl: string;
  specialties: string[]; // array of service IDs
}

export interface Appointment {
  id: string;
  service: Service;
  professional: Professional;
  client: User;
  date: Date;
}

export interface AdminSettings {
  openingTime: string; // e.g., "09:00"
  closingTime: string; // e.g., "19:00"
  workingDays: number[]; // 0 for Sunday, 1 for Monday, etc.
}

export type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};