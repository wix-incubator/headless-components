import { Form, type RichTextProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const RichText = ({
  id,
  content,
  maxShownParagraphs,
  ...rest
}: RichTextProps) => {
  return (
    <Form.Field id={id}>
      <Form.Field.InputWrapper>
        <Form.Field.Input asChild>
          <div className="w-full text-foreground font-paragraph font-semibold">
            <RicosViewer
              content={content as RichContent}
              plugins={quickStartViewerPlugins()}
            />
          </div>
        </Form.Field.Input>
      </Form.Field.InputWrapper>
    </Form.Field>
  );
};

export default RichText;
