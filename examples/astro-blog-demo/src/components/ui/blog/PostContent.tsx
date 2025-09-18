import { cn } from "@/lib/utils";
import { Blog } from "@wix/blog/components";
import {
  RicosViewer as CoreRicosViewer,
  type RichContent,
  type RicosCustomStyles,
  pluginAudioViewer,
  pluginCodeBlockViewer,
  pluginCollapsibleListViewer,
  pluginDividerViewer,
  pluginGalleryViewer,
  pluginGiphyViewer,
  pluginHtmlViewer,
  pluginImageViewer,
  pluginIndentViewer,
  pluginLineSpacingViewer,
  pluginLinkButtonViewer,
  pluginLinkPreviewViewer,
  pluginLinkViewer,
  pluginTableViewer,
  pluginTextColorViewer,
  pluginTextHighlightViewer,
  pluginVideoViewer,
} from "@wix/ricos";
import React from "react";

/* Core Ricos Viewer CSS */
import "@wix/ricos/css/ricos-viewer.global.css";

/* Plugins supported by Wix Blog */
import "@wix/ricos/css/plugin-audio-viewer.global.css";
import "@wix/ricos/css/plugin-collapsible-list-viewer.global.css";
import "@wix/ricos/css/plugin-divider-viewer.global.css";
import "@wix/ricos/css/plugin-gallery-viewer.global.css";
import "@wix/ricos/css/plugin-giphy-viewer.global.css";
import "@wix/ricos/css/plugin-html-viewer.global.css";
import "@wix/ricos/css/plugin-image-viewer.global.css";
import "@wix/ricos/css/plugin-table-viewer.global.css";
import "@wix/ricos/css/plugin-video-viewer.global.css";

export interface PostContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Renders the rich content of a blog post.
 *
 * @example
 * ```tsx
 * <PostContent />
 * ```
 */
export const PostContent = React.forwardRef<HTMLDivElement, PostContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <Blog.Post.Content className={cn(className)} ref={ref} {...props}>
        {RicosViewer}
      </Blog.Post.Content>
    );
  }
);

PostContent.displayName = "PostContent";

const customStylesForPostContent: RicosCustomStyles = {
  h1: {
    color: "var(--color-foreground)",
    fontWeight: "var(--font-weight-bold)",
    fontSize: "var(--text-5xl)",
  },
  h2: {
    color: "var(--color-foreground)",
    fontWeight: "var(--font-weight-bold)",
    fontSize: "var(--text-4xl)",
  },
  h3: {
    color: "var(--color-foreground)",
    fontWeight: "var(--font-weight-bold)",
    fontSize: "var(--text-3xl)",
  },
  h4: {
    color: "var(--color-foreground)",
    fontWeight: "var(--font-weight-bold)",
    fontSize: "var(--text-2xl)",
  },
  h5: {
    color: "var(--color-foreground)",
    fontWeight: "var(--font-weight-bold)",
    fontSize: "var(--text-xl)",
  },
  h6: {
    color: "var(--color-foreground)",
    fontWeight: "var(--font-weight-bold)",
    fontSize: "var(--text-lg)",
  },
  p: {
    color: "var(--color-foreground)",
    fontSize: "var(--text-lg)",
  },
  quote: {
    color: "var(--color-foreground)",
  },
  codeBlock: {
    color: "var(--color-foreground)",
  },
  audio: {
    titleColor: "var(--color-foreground)",
    subtitleColor: "var(--color-foreground)",
    backgroundColor: "var(--color-background)",
    borderColor: "var(--color-border)",
    actionColor: "var(--color-foreground)",
    actionTextColor: "var(--color-background)",
  },
  table: {
    borderColor: "var(--color-border)",
    backgroundColor: "var(--color-background)",
  },
};

interface RicosViewerProps {
  content?: RichContent;
}

const RicosViewer: React.FC<RicosViewerProps> = (props) => {
  const { content } = props;

  const ricosPluginsForBlog = [
    pluginAudioViewer(),
    pluginCodeBlockViewer(),
    pluginCollapsibleListViewer(),
    pluginDividerViewer(),
    pluginGalleryViewer(),
    pluginGiphyViewer(),
    pluginHtmlViewer(),
    pluginImageViewer(),
    pluginIndentViewer(),
    pluginLineSpacingViewer(),
    pluginLinkViewer(),
    pluginLinkButtonViewer(),
    pluginLinkPreviewViewer(),
    pluginTableViewer(),
    pluginTextColorViewer(),
    pluginTextHighlightViewer(),
    pluginVideoViewer(),
  ];

  return (
    <CoreRicosViewer
      content={content}
      plugins={ricosPluginsForBlog}
      theme={{ customStyles: customStylesForPostContent }}
    />
  );
};
