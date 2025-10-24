import RoutePost from "@/components/blog/RoutePost";
import { MemberProvider } from "@/integrations";
import { MemberProviderDevTools } from "@/integrations/members/providers/MemberProviderDevTools";
import { type ComponentProps } from "react";

export default function RoutePostWithProviders(
  props: ComponentProps<typeof RoutePost>
) {
  return (
    <MemberProvider>
      <MemberProviderDevTools />
      <RoutePost {...props} />
    </MemberProvider>
  );
}
