import { wixContext } from '@wix/sdk-context';
import type { WixClient } from "@wix/sdk";
import type { SiteSessionAuth } from "@wix/sdk/auth/site-session";

export function getWixClient() {
  return wixContext['client'] as WixClient<undefined, ReturnType<typeof SiteSessionAuth>>;
}
