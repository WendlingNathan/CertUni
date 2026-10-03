import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth-config';
import { getBackendUrl } from '@/lib/server/backend';

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

async function forward(request: NextRequest, context: RouteContext) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json(
      { message: 'Autenticação necessária.' },
      { status: 401 },
    );
  }

  const { path } = await context.params;
  const headers = new Headers();
  headers.set('Accept', request.headers.get('accept') ?? 'application/json');
  headers.set('Authorization', `Bearer ${token}`);

  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);

  try {
    const upstream = await fetch(
      `${getBackendUrl(path.join('/'))}${request.nextUrl.search}`,
      {
        method: request.method,
        headers,
        body:
          request.method === 'GET' || request.method === 'HEAD'
            ? undefined
            : await request.arrayBuffer(),
        cache: 'no-store',
      },
    );

    const responseHeaders = new Headers();
    const upstreamContentType = upstream.headers.get('content-type');
    const contentDisposition = upstream.headers.get('content-disposition');
    if (upstreamContentType) {
      responseHeaders.set('Content-Type', upstreamContentType);
    }
    if (contentDisposition) {
      responseHeaders.set('Content-Disposition', contentDisposition);
    }

    const response = new NextResponse(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
    if (upstream.status === 401) response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  } catch {
    return NextResponse.json(
      { message: 'O serviço da API está indisponível.' },
      { status: 503 },
    );
  }
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
