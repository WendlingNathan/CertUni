import { NextResponse } from 'next/server';
import { fetchBackend } from '@/lib/server/backend';

export async function GET(
  _request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;

  try {
    const upstream = await fetchBackend(
      `/certificates/validate/${encodeURIComponent(code)}`,
    );
    const data = await upstream.json().catch(() => null);
    return NextResponse.json(data ?? {}, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { message: 'O serviço de validação está indisponível.' },
      { status: 503 },
    );
  }
}
