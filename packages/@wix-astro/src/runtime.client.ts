import { wixContext } from '@wix/sdk-context';
import type { SiteSessionAuth } from "@wix/sdk/auth/site-session";

export function getAuth() : ReturnType<typeof SiteSessionAuth> {
  return (wixContext['client'] as any).auth;
}
