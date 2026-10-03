import { NextResponse } from 'next/server';
import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIE_NAME } from '@/lib/auth-config';
import type { AuthUser } from '@/lib/auth-types';
import { fetchBackend } from '@/lib/server/backend';

interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };

    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: 'E-mail e senha são obrigatórios.' },
        { status: 400 },
      );
    }

    const upstream = await fetchBackend('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: body.email, password: body.password }),
    });
    const data = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      return NextResponse.json(data ?? { message: 'Falha ao autenticar.' }, {
        status: upstream.status,
      });
    }

    const { access_token: accessToken, user } = data as LoginResponse;
    if (!accessToken || !user) {
      return NextResponse.json(
        { message: 'Resposta de autenticação inválida.' },
        { status: 502 },
      );
    }

    const response = NextResponse.json({ user });
    response.cookies.set(AUTH_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: AUTH_COOKIE_MAX_AGE,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: 'Não foi possível conectar ao servidor de autenticação.' },
      { status: 503 },
    );
  }
}
