import PostPageComponent from "@/components/blog/PostPage";
import { MemberProvider } from "@/integrations/members";
import { MemberProviderDevTools } from "@/integrations/members/providers/MemberProviderDevTools";
import { type ComponentProps } from "react";

export const PostPage = (props: ComponentProps<typeof PostPageComponent>) => {
  return (
    <MemberProvider>
      <MemberProviderDevTools />
      <PostPageComponent {...props} />
    </MemberProvider>
  );
};
