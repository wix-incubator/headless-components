import buildResolver from "esm-resolve";
import { fileURLToPath } from "node:url";
import { loadEnv, Plugin } from "vite";


export function wixSDKContext(opts: { sessionCookieName: string }): Plugin {
  const virtualModuleId = '@wix/sdk-context';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'vite-plugin-sdk-context',
    enforce: 'pre', // Ensure the plugin runs before Vite processes dependencies

    config(_, { isSsrBuild }) {
      if (isSsrBuild) return; // Skip for server-side rendering
      return {
        optimizeDeps: {
          exclude: [virtualModuleId], // Ensure the virtual module is not pre-bundled
        },
      };
    },

    resolveId(id, _, { ssr }) {
      if (ssr) return null; // Skip for server-side rendering
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
      return null;
    },

    load(id) {
      if (id === resolvedVirtualModuleId) {
        const aRequire = buildResolver(
          fileURLToPath(import.meta.url),
          {
            resolveToAbsolute: true,
          }
        );

        const userLoadedEnv = loadEnv(
          process.env["NODE_ENV"] ?? "development",
          process.cwd(),
          ""
        );
        const wixSDKResolved = aRequire("@wix/sdk/client");
        const wixSDKAuthResolved = aRequire(
          "@wix/sdk/auth/site-session"
        );
     
      return `import { createClient } from "${wixSDKResolved}";
              import { SiteSessionAuth } from "${wixSDKAuthResolved}";

              function getCookieAsJson(name) {
                const cookies = document.cookie.split('; ');
                const cookie = cookies.find(row => row.startsWith(\`\${name}=\`));

                if (!cookie) return null;

                try {
                  const jsonString = decodeURIComponent(cookie.split('=')[1]);
                  return JSON.parse(jsonString);
                } catch (error) {
                  console.error('Error parsing cookie JSON:', error);
                  return null;
                }
              }

              export const wixContext = {
                client: createClient({
                  auth: SiteSessionAuth({
                    clientId: ${JSON.stringify(
                      userLoadedEnv["WIX_CLIENT_ID"]
                    )},
                    tokens: getCookieAsJson(${JSON.stringify(
                      opts.sessionCookieName
                    )})?.tokens,
                  }),
                })
              };
                `;
      }
      return null;
    },
  };
}