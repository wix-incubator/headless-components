/**
 * Utility class for managing URL parameters in web applications.
 * Provides methods to parse, update, and retrieve URL search parameters with support for multiple values.
 *
 * @class URLParamsUtils
 */
export class URLParamsUtils {
  /**
   * Parses URLSearchParams into a more convenient format that supports multiple values for the same key.
   * Converts multiple parameters with the same key into an array.
   *
   * @static
   * @param {URLSearchParams} searchParams - The URLSearchParams object to parse
   * @returns {Record<string, string | string[]>} Object with parameter names as keys and values as strings or arrays
   *
   * @example
   * ```typescript
   * // URL: ?color=red&color=blue&size=large
   * const params = new URLSearchParams('color=red&color=blue&size=large');
   * const parsed = URLParamsUtils.parseSearchParams(params);
   * // Result: { color: ['red', 'blue'], size: 'large' }
   * ```
   */
  static parseSearchParams(searchParams: URLSearchParams) {
    const params: Record<string, string | string[]> = {};

    // Parse all parameters
    for (const [key, value] of searchParams.entries()) {
      if (params[key]) {
        // Convert to array if multiple values
        if (Array.isArray(params[key])) {
          (params[key] as string[]).push(value);
        } else {
          params[key] = [params[key] as string, value];
        }
      } else {
        params[key] = value;
      }
    }

    return params;
  }

  /**
   * Updates the current page URL with new parameters without causing a page reload.
   * Supports multiple values for the same parameter key.
   *
   * @static
   * @param {Record<string, string | string[]>} params - Object with parameter names and values to set
   *
   * @example
   * ```typescript
   * // Update URL with single and multiple values
   * URLParamsUtils.updateURL({
   *   category: 'electronics',
   *   color: ['red', 'blue'],
   *   price: '100'
   * });
   * // URL becomes: ?category=electronics&color=red&color=blue&price=100
   * ```
   *
   * @example
   * ```typescript
   * // Clear all parameters by passing empty object
   * URLParamsUtils.updateURL({});
   * // URL becomes: current-path (no query string)
   * ```
   */
  static updateURL(params: Record<string, string | string[]>) {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams();

    // Add all parameters
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => urlParams.append(key, v));
      } else if (value) {
        urlParams.set(key, value);
      }
    });

    // Update URL without page reload
    const newURL = urlParams.toString()
      ? `${url.pathname}?${urlParams.toString()}`
      : url.pathname;

    window.history.replaceState({}, '', newURL);
  }

  /**
   * Gets the current URL parameters parsed into a convenient format.
   * Returns an empty object when running in server-side environment.
   *
   * @static
   * @returns {Record<string, string | string[]>} Object with current URL parameters
   *
   * @example
   * ```typescript
   * // Current URL: ?category=electronics&color=red&color=blue
   * const params = URLParamsUtils.getURLParams();
   * // Result: { category: 'electronics', color: ['red', 'blue'] }
   * ```
   *
   * @example
   * ```typescript
   * // Server-side usage
   * const params = URLParamsUtils.getURLParams();
   * // Result: {} (empty object)
   * ```
   */
  static getURLParams(): Record<string, string | string[]> {
    if (typeof window === 'undefined') return {};
    return this.parseSearchParams(new URLSearchParams(window.location.search));
  }
}
