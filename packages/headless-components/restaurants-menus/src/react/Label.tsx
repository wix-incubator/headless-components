import React from 'react';
import type { Label } from '../services/types.js';
import { WixMediaImage } from '@wix/headless-media/react';
import { AsChildSlot } from '@wix/headless-utils/react';
import type {
  AsChildChildren,
  AsChildRenderFunction,
} from '@wix/headless-utils/react';
import { TestIds } from './TestIds.js';
import { CoreLabel, LabelName, LabelIcon } from './core/index.js';

export interface LabelRootProps {
  label?: Label;
  children: React.ReactNode;
}

export const Root = (props: LabelRootProps) => {
  if (!props.label) {
    return null;
  }

  return <CoreLabel label={props.label}>{props.children}</CoreLabel>;
};

export interface LabelNameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the label name with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Label.Name className="text-xs" />
 *
 * // asChild with primitive
 * <Label.Name asChild>
 *   <span className="text-xs" />
 * </Label.Name>
 *
 * // asChild with react component
 * <Label.Name asChild>
 *   {React.forwardRef(({name, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-xs">
 *       {name}
 *     </span>
 *   ))}
 * </Label.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, LabelNameProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <LabelName>
        {({ name }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.labelName}
              customElement={children}
              customElementProps={{ name }}
              content={name}
              {...otherProps}
            >
              <div>{name}</div>
            </AsChildSlot>
          );
        }}
      </LabelName>
    );
  },
);

Name.displayName = 'Label.Name';

export interface LabelIconProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /**
   * Custom render function when using asChild.
   * Receives an object with:
   * - hasIcon: boolean - whether the label has an icon
   * - icon: string | null - the icon URL
   * - altText: string - the alt text for the icon
   */
  children?: AsChildRenderFunction<{
    hasIcon: boolean;
    icon: string | null;
    altText: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the label icon with customizable rendering following the documented API.
 * Provides both the actual icon element and a fallback element for when no icon is available.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Label.Icon className="w-4 h-4 object-contain" />
 *
 * // asChild with primitive
 * <Label.Icon asChild>
 *   <img className="w-4 h-4 object-contain" />
 * </Label.Icon>
 *
 * // asChild with custom component
 * <Label.Icon asChild>
 *   {React.forwardRef(({hasIcon, icon, altText, ...props}, ref) => (
 *     <div ref={ref} {...props} className="w-4 h-4">
 *       {hasIcon ? <img src={icon} alt={altText} /> : <span>No Icon</span>}
 *     </div>
 *   ))}
 * </Label.Icon>
 *
 * // Custom render function
 * <Label.Icon>
 *   {({ hasIcon, icon, altText }) => (
 *     <div className="w-4 h-4 flex-shrink-0">
 *       {hasIcon ? (
 *         <WixMediaImage media={{ image: icon }} alt={altText} width={16} height={16} />
 *       ) : (
 *         <div className="w-4 h-4 bg-secondary rounded" />
 *       )}
 *     </div>
 *   )}
 * </Label.Icon>
 * ```
 */
export const Icon = React.forwardRef<HTMLImageElement, LabelIconProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;

    return (
      <LabelIcon>
        {({ icon, hasIcon, altText }) => {
          if (asChild && children) {
            // Call the ForwardRefRenderFunction with the specific props
            return children({ hasIcon, icon, altText }, ref);
          }

          return (
            <WixMediaImage
              ref={ref}
              media={{ image: icon ?? '' }}
              isShape
              alt={altText}
              data-testid={TestIds.labelIcon}
              {...otherProps}
            />
          );
        }}
      </LabelIcon>
    );
  },
);

Icon.displayName = 'Label.Icon';

/**
 * Label namespace containing all label components
 * following the compound component pattern: LabelComponent.Root, LabelComponent.Name, LabelComponent.Icon
 */
export const LabelComponent = {
  /** Label root component */
  Root,
  /** Label name component */
  Name,
  /** Label icon component */
  Icon,
} as const;
