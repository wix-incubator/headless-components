import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import * as SelectedOption from './SelectedOption';

describe('SelectedOption', () => {
  describe('Root', () => {
    it('renders data-component-tag attribute on first DOM element', () => {
      const { container } = render(
        <SelectedOption.Root
          option={{
            name: 'Size',
            type: 'text',
            value: 'Large',
          }}
        >
          <div>Content</div>
        </SelectedOption.Root>,
      );

      // AsChildSlot should apply the data-component-tag to the first DOM element
      const rootElement = container.firstElementChild;
      expect(rootElement).toHaveAttribute(
        'data-component-tag',
        'ecom.selected-option-root',
      );
    });
  });
});
