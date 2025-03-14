import { Tokens } from "@wix/sdk";
import { WIX_CLIENT_ID } from "astro:env/client";

export function getSessionCookieFromTokens(tokens: Tokens) {
  return `wixSession=${JSON.stringify({
    clientId: WIX_CLIENT_ID,
    tokens,
  })}`;
}
