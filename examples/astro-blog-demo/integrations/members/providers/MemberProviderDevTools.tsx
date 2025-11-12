import { useEffect } from "react";
import { useMember } from "./MemberContext";

/** Only for `astro-blog-demo` */
export const MemberProviderDevTools = () => {
  const { isAuthenticated, actions } = useMember();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "L") {
        const action: keyof typeof actions = isAuthenticated
          ? "logout"
          : "login";
        if (confirm(`useMember.actions.${action}?`)) {
          actions[action]();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [actions]);

  return null;
};
