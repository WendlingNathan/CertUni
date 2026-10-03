import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth-config';
import { getCurrentUser } from '@/lib/server/auth';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    const response = NextResponse.json(
      { message: 'Sessão inválida ou expirada.' },
      { status: 401 },
    );
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  return NextResponse.json({ user });
}
