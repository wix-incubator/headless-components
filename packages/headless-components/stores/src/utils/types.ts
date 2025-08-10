import React from "react";

/**
 * Enum for content rendering formats
 */
export enum AsContent {
  Plain = "plain",
  Html = "html",
  Ricos = "ricos",
}

/**
 * Function signature for render function pattern
 */
export type AsChildRenderFunction<TProps = any> = (
  props: TProps,
  ref: React.Ref<HTMLElement>,
) => React.ReactNode;

/**
 * Object with render method pattern
 */
export type AsChildRenderObject<TProps = any> = {
  render: AsChildRenderFunction<TProps>;
};

/**
 * Union type for all supported asChild patterns
 */
export type AsChildChildren<TProps = any> =
  | React.ReactElement
  | AsChildRenderFunction<TProps>
  | AsChildRenderObject<TProps>;

/**
 * Generic interface for components that support asChild pattern.
 * This interface can be extended by specific components to add their own props.
 *
 * @template TData - The shape of the data object passed to asChild render functions
 * @template TProps - Additional props specific to the component
 *
 * @example
 * ```tsx
 * // For a component that provides name data
 * interface NameProps extends AsChildProps<{ name: string }> {
 *   // className is already included from AsChildProps
 * }
 *
 * // For a component that provides description data
 * interface DescriptionProps extends AsChildProps<{ description: string }> {
 *   as?: "plain" | "html";
 *   // className is already included from AsChildProps
 * }
 * ```
 */
export interface AsChildProps<
  TData extends Record<string, any> = Record<string, any>,
  TProps = {},
> {
  /** When true, renders as a child component instead of default element */
  asChild?: boolean;
  /** Custom render function or React element when using asChild */
  children?: AsChildChildren<TData & TProps>;
  /** CSS classes to apply to the default element */
  className?: string;
}
