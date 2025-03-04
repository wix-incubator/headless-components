import type { AstroConfig, AstroIntegration } from "astro";

import {
  appendForwardSlash,
  prependForwardSlash,
} from "@astrojs/internal-helpers/path";
import { createRequire } from "node:module";

import { passthroughImageService } from "astro/config";
import { buildResolver } from "esm-resolve";
import { fileURLToPath } from "node:url";

import { wixBlogLoader } from "./loaders/blog.js";
import { loadEnv } from "vite";
import chalk from "chalk";
import { outdent } from "outdent";
import { wixSDKContext } from "./vite-plugins/sdk-context.js";
export { wixBlogLoader };

export type { Runtime } from "./entrypoints/server.js";

export function createIntegration(): AstroIntegration {
  let _config: AstroConfig;

  return {
    name: "@wix/astro",
    hooks: {
      "astro:config:setup": async ({
        config,
        updateConfig,
        addMiddleware,
        logger,
      }) => {
        const aRequire = buildResolver(fileURLToPath(import.meta.url), {
          resolveToAbsolute: true,
        });

        addMiddleware({
          entrypoint: aRequire("./middleware")!,
          order: "pre",
        });

        const userEnv = loadEnv(
          process.env["NODE_ENV"] ?? "development",
          process.cwd(),
          ""
        );

        if (!userEnv["ENV_NAME"]) {
          logger.error(
            outdent`
            Missing environment definition.'

            💡 To pull the required environment variables from Wix, run:
              ${chalk.magenta("npx wix edge env --env local pull")}

            🔍 Need Help?
            - Visit our docs: https://dev.wix.com/docs/go-headless
            - Join the community: https://discord.com/channels/1114269395317968906/1288424190969511987

              `
          );

          throw new Error(
            `${chalk.magenta(
              `ENV_NAME`
            )} not found in loaded environment variables`
          );
        }

        if (!userEnv["WIX_CLIENT_ID"]) {
          logger.error(
            outdent`
            Missing environment variable ${chalk.blueBright(`WIX_CLIENT_ID`)} on environment '${userEnv["ENV_NAME"]}'
            To use the Wix SDK, you must provide the ${chalk.blueBright(
              "WIX_CLIENT_ID"
            )} environment variable.

            💡 To pull the required environment variables from Wix, run:
              ${chalk.magenta("npx wix edge env --env local pull")}

            🔍 Need Help?
            - Visit our docs: https://dev.wix.com/docs/go-headless
            - Join the community: https://discord.com/channels/1114269395317968906/1288424190969511987

              `
          );

          throw new Error(
            `${chalk.magenta(
              `WIX_CLIENT_ID`
            )} not found in loaded environment variables`
          );
        }

        updateConfig({
          env: {
            schema: {
              WIX_CLIENT_ID: {
                type: "string",
                access: "public",
                context: "client",
              },
              WIX_CLIENT_SECRET: {
                type: "string",
                access: "secret",
                context: "server",
                optional: true,
              },
              WIX_CLIENT_PUBLIC_KEY: {
                type: "string",
                access: "secret",
                context: "server",
                optional: true,
              },
              WIX_CLIENT_INSTANCE_ID: {
                type: "string",
                access: "secret",
                context: "server",
                optional: true,
              },
              ENV_NAME: {
                type: "string",
                access: "public",
                context: "client",
              }
            },
          },
          build: {
            client: new URL(
              `./client${prependForwardSlash(appendForwardSlash(config.base))}`,
              config.outDir
            ),
            server: new URL("./server/", config.outDir),
            serverEntry: "index.js",
            redirects: false,
          },
          vite: {
            plugins: [
              // The plugin is used to inject the Wix SDK context into the client bundle
              // It's currently commented out because there are some issues with the current implementation
              // (currently the magic import is injected into any type of module, not only JS)
              // not sure if it's necessary to inject the Wix SDK context into the client bundle
              wixSDKContext(),
            ],
          },
          image: {
            service: passthroughImageService(),
            domains: ["static.wixstatic.com"],
          },
        });
      },
      "astro:config:done": async ({ setAdapter, config }) => {
        _config = config;

        setAdapter({
          name: "@wix/astro",
          serverEntrypoint: createRequire(import.meta.url).resolve(
            "./entrypoints/server"
          ),
          exports: ["default"],
          adapterFeatures: {
            edgeMiddleware: false,
            buildOutput: "server",
          },
          supportedAstroFeatures: {
            serverOutput: "stable",
            hybridOutput: "stable",
            staticOutput: "stable",
            i18nDomains: "experimental",
            sharpImageService: "unsupported",
            envGetSecret: "stable",
          },
        });
      },
      "astro:build:setup": ({ vite, target }) => {
        if (target === "server") {
          vite.resolve ||= {};
          vite.resolve.alias ||= {};

          vite.resolve.conditions ||= [];
          // We need those conditions, previous these conditions where applied at the esbuild step which we removed
          // https://github.com/withastro/astro/pull/7092
          vite.resolve.conditions.push("workerd", "worker");

          vite.ssr ||= {};
          vite.ssr.target = "webworker";
          vite.ssr.noExternal = true;

          if (typeof _config.vite.ssr?.external === "undefined")
            vite.ssr.external = ["node:async_hooks"];
          if (typeof _config.vite.ssr?.external === "boolean")
            vite.ssr.external = _config.vite.ssr?.external;
          if (Array.isArray(_config.vite.ssr?.external)) {
            // `@astrojs/vue` sets `@vue/server-renderer` to external
            // https://github.com/withastro/astro/blob/e648c5575a8774af739231cfa9fc27a32086aa5f/packages/integrations/vue/src/index.ts#L119
            // the cloudflare adapter needs to get all dependencies inlined, we use `noExternal` for that, but any `external` config overrides that
            // therefore we need to remove `@vue/server-renderer` from the external config again
            vite.ssr.external = _config.vite.ssr?.external.filter(
              (entry) => entry !== "@vue/server-renderer"
            );
            vite.ssr.external.push("node:async_hooks");
          }
        }
        // we thought that vite config inside `if (target === 'server')` would not apply for client
        // but it seems like the same `vite` reference is used for both
        // so we need to reset the previous conflicting setting
        // in the future we should look into a more robust solution
        if (target === "client") {
          vite.resolve ||= {};
          vite.resolve.conditions ||= [];
          vite.resolve.conditions = vite.resolve.conditions.filter(
            (c) => c !== "workerd" && c !== "worker"
          );
        }
      },
    },
  };
}
