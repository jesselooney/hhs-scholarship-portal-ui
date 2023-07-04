import { isRight } from 'fp-ts/lib/Either';
import type * as t from 'io-ts';

export default async function fetchAndValidate<A, T>(
  fetch: (input: URL | RequestInfo, init?: RequestInit) => Promise<Response>,
  codec: t.Type<A, T, unknown>,
  input: URL | RequestInfo,
  init?: RequestInit
): Promise<A | undefined> {
  const response: unknown = await fetch(input, init)
    .then((r) => r.json())
    .catch(undefined);

  const decoded = codec.decode(response);

  if (isRight(decoded)) {
    return decoded.right;
  } else {
    return undefined;
  }
}
