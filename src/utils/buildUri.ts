import { browser } from '$app/environment';
import { PUBLIC_API_URL } from '$env/static/public';

export default function buildUri(
  pathToResource: string,
  parameters: Record<string, string> = {}
): URL {
  if (browser) {
    const idToken = localStorage.getItem('idToken');
    if (idToken) {
      parameters.idToken = idToken;
    }
  }
  const queryString =
    '?' +
    Object.entries(parameters)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

  // Ensure base URL ends in a single forward slash
  const baseUrl = PUBLIC_API_URL.replace(/\/+$/, '') + '/';
  return new URL(pathToResource + queryString, baseUrl);
}
