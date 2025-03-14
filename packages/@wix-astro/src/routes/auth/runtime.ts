import { OAuthStrategy } from "@wix/sdk/auth/oauth2";
import { Tokens } from "@wix/sdk";
import { authStrategyAsyncLocalStorage } from "../../auth-context.js";
import { WIX_CLIENT_ID } from "astro:env/client";

export function getAuth(): ReturnType<typeof OAuthStrategy> {
  const auth = authStrategyAsyncLocalStorage.getStore()?.auth as
    | ReturnType<typeof OAuthStrategy>
    | undefined;
  if (!auth) {
    throw new Error("No authentication strategy found in the current context");
  }

  return auth;
}

export function getSessionCookieFromTokens(tokens: Tokens) {
  return `wixSession=${JSON.stringify({
    clientId: WIX_CLIENT_ID,
    tokens,
  })}`;
}
