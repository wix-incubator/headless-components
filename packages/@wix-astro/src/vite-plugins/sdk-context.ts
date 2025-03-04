import buildResolver from "esm-resolve";
import MagicString from "magic-string";
import { fileURLToPath } from "node:url";
import { join } from "path";
import { Plugin, ResolvedConfig } from "vite";

export function wixSDKContext(): Plugin {
  let resolvedConfig: ResolvedConfig | null = null;
  const virtualModuleId = "virtual:@wix-astro/sdk-context";

  const moduleIdsToInject = new Set<string>();

  return {
    name: "inject-wix-sdk-context",
    enforce: "pre",
    configResolved(config) {
      resolvedConfig = config;
    },
    async resolveId(source, importer, options) {
      if (source === virtualModuleId) {
        return virtualModuleId;
      }

      if (
        importer === join(resolvedConfig!.root, "index.html") &&
        !options.ssr &&
        (source.startsWith("/src") ||
          source.startsWith(join(resolvedConfig!.root, "src")))
      ) {
        const resolved = await this.resolve(source, importer, {
          skipSelf: true,
        });
        if (resolved) {
          moduleIdsToInject.add(resolved.id);
        }
      }
    },
    load(id) {
      const aRequire = buildResolver(fileURLToPath(import.meta.url), {
        resolveToAbsolute: true,
      });

      const wixSDKResolved = aRequire("@wix/sdk/client");
      const wixSDKAuthResolved = aRequire("@wix/sdk/auth/oauth2");

      if (id === virtualModuleId) {
        return `
          import { createClient } from "${wixSDKResolved}";
          import { OAuthStrategy } from "${wixSDKAuthResolved}";

          function getCookie(name) {
            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all.
            var cookies = document.cookie ? document.cookie.split('; ') : [];
            var jar = {};
            for (var i = 0; i < cookies.length; i++) {
              var parts = cookies[i].split('=');
              var value = parts.slice(1).join('=');

              try {
                var found = decodeURIComponent(parts[0]);
                jar[found] = converter.read(value, found);

                if (name === found) {
                  break
                }
              } catch (e) {}
            }

            return name ? jar[name] : jar
          }

          createClient({
            auth: OAuthStrategy({
              clientId: import.meta.env.WIX_CLIENT_ID,
              tokens: JSON.parse(getCookie("wixSession") ?? "{}"),
            })
          }).enableContext('global');
          `;
      }
    },
    transform(code, id, options) {
      if (moduleIdsToInject.has(id) && !options?.ssr) {
        const s = new MagicString(code);
        s.prepend(`import '${virtualModuleId}';\n`);

        return {
          code: s.toString(),
          map: s.generateMap(),
        };
      }
      return code;
    },
  };
}
