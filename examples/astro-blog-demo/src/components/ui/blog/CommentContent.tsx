import { Blog } from "@wix/blog/components";
import { PlainTextRicosViewer, RicosViewer } from "./RicosViewer";

interface CommentContentProps {
  className?: string;
  asPlainText?: boolean;
}

export function CommentContent({
  className,
  asPlainText = false,
}: CommentContentProps) {
  return (
    <Blog.Post.Comment.Content asChild className={className}>
      {({ content }) =>
        asPlainText ? (
          <PlainTextRicosViewer content={content} />
        ) : (
          <RicosViewer content={content} />
        )
      }
    </Blog.Post.Comment.Content>
  );
}

CommentContent.displayName = "CommentContent";
