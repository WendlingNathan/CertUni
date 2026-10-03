export type UserRole = 'STUDENT' | 'ADMIN';

export interface AuthUser {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
}

interface ApiErrorPayload {
  message?: string | string[];
  error?: string;
}

export function getApiErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') return fallback;

  const error = payload as ApiErrorPayload;
  if (Array.isArray(error.message)) return error.message.join(' ');
  if (typeof error.message === 'string') return error.message;
  if (typeof error.error === 'string') return error.error;

  return fallback;
}
