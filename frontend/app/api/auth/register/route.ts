import { NextResponse } from 'next/server';
import {
  fetchBackend,
  isBackendUnavailableStatus,
} from '@/lib/server/backend';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    const upstream = await fetchBackend('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        password: body.password,
      }),
    });
    const data = await upstream.json().catch(() => null);

    if (isBackendUnavailableStatus(upstream.status)) {
      return NextResponse.json(
        {
          message:
            'O servidor está iniciando. Aguarde alguns segundos e tente novamente.',
        },
        { status: 503 },
      );
    }

    return NextResponse.json(data ?? {}, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { message: 'Não foi possível conectar ao servidor de cadastro.' },
      { status: 503 },
    );
  }
}
