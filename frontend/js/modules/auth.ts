import { apiRequest } from './api';

export interface UserSession {
  user_id: number;
  username: string;
}

export interface AuthStatus {
  logged_in: boolean;
  user_id: number | null;
  username: string | null;
}

let currentUser: UserSession | null = null;

export async function registerUser(username: string, password: string): Promise<UserSession> {
  const user = await apiRequest<UserSession>('auth_register', {
    method: 'POST',
    payload: { username, password },
  });
  currentUser = user;
  return user;
}

export async function loginUser(username: string, password: string): Promise<UserSession> {
  const user = await apiRequest<UserSession>('auth_login', {
    method: 'POST',
    payload: { username, password },
  });
  currentUser = user;
  return user;
}

export async function getAuthStatus(): Promise<AuthStatus> {
  return apiRequest<AuthStatus>('auth_status');
}

export async function logoutUser(): Promise<void> {
  await apiRequest('auth_logout', { method: 'POST' });
  currentUser = null;
}

export function getCurrentUser(): UserSession | null {
  return currentUser;
}

export function setCurrentUser(user: UserSession | null): void {
  currentUser = user;
}

export function isAuthenticated(): boolean {
  return currentUser !== null;
}
