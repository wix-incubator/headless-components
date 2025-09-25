import { members } from "@wix/members";
import type { Member } from ".";

export const getCurrentMember = async (): Promise<Member | null> => {
  try {
    const member = await members.getCurrentMember({ fieldsets: ["FULL"] });
    if (!member) {
      console.log("==== No member found");
    }
    return member.member ?? null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
