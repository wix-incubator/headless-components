import type { members } from "@wix/members";

type MemberResponse = NonNullable<members.GetMyMemberResponse["member"]>;
type MemberContactResponse = NonNullable<MemberResponse["contact"]>;
type MemberProfileResponse = NonNullable<MemberResponse["profile"]>;
type MemberProfilePhotoResponse = NonNullable<MemberProfileResponse["photo"]>;

export type Member = {
  loginEmail?: MemberResponse["loginEmail"]; // type is string
  loginEmailVerified?: MemberResponse["loginEmailVerified"]; // type is boolean
  status?: MemberResponse["status"]; // type is enum of "UNKNOWN" | "PENDING" | "APPROVED" | "BLOCKED" | "OFFLINE"
  contact?: {
    firstName?: MemberContactResponse["firstName"]; // type is string
    lastName?: MemberContactResponse["lastName"]; // type is string
    phones?: MemberContactResponse["phones"]; // type is string[]
  };
  profile?: {
    nickname?: MemberProfileResponse["nickname"]; // type is string
    photo?: {
      url?: MemberProfilePhotoResponse["url"]; // type is string
      height?: MemberProfilePhotoResponse["height"]; // type is number
      width?: MemberProfilePhotoResponse["width"]; // type is number
      offsetX?: MemberProfilePhotoResponse["offsetX"]; // type is number
      offsetY?: MemberProfilePhotoResponse["offsetY"]; // type is number
    };
    title?: MemberProfileResponse["title"]; // type is string
  };
  _createdDate?: MemberResponse["_createdDate"]; // type is Date
  _updatedDate?: MemberResponse["_updatedDate"]; // type is Date
  lastLoginDate?: MemberResponse["lastLoginDate"]; // type is Date
};
