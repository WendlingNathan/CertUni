import 'server-only';

const DEFAULT_BACKEND_URL = 'https://certuni-api.onrender.com';
const RETRY_DELAYS_MS = [1_000, 2_500];
const TRANSIENT_STATUS_CODES = new Set([502, 503, 504]);

function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export function isBackendUnavailableStatus(status: number) {
  return TRANSIENT_STATUS_CODES.has(status);
}

export function getBackendUrl(path: string) {
  const baseUrl = (process.env.BACKEND_API_URL ?? DEFAULT_BACKEND_URL).replace(
    /\/$/,
    '',
  );
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

export async function fetchBackend(path: string, init: RequestInit = {}) {
  const requestInit: RequestInit = {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      ...init.headers,
    },
  };

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      const response = await fetch(getBackendUrl(path), requestInit);

      if (
        !isBackendUnavailableStatus(response.status) ||
        attempt === RETRY_DELAYS_MS.length
      ) {
        return response;
      }

      await response.body?.cancel();
    } catch (error) {
      if (init.signal?.aborted || attempt === RETRY_DELAYS_MS.length) {
        throw error;
      }
    }

    await wait(RETRY_DELAYS_MS[attempt]);
  }

  throw new Error('O servidor da API não respondeu.');
}
