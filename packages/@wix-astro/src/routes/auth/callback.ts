import type { APIContext } from "astro";
import pRetry from "p-retry";
import { getAuth } from "../../runtime.js";
import { OAUTH_COOKIE_STATE, WIX_LOGIN_REDIRECT } from "./constants.js";
import { sessionCookieJson } from "./runtime.js";

export const prerender = false;

export async function GET({ url, cookies, redirect }: APIContext) {
  // Retrieve the OauthData from cookies
  const oauthStateCookie = cookies.get(OAUTH_COOKIE_STATE);
  const oauthData = oauthStateCookie ? JSON.parse(oauthStateCookie.value) : {};

  // Determine the original URL or default to home
  const originalUrl = oauthData.originalUri || "/";

  // Check for error in the request URL
  if (url.href.includes("error=")) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: originalUrl,
      },
    });
  }

  // Parse state and code from the request URL
  const parsedUrl = new URL(url);
  const state = parsedUrl.searchParams.get("state") || "";
  const code = parsedUrl.searchParams.get("code") || "";

  try {
    // Retrieve member tokens using the code, state, and oauthData
    const auth = getAuth();

    const memberTokens = await pRetry(
      () => auth.getMemberTokens(code, state, oauthData),
      {
        retries: 3,
        onFailedAttempt: (error: unknown) => {
          console.error("Error getting member tokens", error);
        },
      }
    );

    cookies.delete(OAUTH_COOKIE_STATE);
    cookies.delete(WIX_LOGIN_REDIRECT);
    cookies.set("wixSession", sessionCookieJson(memberTokens), {
      maxAge: 60 * 60 * 24 * 2,
      path: "/",
      httpOnly: true,
    });

    return redirect(originalUrl);
  } catch (error) {
    console.error("Authentication error:", error);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/?authError=true",
      },
    });
  }
}
