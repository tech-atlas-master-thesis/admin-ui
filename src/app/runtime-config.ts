import environment from '../environment/environment';
import { EnvironmentInterface } from '../environment/environment.interface';

type AuthSettings = EnvironmentInterface['auth'];

/**
 * Settings that can be changed per deployment without rebuilding the app.
 *
 * They are served as `/config.json`. In the container image that file is written at start-up
 * from the environment variables `OAUTH_ISSUER` and `OAUTH_CLIENT_ID` (see docker-entrypoint.sh).
 * Anything that is missing falls back to the value compiled in from `src/environment`.
 */
export interface RuntimeConfig {
  issuer?: string;
  clientId?: string;
}

const RUNTIME_CONFIG_URL = 'config.json';

let runtimeConfig: RuntimeConfig = {};

function nonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
}

/** Has to complete before the application is bootstrapped. Never rejects. */
export async function loadRuntimeConfig(): Promise<void> {
  runtimeConfig = {};
  try {
    const response = await fetch(RUNTIME_CONFIG_URL, { cache: 'no-store' });
    if (!response.ok) {
      return;
    }
    const config: unknown = await response.json();
    if (typeof config !== 'object' || config === null) {
      return;
    }
    const { issuer, clientId } = config as Record<string, unknown>;
    runtimeConfig = { issuer: nonEmptyString(issuer), clientId: nonEmptyString(clientId) };
  } catch {
    // No or unreadable config.json: keep the compiled-in defaults.
  }
}

export function getAuthSettings(): AuthSettings {
  return {
    ...environment.auth,
    issuer: runtimeConfig.issuer ?? environment.auth.issuer,
    clientId: runtimeConfig.clientId ?? environment.auth.clientId,
  };
}
