import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE_NAME } from '@/lib/auth-config';
import type { AuthUser } from '@/lib/auth-types';
import { fetchBackend } from '@/lib/server/backend';

interface BackendSessionUser {
  id?: string;
  sub?: string;
  name?: string;
  email: string;
  role: AuthUser['role'];
}

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const response = await fetchBackend('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return null;

    const user = (await response.json()) as BackendSessionUser;
    const id = user.id ?? user.sub;
    if (!id || !user.email || !user.role) return null;

    return {
      id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch {
    return null;
  }
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}
