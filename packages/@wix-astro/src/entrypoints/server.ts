import type {
  Request as CLOUDFLARE_REQUEST,
  ExecutionContext,
} from "@cloudflare/workers-types";
import { createClient } from "@wix/sdk";
import type { SSRManifest } from "astro";
import { App } from "astro/app";
import { setGetEnv } from "astro/env/setup";

export interface Runtime<T extends object = object> {
  runtime: {
    env: T;
    ctx: ExecutionContext;
  };
}

export function createExports(manifest: SSRManifest) {
  const app = new App(manifest);
  const client = createClient({});

  const fetch = async (
    request: Request & CLOUDFLARE_REQUEST,
    env: Record<string, unknown>
  ) => {
    setGetEnv((key) =>
      typeof env[key] === "string" ? env[key] : JSON.stringify(env[key])
    );

    const { pathname } = new URL(request.url);

    if (request.method === "POST" && pathname.startsWith("/_wix/events")) {
      await client.webhooks.processRequest(request);
      return new Response(null, { status: 200 });
    }

    if (
      request.method === "POST" &&
      pathname.startsWith("/_wix/service-plugins")
    ) {
      return client.servicePlugins.processRequest(request);
    }

    Reflect.set(
      request,
      Symbol.for("astro.clientAddress"),
      request.headers.get("cf-connecting-ip")
    );

    if (!app.match(request)) {
      return await (env['ASSETS'] as { fetch: (req: Request) => Promise<Response>}).fetch(request);
    }

    const response = await app.render(request);

    if (app.setCookieHeaders) {
      for (const setCookieHeader of app.setCookieHeaders(response)) {
        response.headers.append("Set-Cookie", setCookieHeader);
      }
    }

    return response;
  };

  return { default: { fetch } };
}
