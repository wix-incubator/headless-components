import { type RichTextProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const RichText = ({ content, maxShownParagraphs }: RichTextProps) => {
  return (
    <div
      style={{
        fontWeight: '600',
        color: '#333',
        borderBottom: '2px solid #e0e0e0',
        paddingBottom: '8px',
      }}
    >
      <RicosViewer
        content={content as RichContent}
        plugins={quickStartViewerPlugins()}
      />
    </div>
  );
};

export default RichText;
