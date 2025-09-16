// IMPLEMENTATION TAKEN FROM "picasso" repo: */ui/ricos-viewer.tsx
import React from "react";

import {
  RicosViewer as CoreRicosViewer,
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
  type RichContent,
  type RicosCustomStyles,
} from "@wix/ricos";

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

export interface RicosViewerProps {
  content?: RichContent;
  className?: string;
  customStyles?: RicosCustomStyles;
}

const defaultCustomStyles: RicosCustomStyles = {
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

export const RicosViewer = React.forwardRef<HTMLDivElement, RicosViewerProps>(
  (props, ref) => {
    const { className, customStyles = defaultCustomStyles, content } = props;

    const attributes = {
      "data-testid": "ricos-viewer",
    };

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
      <div ref={ref} className={className} {...attributes}>
        <CoreRicosViewer
          content={content}
          plugins={ricosPluginsForBlog}
          theme={{ customStyles }}
        />
      </div>
    );
  }
);
