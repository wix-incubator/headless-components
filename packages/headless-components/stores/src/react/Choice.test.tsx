import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as Choice from "./Choice";
import { FreeText as FreeTextPrimitive } from "./core/ProductModifiers.js";

// Mock ProductModifiers FreeText component
vi.mock("./core/ProductModifiers.js", () => ({
  FreeText: vi.fn(({ children, modifier }) => {
    // Mock the render props pattern
    const mockRenderProps = {
      value: "",
      setText: vi.fn(),
      placeholder: `Enter ${modifier?.name || "text"}...`,
      maxChars: modifier?.maxCharCount || 100,
      mandatory: modifier?.mandatory || false,
      charCount: 0,
      isOverLimit: false,
      modifierName: modifier?.name || "modifier",
    };
    return children(mockRenderProps);
  }),
}));

// Mock choice context values for different test scenarios
const mockTextChoiceContext = {
  choice: {
    name: "Large",
    choiceId: "large-choice",
    key: "large",
    type: "text",
  },
  onValueChange: vi.fn(),
  shouldRenderAsColor: false,
  shouldRenderAsText: true,
  shouldRenderAsFreeText: false,
  isSelected: false,
  isVisible: true,
  isInStock: true,
  isPreOrderEnabled: false,
  select: vi.fn(),
  value: "Large",
  optionData: { name: "Size" },
};

const mockColorChoiceContext = {
  choice: {
    name: "Red",
    choiceId: "red-choice",
    key: "red",
    colorCode: "#ff0000",
    type: "color",
  },
  onValueChange: vi.fn(),
  shouldRenderAsColor: true,
  shouldRenderAsText: false,
  shouldRenderAsFreeText: false,
  isSelected: true,
  isVisible: true,
  isInStock: true,
  isPreOrderEnabled: false,
  select: vi.fn(),
  value: "Red",
  optionData: { name: "Color" },
};

const mockFreeTextChoiceContext = {
  choice: {
    name: "Custom Text",
    choiceId: "custom-choice",
    key: "custom",
    type: "free-text",
    minCharCount: 5,
    maxCharCount: 100,
    addedPrice: "$5.00",
  },
  onValueChange: vi.fn(),
  shouldRenderAsColor: false,
  shouldRenderAsText: false,
  shouldRenderAsFreeText: true,
  isSelected: false,
  isVisible: true,
  isInStock: true,
  isPreOrderEnabled: false,
  select: vi.fn(),
  value: "",
  optionData: { name: "Custom Text" },
};

const mockOutOfStockContext = {
  ...mockTextChoiceContext,
  isInStock: false,
  isPreOrderEnabled: false,
};

const mockPreOrderContext = {
  ...mockTextChoiceContext,
  isInStock: false,
  isPreOrderEnabled: true,
};

describe("Choice Components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Choice.Root", () => {
    it("should render with proper data attributes when context is available", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockTextChoiceContext);

      render(
        <Choice.Root>
          <div data-testid="choice-child">Choice child content</div>
        </Choice.Root>,
      );

      const choiceElement = screen.getByTestId("choice-root");
      expect(choiceElement).toBeInTheDocument();
      expect(choiceElement).toHaveAttribute("data-testid", "choice-root");
      expect(choiceElement).toHaveAttribute("data-type", "text");

      // Verify child content is rendered
      expect(screen.getByTestId("choice-child")).toBeInTheDocument();
    });

    it("should detect color type from colorCode", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockColorChoiceContext);

      render(
        <Choice.Root>
          <div>Content</div>
        </Choice.Root>,
      );

      const choiceElement = screen.getByTestId("choice-root");
      expect(choiceElement).toHaveAttribute("data-type", "color");
    });

    it("should detect free-text type from choice type", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockFreeTextChoiceContext);

      render(
        <Choice.Root>
          <div>Content</div>
        </Choice.Root>,
      );

      const choiceElement = screen.getByTestId("choice-root");
      expect(choiceElement).toHaveAttribute("data-type", "free-text");
    });

    it("should return null when no context is available", () => {
      vi.spyOn(React, "useContext").mockReturnValue(null);

      render(
        <Choice.Root>
          <div data-testid="choice-child">Should not render</div>
        </Choice.Root>,
      );

      expect(screen.queryByTestId("choice-root")).not.toBeInTheDocument();
      expect(screen.queryByTestId("choice-child")).not.toBeInTheDocument();
    });

    it("should forward ref correctly", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockTextChoiceContext);

      const ref = React.createRef<HTMLDivElement>();

      render(
        <Choice.Root ref={ref}>
          <div>Content</div>
        </Choice.Root>,
      );

      expect(ref.current).toBe(screen.getByTestId("choice-root"));
    });

    it("should have correct data attributes", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockTextChoiceContext);

      render(
        <Choice.Root>
          <div>Content</div>
        </Choice.Root>,
      );

      const choiceElement = screen.getByTestId("choice-root");
      expect(choiceElement).toHaveAttribute("data-testid", "choice-root");
      expect(choiceElement).toHaveAttribute("data-type", "text");
    });
  });

  describe("Choice.Text", () => {
    it("should render text choice when shouldRenderAsText is true", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockTextChoiceContext);

      render(<Choice.Text className="custom-text-class" />);

      const textElement = screen.getByTestId("choice-text");
      expect(textElement).toBeInTheDocument();
      expect(textElement).toHaveClass("custom-text-class");
      expect(textElement).toHaveTextContent("Large");
      expect(textElement).toHaveAttribute("data-selected", "false");
      expect(textElement).not.toHaveAttribute("disabled");
    });

    it("should render selected text choice", () => {
      vi.spyOn(React, "useContext").mockReturnValue({
        ...mockTextChoiceContext,
        isSelected: true,
      });

      render(<Choice.Text />);

      const textElement = screen.getByTestId("choice-text");
      expect(textElement).toHaveAttribute("data-selected", "true");
    });

    it("should render disabled text choice when out of stock", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockOutOfStockContext);

      render(<Choice.Text />);

      const textElement = screen.getByTestId("choice-text");
      expect(textElement).toHaveAttribute("disabled");
    });

    it("should not render disabled when pre-order is enabled", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockPreOrderContext);

      render(<Choice.Text />);

      const textElement = screen.getByTestId("choice-text");
      expect(textElement).not.toHaveAttribute("disabled");
    });

    it("should call select function when clicked", () => {
      const selectMock = vi.fn();
      vi.spyOn(React, "useContext").mockReturnValue({
        ...mockTextChoiceContext,
        select: selectMock,
      });

      render(<Choice.Text />);

      const textElement = screen.getByTestId("choice-text");
      fireEvent.click(textElement);

      expect(selectMock).toHaveBeenCalled();
    });

    it("should not render when shouldRenderAsText is false", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockColorChoiceContext);

      render(<Choice.Text />);

      expect(screen.queryByTestId("choice-text")).not.toBeInTheDocument();
    });

    it("should not render when not visible", () => {
      vi.spyOn(React, "useContext").mockReturnValue({
        ...mockTextChoiceContext,
        isVisible: false,
      });

      render(<Choice.Text />);

      expect(screen.queryByTestId("choice-text")).not.toBeInTheDocument();
    });

    it("should return null when no context is available", () => {
      vi.spyOn(React, "useContext").mockReturnValue(null);

      render(<Choice.Text />);

      expect(screen.queryByTestId("choice-text")).not.toBeInTheDocument();
    });

    it("should render with asChild using React element", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockTextChoiceContext);

      render(
        <Choice.Text asChild>
          <button className="custom-button">Custom text button</button>
        </Choice.Text>,
      );

      const textElement = screen.getByTestId("choice-text");
      expect(textElement).toBeInTheDocument();
      expect(textElement.tagName).toBe("BUTTON");
      expect(textElement).toHaveClass("custom-button");
      expect(textElement).toHaveTextContent("Large");
    });

    it("should render with asChild using render function", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockTextChoiceContext);

      const renderFunction = vi.fn((props, ref) => (
        <button ref={ref} data-testid="custom-text" className="function-text">
          Choice: {props.value} (ID: {props.id})
        </button>
      ));

      render(<Choice.Text asChild>{renderFunction}</Choice.Text>);

      expect(renderFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "large-choice",
          value: "Large",
          "data-testid": "choice-text",
          "data-selected": "false",
          disabled: false,
          onClick: expect.any(Function),
        }),
        expect.any(Object),
      );

      const customElement = screen.getByTestId("custom-text");
      expect(customElement).toBeInTheDocument();
      expect(customElement).toHaveTextContent(
        "Choice: Large (ID: large-choice)",
      );
    });

    it("should forward ref correctly", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockTextChoiceContext);

      const ref = React.createRef<HTMLButtonElement>();

      render(<Choice.Text ref={ref} />);

      expect(ref.current).toBe(screen.getByTestId("choice-text"));
    });

    it("should have correct data attributes", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockTextChoiceContext);

      render(<Choice.Text />);

      const textElement = screen.getByTestId("choice-text");
      expect(textElement).toHaveAttribute("data-testid", "choice-text");
      expect(textElement).toHaveAttribute("data-selected", "false");
    });
  });

  describe("Choice.Color", () => {
    it("should render color choice when shouldRenderAsColor is true", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockColorChoiceContext);

      render(<Choice.Color className="custom-color-class" />);

      const colorElement = screen.getByTestId("choice-color");
      expect(colorElement).toBeInTheDocument();
      expect(colorElement).toHaveClass("custom-color-class");
      expect(colorElement).toHaveAttribute("data-selected", "true");
      expect(colorElement).toHaveAttribute("title", "Red");
      expect(colorElement).toHaveStyle({ backgroundColor: "#ff0000" });
      expect(colorElement).not.toHaveAttribute("disabled");
    });

    it("should render disabled color choice when out of stock", () => {
      vi.spyOn(React, "useContext").mockReturnValue({
        ...mockColorChoiceContext,
        isInStock: false,
        isPreOrderEnabled: false,
      });

      render(<Choice.Color />);

      const colorElement = screen.getByTestId("choice-color");
      expect(colorElement).toHaveAttribute("disabled");
    });

    it("should call select function when clicked", () => {
      const selectMock = vi.fn();
      vi.spyOn(React, "useContext").mockReturnValue({
        ...mockColorChoiceContext,
        select: selectMock,
      });

      render(<Choice.Color />);

      const colorElement = screen.getByTestId("choice-color");
      fireEvent.click(colorElement);

      expect(selectMock).toHaveBeenCalled();
    });

    it("should not render when shouldRenderAsColor is false", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockTextChoiceContext);

      render(<Choice.Color />);

      expect(screen.queryByTestId("choice-color")).not.toBeInTheDocument();
    });

    it("should not render when not visible", () => {
      vi.spyOn(React, "useContext").mockReturnValue({
        ...mockColorChoiceContext,
        isVisible: false,
      });

      render(<Choice.Color />);

      expect(screen.queryByTestId("choice-color")).not.toBeInTheDocument();
    });

    it("should return null when no context is available", () => {
      vi.spyOn(React, "useContext").mockReturnValue(null);

      render(<Choice.Color />);

      expect(screen.queryByTestId("choice-color")).not.toBeInTheDocument();
    });

    it("should render with asChild using React element", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockColorChoiceContext);

      render(
        <Choice.Color asChild>
          <div className="custom-color-swatch">Custom color</div>
        </Choice.Color>,
      );

      const colorElement = screen.getByTestId("choice-color");
      expect(colorElement).toBeInTheDocument();
      expect(colorElement.tagName).toBe("DIV");
      expect(colorElement).toHaveClass("custom-color-swatch");
    });

    it("should render with asChild using render function", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockColorChoiceContext);

      const renderFunction = vi.fn((props, ref) => (
        <button
          ref={ref}
          data-testid="custom-color"
          className="function-color"
          style={{ backgroundColor: props.colorCode }}
        >
          {props.name} ({props.colorCode})
        </button>
      ));

      render(<Choice.Color asChild>{renderFunction}</Choice.Color>);

      expect(renderFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          colorCode: "#ff0000",
          name: "Red",
          id: "red-choice",
          "data-testid": "choice-color",
          "data-selected": "true",
          disabled: false,
          onClick: expect.any(Function),
        }),
        expect.any(Object),
      );

      const customElement = screen.getByTestId("custom-color");
      expect(customElement).toBeInTheDocument();
      expect(customElement).toHaveTextContent("Red (#ff0000)");
      expect(customElement).toHaveStyle({ backgroundColor: "#ff0000" });
    });

    it("should forward ref correctly", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockColorChoiceContext);

      const ref = React.createRef<HTMLButtonElement>();

      render(<Choice.Color ref={ref} />);

      expect(ref.current).toBe(screen.getByTestId("choice-color"));
    });

    it("should have correct data attributes", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockColorChoiceContext);

      render(<Choice.Color />);

      const colorElement = screen.getByTestId("choice-color");
      expect(colorElement).toHaveAttribute("data-testid", "choice-color");
      expect(colorElement).toHaveAttribute("data-selected", "true");
    });
  });

  describe("Choice.FreeText", () => {
    it("should render free text input when shouldRenderAsFreeText is true", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockFreeTextChoiceContext);

      render(<Choice.FreeText className="custom-textarea-class" />);

      const textareaElement = screen.getByTestId("choice-freetext");
      expect(textareaElement).toBeInTheDocument();
      expect(textareaElement).toHaveClass("custom-textarea-class");
      expect(textareaElement.tagName).toBe("TEXTAREA");
      expect(textareaElement).toHaveAttribute("data-selected", "false");
    });

    it("should handle text input and update selected state", () => {
      const onValueChangeMock = vi.fn();
      vi.spyOn(React, "useContext").mockReturnValue({
        ...mockFreeTextChoiceContext,
        onValueChange: onValueChangeMock,
      });

      render(<Choice.FreeText />);

      const textareaElement = screen.getByTestId(
        "choice-freetext",
      ) as HTMLTextAreaElement;

      fireEvent.change(textareaElement, {
        target: { value: "Custom text input" },
      });

      expect(onValueChangeMock).toHaveBeenCalledWith("Custom text input");
    });

    it("should show selected state when text is entered", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockFreeTextChoiceContext);

      render(<Choice.FreeText />);

      const textareaElement = screen.getByTestId(
        "choice-freetext",
      ) as HTMLTextAreaElement;

      // Initially not selected (empty)
      expect(textareaElement).toHaveAttribute("data-selected", "false");

      // Enter some text
      fireEvent.change(textareaElement, { target: { value: "Some text" } });

      // Should now be selected
      expect(textareaElement).toHaveAttribute("data-selected", "true");
    });

    it("should not render when shouldRenderAsFreeText is false", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockTextChoiceContext);

      render(<Choice.FreeText />);

      expect(screen.queryByTestId("choice-freetext")).not.toBeInTheDocument();
    });

    it("should not render when not visible", () => {
      vi.spyOn(React, "useContext").mockReturnValue({
        ...mockFreeTextChoiceContext,
        isVisible: false,
      });

      render(<Choice.FreeText />);

      expect(screen.queryByTestId("choice-freetext")).not.toBeInTheDocument();
    });

    it("should return null when no context is available", () => {
      vi.spyOn(React, "useContext").mockReturnValue(null);

      render(<Choice.FreeText />);

      expect(screen.queryByTestId("choice-freetext")).not.toBeInTheDocument();
    });

    it("should render with asChild using React element", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockFreeTextChoiceContext);

      render(
        <Choice.FreeText asChild>
          <input
            type="text"
            className="custom-input"
            placeholder="Custom input"
          />
        </Choice.FreeText>,
      );

      const inputElement = screen.getByTestId("choice-freetext");
      expect(inputElement).toBeInTheDocument();
      expect(inputElement.tagName).toBe("INPUT");
      expect(inputElement).toHaveClass("custom-input");
      expect(inputElement).toHaveAttribute("placeholder", "Custom input");
    });

    it("should render with asChild using render function", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockFreeTextChoiceContext);

      const renderFunction = vi.fn((props, ref) => (
        <textarea
          ref={ref}
          data-testid="custom-freetext"
          className="function-textarea"
          placeholder={`Enter ${props.title} (${props.minCharCount}-${props.maxCharCount} chars)`}
          onChange={props.onChange}
        />
      ));

      render(<Choice.FreeText asChild>{renderFunction}</Choice.FreeText>);

      expect(renderFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          minCharCount: 5,
          maxCharCount: 100,
          defaultAddedPrice: "$5.00",
          title: "Custom Text",
          onChange: expect.any(Function),
          "data-testid": "choice-freetext",
          "data-selected": "false",
        }),
        expect.any(Object),
      );

      const customElement = screen.getByTestId("custom-freetext");
      expect(customElement).toBeInTheDocument();
      expect(customElement).toHaveAttribute(
        "placeholder",
        "Enter Custom Text (5-100 chars)",
      );
    });

    it("should forward ref correctly", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockFreeTextChoiceContext);

      const ref = React.createRef<HTMLTextAreaElement>();

      render(<Choice.FreeText ref={ref} />);

      expect(ref.current).toBe(screen.getByTestId("choice-freetext"));
    });

    it("should have correct data attributes", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockFreeTextChoiceContext);

      render(<Choice.FreeText />);

      const textareaElement = screen.getByTestId("choice-freetext");
      expect(textareaElement).toHaveAttribute("data-testid", "choice-freetext");
      expect(textareaElement).toHaveAttribute("data-selected", "false");
    });

    it("should handle empty or whitespace-only text correctly", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockFreeTextChoiceContext);

      render(<Choice.FreeText />);

      const textareaElement = screen.getByTestId(
        "choice-freetext",
      ) as HTMLTextAreaElement;

      // Test with whitespace-only text
      fireEvent.change(textareaElement, { target: { value: "   " } });
      expect(textareaElement).toHaveAttribute("data-selected", "false");

      // Test with actual content
      fireEvent.change(textareaElement, { target: { value: "  content  " } });
      expect(textareaElement).toHaveAttribute("data-selected", "true");

      // Test with empty string
      fireEvent.change(textareaElement, { target: { value: "" } });
      expect(textareaElement).toHaveAttribute("data-selected", "false");
    });
  });

  describe("Choice.FreeText - Modifier Integration Tests", () => {
    const mockModifierChoiceContext = {
      choice: {
        name: "Custom Engraving",
        choiceId: "engraving-choice",
        key: "engraving",
        type: "free-text",
        minCharCount: 3,
        maxCharCount: 50,
        addedPrice: "$10.00",
      },
      onValueChange: vi.fn(),
      shouldRenderAsColor: false,
      shouldRenderAsText: false,
      shouldRenderAsFreeText: true,
      isSelected: false,
      isVisible: true,
      isInStock: true,
      isPreOrderEnabled: false,
      select: vi.fn(),
      value: "",
      optionData: { name: "Custom Engraving" },
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should integrate with ProductModifiers.FreeText component", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockModifierChoiceContext);

      render(<Choice.FreeText className="modifier-textarea" />);

      // Should call ProductModifiers.FreeText with correct props
      expect(FreeTextPrimitive).toHaveBeenCalledWith(
        expect.objectContaining({
          modifier: mockModifierChoiceContext.choice,
          children: expect.any(Function),
        }),
        expect.any(Object),
      );

      // Should render the textarea with modifier-specific attributes
      const textareaElement = screen.getByTestId("choice-freetext");
      expect(textareaElement).toBeInTheDocument();
      expect(textareaElement).toHaveClass("modifier-textarea");
    });

    it("should handle modifier-specific props in FreeText primitive", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockModifierChoiceContext);

      render(<Choice.FreeText />);

      // Verify FreeText primitive receives the modifier as prop
      expect(FreeTextPrimitive).toHaveBeenCalledWith(
        expect.objectContaining({
          modifier: expect.objectContaining({
            name: "Custom Engraving",
            minCharCount: 3,
            maxCharCount: 50,
            addedPrice: "$10.00",
          }),
        }),
        expect.any(Object),
      );
    });

    it("should handle text changes through modifier primitive", () => {
      const onValueChangeMock = vi.fn();
      const setTextMock = vi.fn();

      // Mock FreeTextPrimitive to provide setText function
      vi.mocked(FreeTextPrimitive).mockImplementationOnce(({ children }) => {
        const mockRenderProps = {
          value: "initial text",
          setText: setTextMock,
          placeholder: "Enter Custom Engraving...",
          maxChars: 50,
          mandatory: false,
          charCount: 12,
          isOverLimit: false,
          modifierName: "Custom Engraving",
        };
        return children(mockRenderProps);
      });

      vi.spyOn(React, "useContext").mockReturnValue({
        ...mockModifierChoiceContext,
        onValueChange: onValueChangeMock,
      });

      render(<Choice.FreeText />);

      const textareaElement = screen.getByTestId("choice-freetext");

      // Simulate text change
      fireEvent.change(textareaElement, {
        target: { value: "Custom engraving text" },
      });

      // Should call setText from the primitive
      expect(setTextMock).toHaveBeenCalledWith("Custom engraving text");
      // Should also call onValueChange callback
      expect(onValueChangeMock).toHaveBeenCalledWith("Custom engraving text");
    });

    it("should render with modifier placeholder and maxLength", () => {
      // Mock FreeTextPrimitive with specific render props
      vi.mocked(FreeTextPrimitive).mockImplementationOnce(({ children }) => {
        const mockRenderProps = {
          value: "",
          setText: vi.fn(),
          placeholder: "Enter Custom Engraving (3-50 chars)...",
          maxChars: 50,
          mandatory: false,
          charCount: 0,
          isOverLimit: false,
          modifierName: "Custom Engraving",
        };
        return children(mockRenderProps);
      });

      vi.spyOn(React, "useContext").mockReturnValue(mockModifierChoiceContext);

      render(<Choice.FreeText />);

      const textareaElement = screen.getByTestId("choice-freetext");
      expect(textareaElement).toHaveAttribute(
        "placeholder",
        "Enter Custom Engraving (3-50 chars)...",
      );
      expect(textareaElement).toHaveAttribute("maxLength", "50");
    });

    it("should handle asChild with modifier-specific props", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockModifierChoiceContext);

      const renderFunction = vi.fn((props, ref) => (
        <textarea
          ref={ref}
          data-testid="custom-modifier-textarea"
          className="modifier-input"
          placeholder={`Custom ${props.title}: ${props.minCharCount}-${props.maxCharCount} chars`}
          onChange={props.onChange}
        />
      ));

      render(<Choice.FreeText asChild>{renderFunction}</Choice.FreeText>);

      // Should pass modifier-specific props to render function
      expect(renderFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          minCharCount: 3,
          maxCharCount: 50,
          defaultAddedPrice: "$10.00",
          title: "Custom Engraving",
          onChange: expect.any(Function),
          "data-testid": "choice-freetext",
          "data-selected": "false",
        }),
        expect.any(Object),
      );

      const customElement = screen.getByTestId("custom-modifier-textarea");
      expect(customElement).toBeInTheDocument();
      expect(customElement).toHaveAttribute(
        "placeholder",
        "Custom Custom Engraving: 3-50 chars",
      );
    });

    it("should log choice data for debugging (console.log test)", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      vi.spyOn(React, "useContext").mockReturnValue(mockModifierChoiceContext);

      render(<Choice.FreeText />);

      // The component logs the choice data for debugging
      expect(consoleSpy).toHaveBeenCalledWith(
        "choice",
        mockModifierChoiceContext.choice,
      );

      consoleSpy.mockRestore();
    });

    it("should handle modifier without minCharCount/maxCharCount gracefully", () => {
      const modifierWithoutLimits = {
        ...mockModifierChoiceContext,
        choice: {
          ...mockModifierChoiceContext.choice,
          minCharCount: undefined,
          maxCharCount: undefined,
        },
      };

      vi.spyOn(React, "useContext").mockReturnValue(modifierWithoutLimits);

      const renderFunction = vi.fn((props, ref) => (
        <textarea ref={ref} data-testid="custom-textarea" />
      ));

      render(<Choice.FreeText asChild>{renderFunction}</Choice.FreeText>);

      // Should handle undefined values gracefully
      expect(renderFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          minCharCount: undefined,
          maxCharCount: undefined,
        }),
        expect.any(Object),
      );
    });

    it("should not render when shouldRenderAsFreeText is false", () => {
      vi.spyOn(React, "useContext").mockReturnValue({
        ...mockModifierChoiceContext,
        shouldRenderAsFreeText: false,
        shouldRenderAsText: true,
      });

      render(<Choice.FreeText />);

      expect(screen.queryByTestId("choice-freetext")).not.toBeInTheDocument();
      expect(FreeTextPrimitive).not.toHaveBeenCalled();
    });
  });

  describe("Integration Tests", () => {
    it("should work together in a complete choice display", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockTextChoiceContext);

      render(
        <Choice.Root>
          <div className="choice-layout">
            <Choice.Text className="choice-button" />
            <Choice.Color className="choice-color" />
            <Choice.FreeText className="choice-input" />
          </div>
        </Choice.Root>,
      );

      // Verify root renders
      expect(screen.getByTestId("choice-root")).toBeInTheDocument();

      // Only text choice should render (based on context)
      expect(screen.getByTestId("choice-text")).toBeInTheDocument();
      expect(screen.queryByTestId("choice-color")).not.toBeInTheDocument();
      expect(screen.queryByTestId("choice-freetext")).not.toBeInTheDocument();
    });

    it("should handle different choice types in the same component tree", () => {
      // Test with color context
      vi.spyOn(React, "useContext").mockReturnValue(mockColorChoiceContext);

      const { rerender } = render(
        <Choice.Root>
          <Choice.Text />
          <Choice.Color />
          <Choice.FreeText />
        </Choice.Root>,
      );

      // Only color choice should render
      expect(screen.queryByTestId("choice-text")).not.toBeInTheDocument();
      expect(screen.getByTestId("choice-color")).toBeInTheDocument();
      expect(screen.queryByTestId("choice-freetext")).not.toBeInTheDocument();

      // Test with free text context
      vi.spyOn(React, "useContext").mockReturnValue(mockFreeTextChoiceContext);

      rerender(
        <Choice.Root>
          <Choice.Text />
          <Choice.Color />
          <Choice.FreeText />
        </Choice.Root>,
      );

      // Only free text choice should render
      expect(screen.queryByTestId("choice-text")).not.toBeInTheDocument();
      expect(screen.queryByTestId("choice-color")).not.toBeInTheDocument();
      expect(screen.getByTestId("choice-freetext")).toBeInTheDocument();
    });

    it("should handle asChild patterns across multiple choice components", () => {
      vi.spyOn(React, "useContext").mockReturnValue(mockColorChoiceContext);

      render(
        <Choice.Root>
          <Choice.Color asChild>
            <button className="custom-color-button" />
          </Choice.Color>
        </Choice.Root>,
      );

      const color = screen.getByTestId("choice-color");
      expect(color.tagName).toBe("BUTTON");
      expect(color).toHaveClass("custom-color-button");
    });

    it("should maintain proper interaction behavior across choice types", () => {
      const selectMock = vi.fn();
      const onValueChangeMock = vi.fn();

      // Test text choice interaction
      vi.spyOn(React, "useContext").mockReturnValue({
        ...mockTextChoiceContext,
        select: selectMock,
      });

      const { rerender } = render(<Choice.Text />);

      fireEvent.click(screen.getByTestId("choice-text"));
      expect(selectMock).toHaveBeenCalledTimes(1);

      // Test free text interaction
      vi.spyOn(React, "useContext").mockReturnValue({
        ...mockFreeTextChoiceContext,
        onValueChange: onValueChangeMock,
      });

      rerender(<Choice.FreeText />);

      fireEvent.change(screen.getByTestId("choice-freetext"), {
        target: { value: "test input" },
      });
      expect(onValueChangeMock).toHaveBeenCalledWith("test input");
    });
  });

  describe("Type Safety and Props", () => {
    it("should accept correct props interfaces", () => {
      // This test verifies TypeScript compilation - no runtime assertions needed
      const rootProps: Choice.RootProps = {
        children: <div>Choice content</div>,
      };

      const textProps: Choice.TextProps = {
        asChild: true,
        children: React.forwardRef(({ id, value }, ref) => (
          <button ref={ref}>
            {value} ({id})
          </button>
        )),
        className: "test-class",
      };

      const colorProps: Choice.ColorProps = {
        asChild: true,
        children: React.forwardRef(({ colorCode, name, id }, ref) => (
          <div ref={ref} style={{ backgroundColor: colorCode }}>
            {name} - {id}
          </div>
        )),
        className: "test-class",
      };

      const freeTextProps: Choice.FreeTextProps = {
        asChild: true,
        children: React.forwardRef(
          ({ value, onChange, title, minCharCount, maxCharCount }, ref) => (
            <textarea
              ref={ref}
              value={value}
              onChange={onChange}
              placeholder={`${title} (${minCharCount}-${maxCharCount})`}
            />
          ),
        ),
        className: "test-class",
      };

      // If these compile without errors, the types are correct
      expect(rootProps).toBeDefined();
      expect(textProps).toBeDefined();
      expect(colorProps).toBeDefined();
      expect(freeTextProps).toBeDefined();
    });
  });

  describe("Choice Interface", () => {
    it("should accept correct Choice interface properties", () => {
      // This test verifies TypeScript compilation - no runtime assertions needed
      const choice: Choice.Choice = {
        colorCode: "#ff0000",
        choiceId: "red-choice",
        linkedMedia: [],
        type: "color",
        key: "red",
        name: "Red",
        addedPrice: "$2.00",
      };

      expect(choice).toBeDefined();
      expect(choice.colorCode).toBe("#ff0000");
      expect(choice.type).toBe("color");
      expect(choice.addedPrice).toBe("$2.00");
    });
  });
});
