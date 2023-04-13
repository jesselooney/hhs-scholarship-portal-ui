import { browser } from '$app/environment';
import { PUBLIC_AUTH_REDIRECT_URI } from '$env/static/public';
import { publicKey } from '../crypto';
import type { LayoutLoad } from './$types';
import * as jose from 'jose';

export const load = (async ({ url }) => {
  handleAuthorization(url);
}) satisfies LayoutLoad;

/**
 * Load and verify JWT ID tokens from URL query and localStorage,
 * save the one with the latest expiration date, and redirect to
 * authentication site if neither is valid.
 *
 * @param url The URL to be checked for a JWT
 */
const handleAuthorization = async (url: URL) => {
  // Only run this function in the browser.
  if (!browser) return;

  const idTokenFromQuery = url.searchParams.get('idToken') ?? '';
  const idTokenFromLocalStorage = localStorage.getItem('idToken') ?? '';

  // Await both validations asynchronously,
  // and catch errors by returning null.
  const [verifyResultFromQuery, verifyResultFromLocalStorage] = await Promise.all(
    [
      jose.jwtVerify(idTokenFromQuery, publicKey),
      jose.jwtVerify(idTokenFromLocalStorage, publicKey)
    ].map((promise) => promise.catch(() => null))
  );

  if (verifyResultFromQuery === null && verifyResultFromLocalStorage === null)
    window.location.href = PUBLIC_AUTH_REDIRECT_URI;

  const expFromQuery = verifyResultFromQuery?.payload.exp ?? 0;
  const expFromLocalStorage = verifyResultFromLocalStorage?.payload.exp ?? 0;

  // TODO this doesnt work for tokens without exp's
  if (expFromQuery > expFromLocalStorage) {
    // idTokenFromQuery expires later, so keep it
    // instead of the current idTokenFromLocalStorage.
    localStorage.setItem('idToken', idTokenFromQuery);
  }
};
