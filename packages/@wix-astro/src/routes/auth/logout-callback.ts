import { getAuth } from "../../runtime.js";
import { getSessionCookieFromTokens } from "./runtime.js";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const returnTo = new URL(request.url).searchParams.get("returnTo") ?? "/";

  const tokens = await getAuth().generateVisitorTokens();

  const response = new Response(null, {
    status: 302,
    headers: {
      Location: returnTo,
    },
  });

  response.headers.append(
    "Set-Cookie",
    `${getSessionCookieFromTokens(tokens)}; Max-Age=${
      60 * 60 * 24 * 2
    }; Path=/; HttpOnly; SameSite=Lax`
  );

  return response;
};
