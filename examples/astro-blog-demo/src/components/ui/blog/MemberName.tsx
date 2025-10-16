import type { Member } from "@/integrations/members";
import { useMemo } from "react";

export const useMemberName = (
  member: Member | null | undefined
): string | null => {
  return useMemo(() => {
    if (!member) return null;

    const formattedFirstName = member.contact?.firstName?.trim();
    const formattedLastName = member.contact?.lastName?.trim();
    const nickname = member.profile?.nickname?.trim();

    const authorName =
      nickname ||
      `${formattedFirstName || ""} ${formattedLastName || ""}`.trim() ||
      "";

    return authorName;
  }, [member]);
};

type MemberNameProps = {
  member: Member | null | undefined;
};

export const MemberName = ({ member }: MemberNameProps) => {
  return useMemberName(member);
};
