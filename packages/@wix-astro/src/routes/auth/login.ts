import {
  AUTH_CALLBACK_PATHNAME,
  AUTH_LOGIN_CALLBACK_PARAM,
  OAUTH_COOKIE_STATE,
  PROMPT_QUERY_PARAM,
} from "./constants.js";
import { getAuth } from "../../runtime.server.js";
import type { APIContext } from "astro";

export const prerender = false;

export async function GET({ url }: APIContext) {
  // Extract search parameters from the URL
  const searchParams = new URL(url).searchParams;
  const originalUrl = searchParams.get(AUTH_LOGIN_CALLBACK_PARAM) || "/";
  const prompt =
    (searchParams.get(PROMPT_QUERY_PARAM) as "login" | "none" | undefined) ??
    "login";

  // Generate OAuth data and authorization URL
  const redirectUrl = new URL(AUTH_CALLBACK_PATHNAME, url).toString();
  const oauthData = await getAuth().generateOAuthData(redirectUrl, originalUrl);

  const { authUrl } = await getAuth().getAuthUrl(oauthData, {
    prompt,
    responseMode: "query",
  });

  // Create a response that redirects to the authorization URL
  const response = new Response(null, {
    status: 302,
    headers: {
      Location: authUrl,
      "Set-Cookie": `${OAUTH_COOKIE_STATE}=${JSON.stringify(
        oauthData
      )}; Max-Age=1800; Path=/; HttpOnly; SameSite=Lax`,
    },
  });

  return response;
}
