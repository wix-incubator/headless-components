import { getAuth, getSessionCookieFromTokens } from "./runtime.js";
import type { APIContext } from "astro";
import { OAUTH_COOKIE_STATE, WIX_LOGIN_REDIRECT } from "./constants.js";
import pRetry from "p-retry";

export const prerender = false;

export async function GET({ url, cookies }: APIContext) {
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
        onFailedAttempt: (error) => {
          console.error("Error getting member tokens", error);
        },
      }
    );

    // Create a response that redirects to the original URL
    const response = new Response(null, {
      status: 302,
      headers: {
        Location: originalUrl,
      },
    });

    // Delete the OAUTH_COOKIE_STATE and WIX_LOGIN_REDIRECT cookies
    response.headers.append(
      "Set-Cookie",
      `${OAUTH_COOKIE_STATE}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`
    );
    response.headers.append(
      "Set-Cookie",
      `${WIX_LOGIN_REDIRECT}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`
    );

    // Set the sesion cookie with a 2-day expiration
    response.headers.append(
      "Set-Cookie",
      `${getSessionCookieFromTokens(memberTokens)}; Max-Age=${
        60 * 60 * 24 * 2
      }; Path=/; HttpOnly; SameSite=Lax`
    );

    return response;
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
