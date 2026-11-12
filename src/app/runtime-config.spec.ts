import { afterEach, describe, expect, it, vi } from 'vitest';
import environment from '../environment/environment';
import { getAuthSettings, loadRuntimeConfig } from './runtime-config';

function mockConfigResponse(body: string, ok = true) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ ok, json: async () => JSON.parse(body) })),
  );
}

describe('runtime config', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('overrides issuer and client id from config.json', async () => {
    mockConfigResponse('{"issuer":"https://auth.example.org/application/o/app/","clientId":"abc"}');
    await loadRuntimeConfig();
    expect(getAuthSettings()).toEqual({
      ...environment.auth,
      issuer: 'https://auth.example.org/application/o/app/',
      clientId: 'abc',
    });
  });

  it('keeps the compiled-in value for anything config.json does not set', async () => {
    mockConfigResponse('{"issuer":"https://auth.example.org/"}');
    await loadRuntimeConfig();
    expect(getAuthSettings().issuer).toBe('https://auth.example.org/');
    expect(getAuthSettings().clientId).toBe(environment.auth.clientId);
  });

  it.each([
    ['an empty object', '{}'],
    ['empty values', '{"issuer":"","clientId":"  "}'],
    ['values of the wrong type', '{"issuer":42,"clientId":null}'],
    ['something that is not an object', '"nope"'],
    ['invalid JSON', '<!doctype html>'],
  ])('falls back to the compiled-in settings for %s', async (_, body) => {
    mockConfigResponse(body);
    await loadRuntimeConfig();
    expect(getAuthSettings()).toEqual(environment.auth);
  });

  it('falls back to the compiled-in settings when config.json is missing', async () => {
    mockConfigResponse('{"issuer":"https://ignored.example.org/"}', false);
    await loadRuntimeConfig();
    expect(getAuthSettings()).toEqual(environment.auth);
  });

  it('falls back to the compiled-in settings when the request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('network error');
      }),
    );
    await loadRuntimeConfig();
    expect(getAuthSettings()).toEqual(environment.auth);
  });
});
