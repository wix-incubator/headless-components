declare module "astro:env/client" {
  export const WIX_CLIENT_ID: string | undefined;
}
declare module "astro:env/server" {
  export const WIX_CLIENT_SECRET: string | undefined;
  export const WIX_CLIENT_PUBLIC_KEY: string | undefined;
  export const WIX_CLIENT_INSTANCE_ID: string | undefined;
}
