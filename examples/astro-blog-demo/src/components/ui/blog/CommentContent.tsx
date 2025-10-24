import { Comment } from "@wix/blog/components";
import { PlainTextRicosViewer, RicosViewer } from "./RicosViewer";

interface CommentContentProps {
  className?: string;
  asPlainText?: boolean;
}

/**
 * Displays comment content using RicosViewer for rich text rendering.
 * Can optionally display as plain text.
 */
export function CommentContent({
  className,
  asPlainText = false,
}: CommentContentProps) {
  return (
    <Comment.Content asChild className={className}>
      {({ content }) =>
        asPlainText ? (
          <PlainTextRicosViewer content={content} />
        ) : (
          <RicosViewer content={content} />
        )
      }
    </Comment.Content>
  );
}

CommentContent.displayName = "CommentContent";
