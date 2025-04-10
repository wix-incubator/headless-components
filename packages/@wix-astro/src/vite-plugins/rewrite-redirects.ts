import type { Plugin } from 'vite';
import MagicString from 'magic-string';

/**
 * Vite plugin to wrap the `createRedirectSession` function from '@wix/redirects'
 * with specific custom logic (including helper functions), excluding certain files.
 * Uses Regex detection + MagicString modification.
 * Written in TypeScript.
 *
 * @returns {Plugin} The Vite plugin object.
 */
export function wrapWixRedirectsSimplePlugin(): Plugin {
  // Regex to find the entire import statement for @wix/redirects, capturing the content inside {}
  const IMPORT_LINE_REGEX = /import\s*\{([\s\S]*?)\}\s*from\s*['"]@wix\/redirects['"];?/g;
  // Regex to find 'redirects' or 'redirects as alias' within the captured brace content
  const REDIRECTS_NAME_REGEX = /\bredirects(?:\s+as\s+(\w+))?/; // Make outer group non-capturing

  return {
    name: 'vite-plugin-wrap-wix-redirects-injected-logic-ts',

    transform(code: string, id: string) {
      // --- Exclude our injected client script ---
      const normalizedId = id.replace(/\\/g, '/');
      if (normalizedId.includes('astro:scripts/page.js') && code.includes('preWarmRedirectSession')) {
        return undefined;
      }

      // Basic file type check and exclude node_modules and the package itself
      if (!/\.(js|jsx|ts|tsx)$/.test(id) || id.includes('node_modules') || id.includes('@wix/redirects')) {
        return undefined;
      }

      // Check if the relevant import exists first
      if (!code.includes('@wix/redirects') || !code.includes('redirects')) {
          return undefined;
      }

      const s = new MagicString(code);
      let transformed = false;

      IMPORT_LINE_REGEX.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = IMPORT_LINE_REGEX.exec(code)) !== null) {
        const fullImportStatement = match[0];
        const braceContent = match[1];
        const importStartIndex = match.index;
        const importEndIndex = importStartIndex + fullImportStatement.length;

        const nameMatch = braceContent!.match(REDIRECTS_NAME_REGEX);

        if (nameMatch) {
          const nameStartIndex = importStartIndex + fullImportStatement.indexOf(nameMatch[0]);
          const nameEndIndex = nameStartIndex + nameMatch[0].length;

          transformed = true;

          const redirectsKeyword = 'redirects';
          const aliasName: string | undefined = nameMatch[1];
          const localRedirectsName: string = aliasName ?? redirectsKeyword;
          const originalImportName = `__original_${localRedirectsName}`;

          // Overwrite 'redirects' or 'redirects as alias' with 'redirects as __original_...'
          s.overwrite(nameStartIndex, nameEndIndex, `${redirectsKeyword} as ${originalImportName}`, { storeName: true });

          // --- Construct the SPECIFIC wrapper code to inject, including helpers ---
          const wrapperCode = `\n// --- Injected by vite-plugin-wrap-wix-redirects ---
import { isCookieWarmedUp, LOCALSTORAGE_DIRECT_LOGIN_URL_KEY } from '@wix/astro/redirect-warmup';
// Reference to the original imported object (renamed)
const ${originalImportName}_ref = ${originalImportName};

// Store the original function if it exists
const createRedirectSessionOG = ${originalImportName}_ref?.createRedirectSession;

// Create the new local variable/object that shadows the original import name
const ${localRedirectsName} = {
  ...${originalImportName}_ref, // Spread other properties

  // Overwrite createRedirectSession with the custom async function
  createRedirectSession: async function (options) {
    if (typeof createRedirectSessionOG !== 'function') {
        console.error('[Redirect Wrapper] Original createRedirectSession function not found.');
        return undefined;
    }

    try {
      if (isCookieWarmedUp()) {
        options = options || {};
        options.preferences = {
          ...(options.preferences || {}),
          maintainIdentity: false,
        };

        console.log('[Redirect Wrapper] setting maintainIdentity: false');

        if (options.login) {
          const loginDirectUrlResult = localStorage.getItem(LOCALSTORAGE_DIRECT_LOGIN_URL_KEY);
          try {
            if (loginDirectUrlResult) {
                const loginDirectUrl = JSON.parse(loginDirectUrlResult);
                if (loginDirectUrl && Object.keys(loginDirectUrl).length > 0) {
                  console.log('[Redirect Wrapper] Returning cached loginDirectUrl');
                  return loginDirectUrl;
                }
            }
          } catch (error) {
            console.error('[Redirect Wrapper] Error parsing loginDirectUrl from localStorage:', error);
          }
        }
      }
    } catch (error) {
        console.error('[Redirect Wrapper] Error during custom logic execution:', error);
    }
    // --- User's custom logic ends ---

    return createRedirectSessionOG.call(${originalImportName}_ref, options);
  }
};
// --- End of injection ---\n`;

          // Inject the wrapper code immediately after the modified import statement
          s.appendRight(importEndIndex, wrapperCode);

          // Break after the first relevant import transformation in a file
          break;
        }
      }

      if (!transformed) {
        return undefined;
      }

      return {
        code: s.toString(),
        map: s.generateMap({ hires: true, source: id })
      };
    }
  };
}
