import 'server-only';

const DEFAULT_BACKEND_URL = 'http://localhost:3000';

export function getBackendUrl(path: string) {
  const baseUrl = (process.env.BACKEND_API_URL ?? DEFAULT_BACKEND_URL).replace(
    /\/$/,
    '',
  );
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

export async function fetchBackend(path: string, init: RequestInit = {}) {
  return fetch(getBackendUrl(path), {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      ...init.headers,
    },
  });
}
