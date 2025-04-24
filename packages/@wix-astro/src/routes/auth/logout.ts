import { getAuth } from "../../runtime.server.js";
import type { APIContext } from "astro";

export const prerender = false;

export async function GET({ request, redirect }: APIContext) {
  const returnTo = request.headers.get("Referer") ?? "/";
  const baseUrl = new URL(request.url).origin + "/" + import.meta.env.BASE_URL;
  const postFlowUrl = new URL("/api/auth/logout-callback", baseUrl);
  postFlowUrl.searchParams.set("returnTo", returnTo);

  const { logoutUrl } = await getAuth().logout(postFlowUrl.toString());

  return redirect(logoutUrl);
}
