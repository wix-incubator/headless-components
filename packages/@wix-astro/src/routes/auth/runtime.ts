import { Tokens } from "@wix/sdk";
import { WIX_CLIENT_ID } from "astro:env/client";

export function sessionCookieJson(tokens: Tokens) {
  return {
    clientId: WIX_CLIENT_ID,
    tokens,
  };
}
