import { Form, type RichTextProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const RichText = ({
  // @ts-expect-error
  id,
  content,
  maxShownParagraphs,
  // @ts-expect-error
  layout,
  ...rest
}: RichTextProps) => {
  return (
    <Form.Field id={id} layout={layout}>
      <Form.Field.Input asChild>
        <div className="w-full mb-4 pb-2 border-b border-foreground/20 text-foreground font-paragraph font-semibold">
          <RicosViewer
            content={content as RichContent}
            plugins={quickStartViewerPlugins()}
          />
        </div>
      </Form.Field.Input>
    </Form.Field>
  );
};

export default RichText;
