import { useMember } from "@/integrations/members";
import React from "react";

type LoginGuardProps = {
  children: React.ReactNode;
};

export default function LoginGuard({ children }: LoginGuardProps) {
  const { isAuthenticated, actions } = useMember();

  const Element = isAuthenticated ? React.Fragment : "a";
  const elementProps: React.ComponentProps<typeof Element> = isAuthenticated
    ? {}
    : {
        className:
          "block cursor-pointer *:pointer-events-none hover:opacity-70",
        onClickCapture: (e) => {
          e.stopPropagation();

          actions.login();
        },
      };

  return <Element {...elementProps}>{children}</Element>;
}
