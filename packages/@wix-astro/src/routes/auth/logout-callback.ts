import type { APIRoute } from "astro";
import { getAuth } from "../../runtime.js";
import { sessionCookieJson } from "./runtime.js";

export const prerender = false;

export const GET: APIRoute = async ({ request, redirect, cookies }) => {
  const returnTo = new URL(request.url).searchParams.get("returnTo") ?? "/";

  const tokens = await getAuth().generateVisitorTokens();

  cookies.set("wixSession", sessionCookieJson(tokens));

  return redirect(returnTo);
};
