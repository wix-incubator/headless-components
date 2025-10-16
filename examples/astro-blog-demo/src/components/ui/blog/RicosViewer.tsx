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
  toPlainText,
  type RichContent,
  type RicosCustomStyles,
} from "@wix/ricos";
import React, { useEffect, useState } from "react";

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
import { cn } from "@/lib/utils";

const cssVars = {
  foreground: "var(--wix-theme-foreground)",
  background: "var(--wix-theme-background)",
  headingFontFamily: "var(--theme-font-family-heading)",
  headingFontWeight: "var(--theme-font-weight-bold)",
  paragraphFontFamily: "var(--theme-font-family-paragraph)",
  paragraphFontWeight: "var(--theme-font-weight-normal)",
  border: "var(--theme-color-border-40)",
};

const customStylesForPostContent: RicosCustomStyles = {
  h1: {
    color: cssVars.foreground,
    fontFamily: cssVars.headingFontFamily,
    fontWeight: cssVars.headingFontWeight,
    fontSize: "var(--text-5xl)",
  },
  h2: {
    color: cssVars.foreground,
    fontFamily: cssVars.headingFontFamily,
    fontWeight: cssVars.headingFontWeight,
    fontSize: "var(--text-4xl)",
  },
  h3: {
    color: cssVars.foreground,
    fontFamily: cssVars.headingFontFamily,
    fontWeight: cssVars.headingFontWeight,
    fontSize: "var(--text-3xl)",
  },
  h4: {
    color: cssVars.foreground,
    fontFamily: cssVars.headingFontFamily,
    fontWeight: cssVars.headingFontWeight,
    fontSize: "var(--text-2xl)",
  },
  h5: {
    color: cssVars.foreground,
    fontFamily: cssVars.headingFontFamily,
    fontWeight: cssVars.headingFontWeight,
    fontSize: "var(--text-xl)",
  },
  h6: {
    color: cssVars.foreground,
    fontFamily: cssVars.headingFontFamily,
    fontWeight: cssVars.headingFontWeight,
    fontSize: "var(--text-lg)",
  },
  p: {
    color: cssVars.foreground,
    fontFamily: cssVars.paragraphFontFamily,
    fontWeight: cssVars.paragraphFontWeight,
    fontSize: "var(--text-lg)",
  },
  quote: {
    color: cssVars.foreground,
    fontFamily: cssVars.paragraphFontFamily,
  },
  codeBlock: {
    color: cssVars.foreground,
  },
  audio: {
    titleColor: cssVars.foreground,
    subtitleColor: cssVars.foreground,
    backgroundColor: cssVars.background,
    borderColor: cssVars.border,
    actionColor: cssVars.foreground,
    actionTextColor: cssVars.background,
  },
  table: {
    borderColor: cssVars.border,
    backgroundColor: cssVars.background,
  },
};

interface RicosViewerProps {
  content?: RichContent;
}

export const RicosViewer: React.FC<RicosViewerProps> = (props) => {
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

RicosViewer.displayName = "RicosViewer";
