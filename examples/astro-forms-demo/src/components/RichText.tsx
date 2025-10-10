import { type RichTextProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const RichText = ({ content, maxShownParagraphs }: RichTextProps) => {
  return (
    <div className="mb-4 pb-2 border-b border-foreground/20 text-foreground font-paragraph font-semibold">
      <RicosViewer
        content={content as RichContent}
        plugins={quickStartViewerPlugins()}
      />
    </div>
  );
};

export default RichText;
