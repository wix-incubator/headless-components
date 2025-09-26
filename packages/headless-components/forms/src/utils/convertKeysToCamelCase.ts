import camelCase from 'lodash.camelcase';
import mapKeys from 'lodash.mapkeys';

/**
 * Deeply converts all object keys from snake_case to camelCase
 * @param obj - The object to convert
 * @returns The object with all nested keys converted to camelCase
 */
export function convertKeysToCamelCase<T = unknown>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase) as T;
  }

  if (obj !== null && typeof obj === 'object') {
    const converted = mapKeys(obj as Record<string, unknown>, (_, key) =>
      camelCase(key),
    );

    return Object.fromEntries(
      Object.entries(converted).map(([key, value]) => [
        key,
        convertKeysToCamelCase(value),
      ]),
    ) as T;
  }

  return obj;
}
