import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import React from 'react';

// Define options for rendering rich text
const options = {
  renderNode: {
    // Handle embedded entries (e.g., images or custom components)
    [BLOCKS.EMBEDDED_ENTRY]: (node: any) => {
      const { data } = node;
      const { target } = data;
      const { fields } = target;

      // console.log(target);

      // Example: Render an embedded image component
      if (target?.sys?.contentType?.sys?.id === 'componentRichImage') {
        return (
          <div className="my-4">
            <img
              src={`https:${fields.image.fields.file.url}`}
              alt={fields.image.fields.title}
              width={fields.image.fields.file.details.image.width}
              height={fields.image.fields.file.details.image.height}
              className="rounded-lg mx-auto"
            />
            {fields.caption && (
              <p className="mt-2 text-center text-sm text-gray-600">
                {fields.caption}
              </p>
            )}
          </div>
        );
      }

      // Fallback for unsupported or unknown embedded entries
      return (
        <></>
      );
    },

    // Handle embedded assets (e.g., images directly embedded in the rich text)
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { data } = node;
      const { target } = data;
      const { fields } = target;

      return (
        <div className="my-4">
          <img
            src={`https:${fields.file.url}`}
            alt={fields.title}
            width={fields.file.details.image.width}
            height={fields.file.details.image.height}
            className="rounded-lg"
          />
        </div>
      );
    },
  },
};

// RichText component
const RichText = ({ content }: { content: any }) => {
  return (
    <div className="prose max-w-none">
      {documentToReactComponents(content, options)}
    </div>
  );
};

export default RichText;
