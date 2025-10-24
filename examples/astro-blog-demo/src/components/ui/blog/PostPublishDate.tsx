import { Blog } from "@wix/blog/components";
import { RelativeDate } from "./RelativeDate";

interface PostPublishDateProps {
  uiLocale: Intl.LocalesArgument;
}

export const PostPublishDate = ({ uiLocale }: PostPublishDateProps) => {
  return (
    <Blog.Post.PublishDate asChild>
      {({ publishDate }) => (
        <RelativeDate date={publishDate} locale={uiLocale} />
      )}
    </Blog.Post.PublishDate>
  );
};

PostPublishDate.displayName = "PostPublishDate";
