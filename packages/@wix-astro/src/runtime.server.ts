import { OAuthStrategy } from "@wix/sdk/auth/oauth2";
import { authStrategyAsyncLocalStorage } from "./auth-context.js";

export function getAuth(): ReturnType<typeof OAuthStrategy> {
  const auth = authStrategyAsyncLocalStorage.getStore()?.auth as
    | ReturnType<typeof OAuthStrategy>
    | undefined;
  if (!auth) {
    throw new Error("No authentication strategy found in the current context");
  }

  return auth;
}
