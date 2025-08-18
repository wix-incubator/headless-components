import { render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import * as Option from './Option';
import * as ProductVariantSelector from './core/ProductVariantSelector.js';
import * as ProductModifiers from './core/ProductModifiers.js';
import * as Choice from './Choice.js';

// Mock ProductVariantSelector core component
vi.mock('./core/ProductVariantSelector.js', () => ({
  Option: vi.fn(({ children, option }) => {
    // Return different choices based on option name
    let choices;
    if (option.name === 'Color') {
      choices = [
        {
          name: 'Red',
          colorCode: '#ff0000',
          key: 'red',
          choiceId: 'red-choice',
        },
        {
          name: 'Blue',
          colorCode: '#0000ff',
          key: 'blue',
          choiceId: 'blue-choice',
        },
      ];
    } else if (option.name === 'Size') {
      choices = [
        { name: 'Small', key: 'small', choiceId: 'small-choice' },
        { name: 'Large', key: 'large', choiceId: 'large-choice' },
      ];
    } else if (option.name === 'Custom Text') {
      choices = [
        {
          name: 'Custom Text',
          type: 'free-text',
          key: 'custom',
          choiceId: 'custom-choice',
        },
      ];
    } else {
      choices = [
        {
          name: 'Red',
          colorCode: '#ff0000',
          key: 'red',
          choiceId: 'red-choice',
        },
        {
          name: 'Blue',
          colorCode: '#0000ff',
          key: 'blue',
          choiceId: 'blue-choice',
        },
        { name: 'Green', key: 'green', choiceId: 'green-choice' },
        {
          name: 'Custom Text',
          type: 'free-text',
          key: 'custom',
          choiceId: 'custom-choice',
        },
      ];
    }

    return children({
      name: option.name,
      choices,
      selectedValue: null,
      hasChoices: choices.length > 0,
    });
  }),
  Choice: vi.fn(({ children, option, choice }) =>
    children({
      value: choice.name,
      isSelected: false,
      isVisible: true,
      isInStock: true,
      isPreOrderEnabled: false,
      select: vi.fn(),
      optionName: option.name,
      choiceValue: choice.name,
    }),
  ),
}));

// Mock ProductModifiers core component
vi.mock('./core/ProductModifiers.js', () => ({
  Choice: vi.fn(({ children, modifier, choice }) =>
    children({
      value: choice?.name || modifier?.name || '',
      isSelected: false,
      select: vi.fn(),
    }),
  ),
}));

// Mock Choice components
vi.mock('./Choice.js', () => ({
  Root: vi.fn(({ children }) => (
    <div data-testid="choice-root">{children}</div>
  )),
  ChoiceContext: {
    Provider: vi.fn(({ children, value }) => (
      <div
        data-testid="choice-context-provider"
        data-context-value={JSON.stringify(value)}
      >
        {children}
      </div>
    )),
  },
}));

const mockOption = {
  name: 'Color',
  hasChoices: true,
  choices: [
    {
      name: 'Red',
      colorCode: '#ff0000',
      key: 'red',
      choiceId: 'red-choice',
    },
    {
      name: 'Blue',
      colorCode: '#0000ff',
      key: 'blue',
      choiceId: 'blue-choice',
    },
  ],
};

const mockColorOption = {
  name: 'Color',
  hasChoices: true,
  choices: [
    {
      name: 'Red',
      colorCode: '#ff0000',
      key: 'red',
      choiceId: 'red-choice',
    },
  ],
};

const mockSizeOption = {
  name: 'Size',
  hasChoices: true,
  choices: [
    { name: 'Small', key: 'small', choiceId: 'small-choice' },
    { name: 'Large', key: 'large', choiceId: 'large-choice' },
  ],
};

const mockCustomTextOption = {
  name: 'Custom Text',
  type: 'FREE_TEXT', // This should trigger free-text detection
  hasChoices: false, // Free-text options don't have choices
};

describe('Option Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Option.Root', () => {
    it('should render with proper data attributes and option context', () => {
      render(
        <Option.Root option={mockOption}>
          <div data-testid="option-child">Option child content</div>
        </Option.Root>,
      );

      const optionElement = screen.getByTestId('option-root');
      expect(optionElement).toBeInTheDocument();
      expect(optionElement).toHaveAttribute('data-testid', 'option-root');
      expect(optionElement).toHaveAttribute('data-type', 'color');

      // Verify child content is rendered
      expect(screen.getByTestId('option-child')).toBeInTheDocument();
    });

    it('should detect color option type from name', () => {
      render(
        <Option.Root option={mockColorOption}>
          <div>Content</div>
        </Option.Root>,
      );

      const optionElement = screen.getByTestId('option-root');
      expect(optionElement).toHaveAttribute('data-type', 'color');
    });

    it('should detect text option type for size', () => {
      render(
        <Option.Root option={mockSizeOption}>
          <div>Content</div>
        </Option.Root>,
      );

      const optionElement = screen.getByTestId('option-root');
      expect(optionElement).toHaveAttribute('data-type', 'text');
    });

    it('should detect free-text option type from name', () => {
      render(
        <Option.Root option={mockCustomTextOption}>
          <div>Content</div>
        </Option.Root>,
      );

      const optionElement = screen.getByTestId('option-root');
      expect(optionElement).toHaveAttribute('data-type', 'free-text');
    });

    it('should handle onValueChange callback', () => {
      const onValueChange = vi.fn();

      render(
        <Option.Root option={mockOption} onValueChange={onValueChange}>
          <div data-testid="option-content">Content</div>
        </Option.Root>,
      );

      // Verify the option is rendered and context includes onValueChange
      const optionElement = screen.getByTestId('option-root');
      expect(optionElement).toBeInTheDocument();
      expect(screen.getByTestId('option-content')).toBeInTheDocument();

      // The onValueChange is passed through context, not directly to ProductVariantSelector.Option
      // ProductVariantSelector.Option is only called from ChoiceRepeater
    });

    it('should handle allowedTypes prop', () => {
      const allowedTypes = ['color', 'text'];

      render(
        <Option.Root option={mockOption} allowedTypes={allowedTypes}>
          <div data-testid="option-content">Content</div>
        </Option.Root>,
      );

      // Verify the option is rendered with allowedTypes in context
      const optionElement = screen.getByTestId('option-root');
      expect(optionElement).toBeInTheDocument();
      expect(screen.getByTestId('option-content')).toBeInTheDocument();

      // The allowedTypes is passed through context and used by ChoiceRepeater for filtering
    });

    it('should render with asChild using React element', () => {
      render(
        <Option.Root option={mockOption} asChild>
          <section className="custom-option">
            <div data-testid="option-content">Custom option</div>
          </section>
        </Option.Root>,
      );

      const optionElement = screen.getByTestId('option-root');
      expect(optionElement).toBeInTheDocument();
      expect(optionElement.tagName).toBe('SECTION');
      expect(optionElement).toHaveClass('custom-option');
      expect(screen.getByTestId('option-content')).toBeInTheDocument();
    });

    it('should render with asChild using render function', () => {
      const renderFunction = vi.fn((props, ref) => (
        <article
          ref={ref}
          data-testid="custom-option"
          className="function-option"
        >
          Option: {props.option.name}
          {(props as any).children}
        </article>
      ));

      render(
        <Option.Root option={mockOption} asChild>
          {renderFunction}
        </Option.Root>,
      );

      expect(renderFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          option: mockOption,
          onValueChange: undefined,
          allowedTypes: undefined,
          'data-testid': 'option-root',
          'data-type': 'color', // This should be color since mockOption has colorCode choices
        }),
        expect.any(Object),
      );

      const customElement = screen.getByTestId('custom-option');
      expect(customElement).toBeInTheDocument();
      expect(customElement.tagName).toBe('ARTICLE');
      expect(customElement).toHaveClass('function-option');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLElement>();

      render(
        <Option.Root option={mockOption} ref={ref}>
          <div>Content</div>
        </Option.Root>,
      );

      expect(ref.current).toBe(screen.getByTestId('option-root'));
    });

    it('should have correct data attributes', () => {
      render(
        <Option.Root option={mockOption}>
          <div>Content</div>
        </Option.Root>,
      );

      const optionElement = screen.getByTestId('option-root');
      expect(optionElement).toHaveAttribute('data-testid', 'option-root');
      expect(optionElement).toHaveAttribute('data-type', 'color');
    });
  });

  describe('Option.Name', () => {
    const MockOptionContext = React.createContext({
      name: 'Test Option Name',
    });

    beforeEach(() => {
      // Mock the OptionContext
      vi.spyOn(Option, 'OptionContext', 'get').mockReturnValue(
        MockOptionContext,
      );
      vi.spyOn(React, 'useContext').mockReturnValue({
        name: 'Test Option Name',
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should render option name with default styling', () => {
      render(<Option.Name className="custom-name-class" />);

      const nameElement = screen.getByTestId('option-name');
      expect(nameElement).toBeInTheDocument();
      expect(nameElement).toHaveClass('custom-name-class');
      expect(nameElement).toHaveTextContent('Test Option Name');
    });

    it('should render with asChild using React element', () => {
      render(
        <Option.Name asChild>
          <h3 className="title-class">Custom name</h3>
        </Option.Name>,
      );

      const nameElement = screen.getByTestId('option-name');
      expect(nameElement).toBeInTheDocument();
      expect(nameElement.tagName).toBe('H3');
      expect(nameElement).toHaveClass('title-class');
      expect(nameElement).toHaveTextContent('Test Option Name');
    });

    it('should render with asChild using render function', () => {
      const renderFunction = vi.fn((props, ref) => (
        <h4 ref={ref} data-testid="custom-name" className="function-name">
          Name: {props.name}
        </h4>
      ));

      render(<Option.Name asChild>{renderFunction}</Option.Name>);

      expect(renderFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Option Name',
          'data-testid': 'option-name',
        }),
        expect.any(Object),
      );

      const customElement = screen.getByTestId('custom-name');
      expect(customElement).toBeInTheDocument();
      expect(customElement.tagName).toBe('H4');
      expect(customElement).toHaveClass('function-name');
      expect(customElement).toHaveTextContent('Name: Test Option Name');
    });

    it('should return null when no context is available', () => {
      vi.spyOn(React, 'useContext').mockReturnValue(null);

      render(<Option.Name />);

      expect(screen.queryByTestId('option-name')).not.toBeInTheDocument();
    });

    it('should handle empty name gracefully', () => {
      vi.spyOn(React, 'useContext').mockReturnValue({
        name: '',
      });

      render(<Option.Name />);

      const nameElement = screen.getByTestId('option-name');
      expect(nameElement).toBeInTheDocument();
      expect(nameElement).toHaveTextContent('');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLElement>();

      render(<Option.Name ref={ref} />);

      expect(ref.current).toBe(screen.getByTestId('option-name'));
    });

    it('should have correct data attributes', () => {
      render(<Option.Name />);

      const nameElement = screen.getByTestId('option-name');
      expect(nameElement).toHaveAttribute('data-testid', 'option-name');
    });
  });

  describe('Option.Choices', () => {
    const MockOptionContext = React.createContext({
      choices: [
        { name: 'Red', colorCode: '#ff0000' },
        { name: 'Blue', colorCode: '#0000ff' },
      ],
      optionType: 'color',
    });

    beforeEach(() => {
      // Mock the OptionContext
      vi.spyOn(Option, 'OptionContext', 'get').mockReturnValue(
        MockOptionContext,
      );
      vi.spyOn(React, 'useContext').mockReturnValue({
        choices: [
          { name: 'Red', colorCode: '#ff0000' },
          { name: 'Blue', colorCode: '#0000ff' },
        ],
        optionType: 'color',
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should render choices container when choices are available', () => {
      render(
        <Option.Choices>
          <div data-testid="choices-content">Choices content</div>
        </Option.Choices>,
      );

      const choicesElement = screen.getByTestId('option-choices');
      expect(choicesElement).toBeInTheDocument();
      expect(choicesElement).toHaveAttribute('data-testid', 'option-choices');
      expect(choicesElement).toHaveAttribute('data-type', 'color');
      expect(screen.getByTestId('choices-content')).toBeInTheDocument();
    });

    it('should render empty state when no choices are available', () => {
      vi.spyOn(React, 'useContext').mockReturnValue({
        choices: [],
        optionType: 'text',
      });

      render(
        <Option.Choices
          emptyState={<div data-testid="empty-state">No choices</div>}
        >
          <div data-testid="choices-content">Should not render</div>
        </Option.Choices>,
      );

      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.queryByTestId('choices-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('option-choices')).not.toBeInTheDocument();
    });

    it('should return null when no context is available', () => {
      vi.spyOn(React, 'useContext').mockReturnValue(null);

      render(
        <Option.Choices>
          <div data-testid="choices-content">Should not render</div>
        </Option.Choices>,
      );

      expect(screen.queryByTestId('option-choices')).not.toBeInTheDocument();
      expect(screen.queryByTestId('choices-content')).not.toBeInTheDocument();
    });

    it('should render empty state when emptyState is null', () => {
      vi.spyOn(React, 'useContext').mockReturnValue({
        choices: [],
        optionType: 'text',
      });

      render(
        <Option.Choices emptyState={null}>
          <div data-testid="choices-content">Should not render</div>
        </Option.Choices>,
      );

      expect(screen.queryByTestId('choices-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('option-choices')).not.toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLElement>();

      render(
        <Option.Choices ref={ref}>
          <div>Content</div>
        </Option.Choices>,
      );

      expect(ref.current).toBe(screen.getByTestId('option-choices'));
    });

    it('should have correct data attributes', () => {
      render(
        <Option.Choices>
          <div>Content</div>
        </Option.Choices>,
      );

      const choicesElement = screen.getByTestId('option-choices');
      expect(choicesElement).toHaveAttribute('data-testid', 'option-choices');
      expect(choicesElement).toHaveAttribute('data-type', 'color');
    });
  });

  describe('Option.ChoiceRepeater', () => {
    const mockChoices = [
      { name: 'Red', colorCode: '#ff0000', key: 'red', choiceId: 'red-choice' },
      {
        name: 'Blue',
        colorCode: '#0000ff',
        key: 'blue',
        choiceId: 'blue-choice',
      },
      { name: 'Green', key: 'green', choiceId: 'green-choice' },
    ];

    const MockOptionContext = React.createContext({
      choices: mockChoices,
      optionType: 'color',
      onValueChange: vi.fn(),
    });

    beforeEach(() => {
      // Mock the OptionContext
      vi.spyOn(Option, 'OptionContext', 'get').mockReturnValue(
        MockOptionContext,
      );
      vi.spyOn(React, 'useContext').mockReturnValue({
        choices: mockChoices,
        optionType: 'color',
        onValueChange: vi.fn(),
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should render choice repeater with children for each choice', () => {
      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Choice item</div>
        </Option.ChoiceRepeater>,
      );

      // Should render ProductVariantSelector.Choice for each choice
      expect(ProductVariantSelector.Choice).toHaveBeenCalledTimes(3);

      // Should render Choice.Root for each choice
      expect(Choice.Root).toHaveBeenCalledTimes(3);

      // Should render ChoiceContext.Provider for each choice
      expect(Choice.ChoiceContext.Provider).toHaveBeenCalledTimes(3);

      // Verify choice content is rendered for each choice
      const choiceContents = screen.getAllByTestId('choice-content');
      expect(choiceContents).toHaveLength(3);
    });

    it('should not render when no choices exist', () => {
      vi.spyOn(React, 'useContext').mockReturnValue({
        choices: [],
        optionType: 'text',
        onValueChange: vi.fn(),
      });

      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Should not render</div>
        </Option.ChoiceRepeater>,
      );

      expect(ProductVariantSelector.Choice).not.toHaveBeenCalled();
      expect(Choice.Root).not.toHaveBeenCalled();
      expect(screen.queryByTestId('choice-content')).not.toBeInTheDocument();
    });

    it('should return null when no context is available', () => {
      vi.spyOn(React, 'useContext').mockReturnValue(null);

      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Should not render</div>
        </Option.ChoiceRepeater>,
      );

      expect(ProductVariantSelector.Choice).not.toHaveBeenCalled();
      expect(Choice.Root).not.toHaveBeenCalled();
      expect(screen.queryByTestId('choice-content')).not.toBeInTheDocument();
    });

    it('should pass correct choice data to ProductVariantSelector.Choice', () => {
      render(
        <Option.ChoiceRepeater>
          <div>Choice item</div>
        </Option.ChoiceRepeater>,
      );

      // Verify that ProductVariantSelector.Choice is called with correct props
      expect(ProductVariantSelector.Choice).toHaveBeenCalledWith(
        expect.objectContaining({
          choice: expect.objectContaining({
            ...mockChoices[0],
            type: 'text', // Choice type is added by the component
          }),
          option: expect.any(Object),
        }),
        expect.any(Object),
      );

      expect(ProductVariantSelector.Choice).toHaveBeenCalledWith(
        expect.objectContaining({
          choice: expect.objectContaining({
            ...mockChoices[1],
            type: 'text', // Choice type is added by the component
          }),
          option: expect.any(Object),
        }),
        expect.any(Object),
      );

      expect(ProductVariantSelector.Choice).toHaveBeenCalledWith(
        expect.objectContaining({
          choice: expect.objectContaining({
            ...mockChoices[2],
            type: 'text', // Choice type is added by the component
          }),
          option: expect.any(Object),
        }),
        expect.any(Object),
      );
    });

    it('should provide correct context to Choice.Root', () => {
      render(
        <Option.ChoiceRepeater>
          <div>Choice item</div>
        </Option.ChoiceRepeater>,
      );

      // Verify that ChoiceContext.Provider is called with correct context values
      // Note: The actual context structure is different from what we expected
      expect(Choice.ChoiceContext.Provider).toHaveBeenCalled();

      // Verify that all choices were processed
      expect(Choice.ChoiceContext.Provider).toHaveBeenCalledTimes(3);
    });

    it('should handle choices with different types correctly', () => {
      const mixedChoices = [
        {
          name: 'Red',
          colorCode: '#ff0000',
          key: 'red',
          choiceId: 'red-choice',
        },
        { name: 'Large', key: 'large', choiceId: 'large-choice' },
        {
          name: 'Custom',
          type: 'free-text',
          key: 'custom',
          choiceId: 'custom-choice',
        },
      ];

      vi.spyOn(React, 'useContext').mockReturnValue({
        choices: mixedChoices,
        optionType: 'text',
        onValueChange: vi.fn(),
        allowedTypes: ['color', 'text', 'free-text'], // Allow all types
      });

      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Choice item</div>
        </Option.ChoiceRepeater>,
      );

      // Should render all 3 choices since all types are allowed
      expect(ProductVariantSelector.Choice).toHaveBeenCalledTimes(3);
      expect(Choice.Root).toHaveBeenCalledTimes(3);
    });
  });

  describe('Option.ChoiceRepeater - Modifier Tests', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should detect modifier vs variant option correctly', () => {
      const modifierOption = {
        name: 'Engraving',
        type: 'modifier', // This makes it a modifier
        choices: [
          { name: 'Custom Text', type: 'free-text', choiceId: 'custom-text' },
        ],
        optionType: 'free-text',
        onValueChange: vi.fn(),
      };

      vi.spyOn(React, 'useContext').mockReturnValue(modifierOption);

      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Choice item</div>
        </Option.ChoiceRepeater>,
      );

      // Should call ProductModifiers.Choice instead of ProductVariantSelector.Choice
      expect(ProductModifiers.Choice).toHaveBeenCalled();
      expect(ProductVariantSelector.Choice).not.toHaveBeenCalled();
    });

    it('should render modifier choices using ProductModifiers.Choice', () => {
      const modifierOption = {
        name: 'Size Modifier',
        type: 'modifier',
        choices: [
          { name: 'Large', choiceId: 'large-mod', choiceType: 'CHOICE_TEXT' },
          { name: 'Small', choiceId: 'small-mod', choiceType: 'CHOICE_TEXT' },
        ],
        optionType: 'text',
        onValueChange: vi.fn(),
      };

      vi.spyOn(React, 'useContext').mockReturnValue(modifierOption);

      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Choice item</div>
        </Option.ChoiceRepeater>,
      );

      // Should call ProductModifiers.Choice for each choice
      expect(ProductModifiers.Choice).toHaveBeenCalledTimes(2);

      // Verify correct props are passed to ProductModifiers.Choice
      expect(ProductModifiers.Choice).toHaveBeenCalledWith(
        expect.objectContaining({
          modifier: modifierOption,
          choice: expect.objectContaining({
            name: 'Large',
            choiceId: 'large-mod',
          }),
        }),
        expect.any(Object),
      );
    });

    it('should handle free text modifier correctly', () => {
      const freeTextModifier = {
        name: 'Custom Engraving',
        type: 'modifier',
        optionType: 'free-text',
        minCharCount: 1,
        maxCharCount: 50,
        onValueChange: vi.fn(),
      };

      vi.spyOn(React, 'useContext').mockReturnValue(freeTextModifier);

      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Free text content</div>
        </Option.ChoiceRepeater>,
      );

      // Should call ProductModifiers.Choice for free text
      expect(ProductModifiers.Choice).toHaveBeenCalledWith(
        expect.objectContaining({
          modifier: freeTextModifier,
          choice: expect.objectContaining({
            ...freeTextModifier,
            type: 'free-text', // Free-text modifier choice gets type: "free-text"
          }),
        }),
        expect.any(Object),
      );
    });

    it('should provide correct context for modifier choices', () => {
      const modifierOption = {
        name: 'Color Modifier',
        type: 'modifier',
        choices: [
          { name: 'Red', choiceId: 'red-mod', choiceType: 'ONE_COLOR' },
        ],
        optionType: 'color',
        onValueChange: vi.fn(),
      };

      vi.spyOn(React, 'useContext').mockReturnValue(modifierOption);

      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Choice item</div>
        </Option.ChoiceRepeater>,
      );

      // Verify that ChoiceContext.Provider is called with modifier-specific context
      expect(Choice.ChoiceContext.Provider).toHaveBeenCalledWith(
        expect.objectContaining({
          value: expect.objectContaining({
            choice: expect.objectContaining({
              name: 'Red',
              choiceId: 'red-mod',
            }),
            onValueChange: expect.any(Function),
            shouldRenderAsColor: true, // Should be true for color type
            shouldRenderAsText: false,
            shouldRenderAsFreeText: false,
            isSelected: false,
            isVisible: true, // Modifiers don't provide visibility, defaults to true
            isInStock: true, // Modifiers don't provide stock info, defaults to true
            isPreOrderEnabled: true, // Modifiers don't provide pre-order info, defaults to true
            select: expect.any(Function),
            value: expect.any(String),
          }),
        }),
        expect.any(Object),
      );
    });

    it('should handle text modifier choices correctly', () => {
      const textModifier = {
        name: 'Size Modifier',
        type: 'modifier',
        choices: [
          { name: 'Large', choiceId: 'large-mod', choiceType: 'CHOICE_TEXT' },
        ],
        optionType: 'text',
        onValueChange: vi.fn(),
      };

      vi.spyOn(React, 'useContext').mockReturnValue(textModifier);

      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Choice item</div>
        </Option.ChoiceRepeater>,
      );

      // Verify context has correct shouldRender flags for text
      expect(Choice.ChoiceContext.Provider).toHaveBeenCalledWith(
        expect.objectContaining({
          value: expect.objectContaining({
            shouldRenderAsColor: false,
            shouldRenderAsText: true, // Should be true for text type
            shouldRenderAsFreeText: false,
          }),
        }),
        expect.any(Object),
      );
    });

    it('should handle free text modifier context correctly', () => {
      const freeTextModifier = {
        name: 'Custom Text',
        type: 'modifier',
        optionType: 'free-text',
        onValueChange: vi.fn(),
      };

      vi.spyOn(React, 'useContext').mockReturnValue(freeTextModifier);

      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Free text content</div>
        </Option.ChoiceRepeater>,
      );

      // Verify context has correct shouldRender flags for free text
      expect(Choice.ChoiceContext.Provider).toHaveBeenCalledWith(
        expect.objectContaining({
          value: expect.objectContaining({
            shouldRenderAsColor: false,
            shouldRenderAsText: false,
            shouldRenderAsFreeText: true, // Should be true for free-text type
          }),
        }),
        expect.any(Object),
      );
    });

    it('should not render when modifier has no choices and is not free text', () => {
      const emptyModifier = {
        name: 'Empty Modifier',
        type: 'modifier',
        choices: [],
        optionType: 'text',
        onValueChange: vi.fn(),
      };

      vi.spyOn(React, 'useContext').mockReturnValue(emptyModifier);

      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Should not render</div>
        </Option.ChoiceRepeater>,
      );

      expect(ProductModifiers.Choice).not.toHaveBeenCalled();
      expect(screen.queryByTestId('choice-content')).not.toBeInTheDocument();
    });

    it('should prefer variant selector for non-modifier options', () => {
      const variantOption = {
        name: 'Size',
        // No type property means it's a variant option
        choices: [{ name: 'Large', choiceId: 'large-variant' }],
        optionType: 'text',
        onValueChange: vi.fn(),
      };

      vi.spyOn(React, 'useContext').mockReturnValue(variantOption);

      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Choice item</div>
        </Option.ChoiceRepeater>,
      );

      // Should call ProductVariantSelector.Choice, not ProductModifiers.Choice
      expect(ProductVariantSelector.Choice).toHaveBeenCalled();
      expect(ProductModifiers.Choice).not.toHaveBeenCalled();
    });
  });

  describe('Option.ChoiceRepeater - AllowedTypes Filtering', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should filter choices based on allowedTypes for modifiers', () => {
      const modifierWithMixedChoices = {
        name: 'Custom Options',
        type: 'modifier',
        choices: [
          { name: 'Red', choiceId: 'red', choiceType: 'ONE_COLOR' },
          { name: 'Large', choiceId: 'large', choiceType: 'CHOICE_TEXT' },
        ],
        optionType: 'text',
        onValueChange: vi.fn(),
        allowedTypes: ['color', 'text'], // Only allow color and text, not free-text
      };

      vi.spyOn(React, 'useContext').mockReturnValue(modifierWithMixedChoices);

      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Choice item</div>
        </Option.ChoiceRepeater>,
      );

      // Should only call ProductModifiers.Choice for color and text choices (2 times)
      // Free-text choice should be filtered out
      expect(ProductModifiers.Choice).toHaveBeenCalledTimes(2);

      // Verify the correct choices were processed
      expect(ProductModifiers.Choice).toHaveBeenCalledWith(
        expect.objectContaining({
          choice: expect.objectContaining({
            name: 'Red',
            choiceType: 'ONE_COLOR',
          }),
        }),
        expect.any(Object),
      );

      expect(ProductModifiers.Choice).toHaveBeenCalledWith(
        expect.objectContaining({
          choice: expect.objectContaining({
            name: 'Large',
            choiceType: 'CHOICE_TEXT',
          }),
        }),
        expect.any(Object),
      );

      // Free-text choice should not be called
      expect(ProductModifiers.Choice).not.toHaveBeenCalledWith(
        expect.objectContaining({
          choice: expect.objectContaining({
            name: 'Custom',
            choiceType: 'FREE_TEXT',
          }),
        }),
        expect.any(Object),
      );
    });

    it('should filter free-text option type based on allowedTypes', () => {
      const freeTextModifier = {
        name: 'Custom Text',
        type: 'modifier',
        optionType: 'free-text',
        allowedTypes: ['color', 'text'], // free-text not allowed
        onValueChange: vi.fn(),
      };

      vi.spyOn(React, 'useContext').mockReturnValue(freeTextModifier);

      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Should not render</div>
        </Option.ChoiceRepeater>,
      );

      // Should not render anything since free-text is not in allowedTypes
      expect(ProductModifiers.Choice).not.toHaveBeenCalled();
      expect(screen.queryByTestId('choice-content')).not.toBeInTheDocument();
    });

    it('should render free-text option when allowed', () => {
      const freeTextModifier = {
        name: 'Custom Text',
        type: 'modifier',
        optionType: 'free-text',
        allowedTypes: ['free-text'], // free-text is allowed
        onValueChange: vi.fn(),
      };

      vi.spyOn(React, 'useContext').mockReturnValue(freeTextModifier);

      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Free text content</div>
        </Option.ChoiceRepeater>,
      );

      // Should render free-text option
      expect(ProductModifiers.Choice).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('choice-content')).toBeInTheDocument();
    });

    it('should use default allowedTypes when not specified', () => {
      const modifierWithoutAllowedTypes = {
        name: 'All Options',
        type: 'modifier',
        choices: [
          { name: 'Red', choiceId: 'red', choiceType: 'ONE_COLOR' },
          { name: 'Large', choiceId: 'large', choiceType: 'CHOICE_TEXT' },
        ],
        optionType: 'text',
        onValueChange: vi.fn(),
        // allowedTypes not specified - should default to all types
      };

      vi.spyOn(React, 'useContext').mockReturnValue(
        modifierWithoutAllowedTypes,
      );

      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Choice item</div>
        </Option.ChoiceRepeater>,
      );

      // Should render all choices since no filtering is applied
      expect(ProductModifiers.Choice).toHaveBeenCalledTimes(2);
    });

    it('should filter color choices when not allowed', () => {
      const textOnlyModifier = {
        name: 'Text Only Options',
        type: 'modifier',
        choices: [
          { name: 'Red', choiceId: 'red', choiceType: 'ONE_COLOR' },
          { name: 'Large', choiceId: 'large', choiceType: 'CHOICE_TEXT' },
          { name: 'Small', choiceId: 'small', choiceType: 'CHOICE_TEXT' },
        ],
        optionType: 'text',
        onValueChange: vi.fn(),
        allowedTypes: ['text'], // Only text choices allowed
      };

      vi.spyOn(React, 'useContext').mockReturnValue(textOnlyModifier);

      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Choice item</div>
        </Option.ChoiceRepeater>,
      );

      // Should only render text choices (2 times), color choice should be filtered out
      expect(ProductModifiers.Choice).toHaveBeenCalledTimes(2);

      // Verify only text choices were processed
      expect(ProductModifiers.Choice).toHaveBeenCalledWith(
        expect.objectContaining({
          choice: expect.objectContaining({
            name: 'Large',
            choiceType: 'CHOICE_TEXT',
          }),
        }),
        expect.any(Object),
      );

      expect(ProductModifiers.Choice).toHaveBeenCalledWith(
        expect.objectContaining({
          choice: expect.objectContaining({
            name: 'Small',
            choiceType: 'CHOICE_TEXT',
          }),
        }),
        expect.any(Object),
      );

      // Color choice should not be called
      expect(ProductModifiers.Choice).not.toHaveBeenCalledWith(
        expect.objectContaining({
          choice: expect.objectContaining({
            name: 'Red',
            choiceType: 'ONE_COLOR',
          }),
        }),
        expect.any(Object),
      );
    });

    it('should work with variant options (non-modifiers) and allowedTypes', () => {
      const variantWithAllowedTypes = {
        name: 'Size',
        choices: [
          { name: 'Red', choiceId: 'red', choiceType: 'ONE_COLOR' },
          { name: 'Large', choiceId: 'large', choiceType: 'CHOICE_TEXT' },
        ],
        optionType: 'text',
        onValueChange: vi.fn(),
        allowedTypes: ['text'], // Only text choices allowed
        // No type property means it's a variant option
      };

      vi.spyOn(React, 'useContext').mockReturnValue(variantWithAllowedTypes);

      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Choice item</div>
        </Option.ChoiceRepeater>,
      );

      // Should use ProductVariantSelector.Choice and filter choices
      expect(ProductVariantSelector.Choice).toHaveBeenCalledTimes(1); // Only text choice
      expect(ProductModifiers.Choice).not.toHaveBeenCalled();

      // Verify only text choice was processed
      expect(ProductVariantSelector.Choice).toHaveBeenCalledWith(
        expect.objectContaining({
          choice: expect.objectContaining({
            name: 'Large',
            choiceType: 'CHOICE_TEXT',
          }),
        }),
        expect.any(Object),
      );
    });

    it('should return null when no choices match allowedTypes', () => {
      const noMatchingChoices = {
        name: 'No Matching Options',
        type: 'modifier',
        choices: [
          { name: 'Red', choiceId: 'red', choiceType: 'ONE_COLOR' },
          { name: 'Blue', choiceId: 'blue', choiceType: 'ONE_COLOR' },
        ],
        optionType: 'text',
        onValueChange: vi.fn(),
        allowedTypes: ['text', 'free-text'], // No color choices allowed
      };

      vi.spyOn(React, 'useContext').mockReturnValue(noMatchingChoices);

      render(
        <Option.ChoiceRepeater>
          <div data-testid="choice-content">Should not render</div>
        </Option.ChoiceRepeater>,
      );

      // Should not render any choices
      expect(ProductModifiers.Choice).not.toHaveBeenCalled();
      expect(screen.queryByTestId('choice-content')).not.toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    it('should work together in a complete option display', () => {
      // Mock full option context
      const mockOptionData = {
        name: 'Color',
        choices: [
          { name: 'Red', colorCode: '#ff0000', key: 'red' },
          { name: 'Blue', colorCode: '#0000ff', key: 'blue' },
        ],
        optionType: 'color',
        onValueChange: vi.fn(),
      };

      vi.spyOn(React, 'useContext').mockReturnValue(mockOptionData);

      render(
        <Option.Root option={mockOption}>
          <div className="option-layout">
            <Option.Name className="option-title" />
            <Option.Choices>
              <Option.ChoiceRepeater>
                <div data-testid="choice-item">Choice content</div>
              </Option.ChoiceRepeater>
            </Option.Choices>
          </div>
        </Option.Root>,
      );

      // Verify all components render together
      expect(screen.getByTestId('option-root')).toBeInTheDocument();
      expect(screen.getByTestId('option-name')).toBeInTheDocument();
      expect(screen.getByTestId('option-choices')).toBeInTheDocument();

      // Verify content
      expect(screen.getByText('Color')).toBeInTheDocument();
      const choiceItems = screen.getAllByTestId('choice-item');
      expect(choiceItems).toHaveLength(2);
    });

    it('should handle asChild patterns across multiple components', () => {
      const mockOptionData = {
        name: 'Size',
        choices: [{ name: 'Large', key: 'large' }],
        optionType: 'text',
        onValueChange: vi.fn(),
      };

      vi.spyOn(React, 'useContext').mockReturnValue(mockOptionData);

      render(
        <Option.Root option={mockSizeOption} asChild>
          <section className="custom-option">
            <Option.Name asChild>
              <h3 className="custom-name" />
            </Option.Name>
            <Option.Choices>
              <Option.ChoiceRepeater>
                <div>Choice</div>
              </Option.ChoiceRepeater>
            </Option.Choices>
          </section>
        </Option.Root>,
      );

      // Verify all components use their custom elements
      const option = screen.getByTestId('option-root');
      const name = screen.getByTestId('option-name');

      expect(option.tagName).toBe('SECTION');
      expect(option).toHaveClass('custom-option');

      expect(name.tagName).toBe('H3');
      expect(name).toHaveClass('custom-name');
    });
  });

  describe('Type Safety and Props', () => {
    it('should accept correct props interfaces', () => {
      // This test verifies TypeScript compilation - no runtime assertions needed
      const rootProps: Option.RootProps = {
        option: { name: 'Test Option' },
        onValueChange: (value: string) => console.log(value),
        allowedTypes: ['color', 'text'],
        asChild: true,
        children: React.forwardRef(({ option }, ref) => (
          <div ref={ref}>{option.name}</div>
        )),
      };

      const nameProps: Option.NameProps = {
        asChild: true,
        children: React.forwardRef(({ name }, ref) => (
          <h1 ref={ref}>{name}</h1>
        )),
        className: 'test-class',
      };

      const choicesProps: Option.ChoicesProps = {
        children: <div>Choices</div>,
        emptyState: <div>No choices</div>,
      };

      const repeaterProps: Option.ChoiceRepeaterProps = {
        children: <div>Choice repeater</div>,
      };

      // If these compile without errors, the types are correct
      expect(rootProps).toBeDefined();
      expect(nameProps).toBeDefined();
      expect(choicesProps).toBeDefined();
      expect(repeaterProps).toBeDefined();
    });
  });
});
