import type { Member } from "@/integrations/members";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { User2Icon } from "lucide-react";
import React, { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { useMemberName } from "./MemberName";

const defaultSize = "md";

const memberAvatarVariants = cva("bg-foreground/10", {
  variants: {
    size: {
      sm: "h-6 w-6 text-xs",
      md: "h-8 w-8 text-sm",
      lg: "h-10 w-10 text-base",
    },
  },
  defaultVariants: {
    size: defaultSize,
  },
});

const anonymousIconSizes: Record<AvatarSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

/**
 * Available avatar sizes for the MemberAvatar component.
 */
export type AvatarSize = NonNullable<
  VariantProps<typeof memberAvatarVariants>["size"]
>;

export interface MemberAvatarProps {
  member: Member | null | undefined;
  /** Additional CSS classes to apply to the avatar */
  className?: string;
  /** Size variant for the avatar. Defaults to 'sm' */
  size?: AvatarSize;
}

/**
 * Displays the member's profile image or initials as a fallback.
 *
 * @example
 * ```tsx
 * <MemberAvatar member={member} avatarSize="md" />
 * ```
 */
export const MemberAvatar = React.forwardRef<HTMLElement, MemberAvatarProps>(
  ({ member, size, className }, ref) => {
    const authorName = useMemberName(member);
    const authorAvatarInitials = useMemo(() => {
      if (!authorName) return null;

      const authorAvatarInitials = authorName
        ?.split(" ")
        .map((name) => name[0]?.toLocaleUpperCase())
        .filter((char) => char && /[A-Z]/i.test(char))
        .join("");

      return authorAvatarInitials;
    }, [member]);

    return (
      <Avatar
        ref={ref}
        className={cn(memberAvatarVariants({ size }), className)}
      >
        <AvatarImage alt={authorName ?? ""} src={member?.profile?.photo?.url} />
        <AvatarFallback className="bg-inherit text-foreground/80">
          {authorAvatarInitials ?? (
            <User2Icon
              className={cn(anonymousIconSizes[size ?? defaultSize])}
            />
          )}
        </AvatarFallback>
      </Avatar>
    );
  }
);

MemberAvatar.displayName = "MemberAvatar";
