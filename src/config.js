const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
};

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const env = import.meta.env;

export const appConfig = Object.freeze({
  apiBaseUrl: String(env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1').replace(/\/$/, ''),
  apiTimeoutMs: parseNumber(env.VITE_API_TIMEOUT_MS, 10000),
  remoteDemoCredentials: {
    admin: {
      email: String(env.VITE_REMOTE_ADMIN_EMAIL ?? ''),
      password: String(env.VITE_REMOTE_ADMIN_PASSWORD ?? ''),
    },
    customer: {
      email: String(env.VITE_REMOTE_CUSTOMER_EMAIL ?? ''),
      password: String(env.VITE_REMOTE_CUSTOMER_PASSWORD ?? ''),
    },
    guestToken: String(env.VITE_REMOTE_GUEST_TOKEN ?? ''),
  },
  showRemoteDemoCredentials: parseBoolean(env.VITE_SHOW_REMOTE_DEMO_CREDENTIALS, false),
  useRemoteApi: parseBoolean(env.VITE_USE_REMOTE_API, false),
});
