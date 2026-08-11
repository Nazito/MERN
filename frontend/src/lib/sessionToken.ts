import { NEXTAUTH_BASE_PATH } from "@/lib/authBasePath";

let cachedToken: string | null = null;
let cachedAt = 0;
const TOKEN_TTL_MS = 30_000;

/** Keep axios/socket in sync when SessionSync runs */
export function setAccessTokenCache(token: string | null) {
  cachedToken = token;
  cachedAt = Date.now();
}

export function getAccessTokenCache() {
  return cachedToken;
}

export async function resolveAccessToken(): Promise<string | null> {
  if (cachedToken && Date.now() - cachedAt < TOKEN_TTL_MS) {
    return cachedToken;
  }

  if (typeof window === "undefined") {
    return cachedToken;
  }

  try {
    const res = await fetch(`${NEXTAUTH_BASE_PATH}/session`);
    if (!res.ok) {
      setAccessTokenCache(null);
      return null;
    }
    const session = (await res.json()) as { accessToken?: string } | null;
    const token = session?.accessToken ?? null;
    setAccessTokenCache(token);
    return token;
  } catch {
    return cachedToken;
  }
}

export { NEXTAUTH_BASE_PATH };
