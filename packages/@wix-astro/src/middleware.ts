/// <reference types="astro/client" />
import { OAuthStrategy, TokenRole, createClient } from "@wix/sdk";
import type { APIContext, MiddlewareHandler } from "astro";
import { z } from "astro/zod";
import { WIX_CLIENT_ID } from "astro:env/client";
import { defineMiddleware } from "astro:middleware";
import { authStrategyAsyncLocalStorage } from "./auth-context.js";
import { sessionCookieJson } from "./routes/auth/runtime.js";

const sessionClient = createClient({
  auth: {
    async getAuthHeaders() {
      const auth = authStrategyAsyncLocalStorage.getStore()?.auth;
      if (!auth) {
        throw new Error(
          "No authentication strategy found in the current context"
        );
      }

      return auth.getAuthHeaders();
    },
  },
});

sessionClient.enableContext("global");

/**
 * Checks if the incoming request is a request for a dynamic (server-side rendered) page.
 * We can check this by looking at the middleware's `clientAddress` context property because accessing
 * this prop in a static route will throw an error which we can conveniently catch.
 */
function checkIsDynamicPageRequest(
  context: Parameters<MiddlewareHandler>[0]
): boolean {
  try {
    return context.clientAddress != null;
  } catch {
    return false;
  }
}

function getSessionTokensFromCookie(context: APIContext) {
  if (!checkIsDynamicPageRequest(context)) {
    return;
  }

  const rawCookie = context.cookies.get("wixSession")?.json();
  if (rawCookie) {
    const tokensParseResult = z
      .object({
        clientId: z.string(),
        tokens: z.object({
          accessToken: z.object({
            value: z.string(),
            expiresAt: z.number(),
          }),
          refreshToken: z.object({
            value: z.string(),
            role: z.nativeEnum(TokenRole),
          }),
        }),
      })
      .safeParse(rawCookie);

    if (
      tokensParseResult.success &&
      tokensParseResult.data.clientId === WIX_CLIENT_ID
    ) {
      return tokensParseResult.data;
    }
  }
}

function saveSessionTokensToCookie(context: APIContext, tokens: any) {
  context.cookies.set("wixSession", sessionCookieJson(tokens), {
    secure: true,
    path: "/",
  });
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (!WIX_CLIENT_ID) {
    return next();
  }

  const sessionTokensFromCookie = getSessionTokensFromCookie(context);

  const auth = OAuthStrategy({
    clientId: WIX_CLIENT_ID,
  });

  if (sessionTokensFromCookie) {
    auth.setTokens(sessionTokensFromCookie.tokens);
  } else {
    auth.setTokens(await auth.generateVisitorTokens());
  }

  const response = await authStrategyAsyncLocalStorage.run(
    {
      auth,
    },
    () => next()
  );

  if (
    checkIsDynamicPageRequest(context) &&
    sessionTokensFromCookie?.tokens.accessToken.expiresAt !==
      auth.getTokens().accessToken.expiresAt
  ) {
    saveSessionTokensToCookie(context, auth.getTokens());
  }

  return response;
});
