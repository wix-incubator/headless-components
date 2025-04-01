import { sha256 } from './sha256.js';

export function pkceChallenge(length?: number): {
  code_verifier: string;
  code_challenge: string;
} {
  if (!length) {
    length = 43;
  }

  if (length < 43 || length > 128) {
    throw new Error(
      `Expected a length between 43 and 128. Received ${length}.`,
    );
  }

  const verifier = generateVerifier(length);
  const challenge = generateChallenge(verifier);

  return {
    code_verifier: verifier,
    code_challenge: challenge,
  };
}

function generateVerifier(length: number): string {
  return random(length);
}

export function generateChallenge(code_verifier: string) {
  return base64urlencode(sha256(code_verifier));
}

function random(size: number) {
  const mask =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~';
  let result = '';
  const randomUints = crypto.getRandomValues(new Uint8Array(size));
  for (let i = 0; i < size; i++) {
    // cap the value of the randomIndex to mask.length - 1
    // @ts-expect-error
    const randomIndex = randomUints[i] % mask.length;
    result += mask[randomIndex];
  }
  return result;
}

function base64urlencode(str: ArrayBuffer) {
  const base64 =
    typeof Buffer === 'undefined'
      ? btoa(ab2str(str))
      : Buffer.from(str).toString('base64');

  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function ab2str(buf: ArrayBuffer) {
  return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
}
