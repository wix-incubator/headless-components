import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import React from 'react';
import { useCategoryItemRepeaterContext } from './Categories.js';
import { isActiveCategory } from './helpers.js';

const enum TestIds {
  blogCategoryLabel = 'blog-category-label',
  blogCategoryLink = 'blog-category-link',
  blogCategoryImageUrl = 'blog-category-image-url',
  blogCategoryDescription = 'blog-category-description',
}

export interface LabelProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ label: string }> | React.ReactNode;
}

/**
 * Displays the category label with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Blog.Category.Label />
 *
 * // Custom styling
 * <Blog.Category.Label className="text-lg font-bold" />
 *
 * // Custom rendering with asChild
 * <Blog.Category.Label asChild>
 *   {({ label }) => <h2 className="category-title">{label}</h2>}
 * </Blog.Category.Label>
 * ```
 */
export const Label = React.forwardRef<HTMLElement, LabelProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { category } = useCategoryItemRepeaterContext();

  if (!category?.label) return null;

  const label = category.label;
  const attributes = {
    'data-testid': TestIds.blogCategoryLabel,
    'data-has-image': !!category.imageUrl,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ label }}
      content={label}
    >
      <span>{label}</span>
    </AsChildSlot>
  );
});

Label.displayName = 'Blog.Category.Label';

export interface DescriptionProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ description: string }> | React.ReactNode;
}

/**
 * Displays the category description with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Blog.Category.Description />
 *
 * // Custom styling
 * <Blog.Category.Description className="text-gray-600" />
 *
 * // Custom rendering with asChild
 * <Blog.Category.Description asChild>
 *   {({ description }) => <div>{description}</div>}
 * </Blog.Category.Description>
 * ```
 */
export const Description = React.forwardRef<HTMLElement, DescriptionProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { category, imageUrl } = useCategoryItemRepeaterContext();

  if (!category?.description) return null;

  const description = category.description;
  const attributes = {
    'data-testid': TestIds.blogCategoryDescription,
    'data-has-image': !!imageUrl,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ description }}
      content={description}
    >
      <p>{description}</p>
    </AsChildSlot>
  );
});

Description.displayName = 'Blog.Category.Description';

export interface LinkProps {
  asChild?: boolean;
  className?: string;
  baseUrl?: string;
  /** The pathname of the current page */
  pathname?: string;
  children?:
    | AsChildChildren<{
        href: string;
        /** Only available if pathname is provided */
        isActive: boolean;
      }>
    | React.ReactNode;
}

/**
 * Creates a link to the category page with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default link
 * <Blog.Category.Link baseUrl="/category/" />
 *
 * // Custom styling
 * <Blog.Category.Link
 *   baseUrl="/blog/category/"
 *   className="text-blue-600 hover:underline"
 * />
 *
 * // Custom rendering with asChild
 * <Blog.Category.Link baseUrl="/category/" asChild>
 *   {({ href }) => (
 *     <Link to={href} className="custom-link">
 *       <Blog.Category.Label />
 *     </Link>
 *   )}
 * </Blog.Category.Link>
 * ```
 */
export const Link = React.forwardRef<HTMLElement, LinkProps>((props, ref) => {
  const { asChild, children, className, pathname, baseUrl = '' } = props;
  const { category, imageUrl } = useCategoryItemRepeaterContext();

  const href = category.isCustom ? category.slug : `${baseUrl}${category.slug}`;
  const isActive = isActiveCategory(pathname, baseUrl, category);
  const attributes = {
    'data-testid': TestIds.blogCategoryLink,
    'data-href': href,
    'data-active': isActive,
    'aria-current': isActive ? 'page' : undefined,
    'data-has-image': !!imageUrl,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ href, isActive }}
      content={href}
    >
      <a href={href}>{category.label}</a>
    </AsChildSlot>
  );
});

Link.displayName = 'Blog.Category.Link';

export interface ImageProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ imageUrl: string }> | React.ReactNode;
}

/**
 * Displays the category image with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default image
 * <Blog.Category.Image />
 *
 * // Custom styling
 * <Blog.Category.Image className="w-full h-48 object-cover rounded-lg" />
 *
 * // Custom rendering with asChild
 * <Blog.Category.Image asChild>
 *   {({ imageUrl }) => (
 *     <div className="relative">
 *       <img src={imageUrl} alt="Category" className="w-full h-32" />
 *       <div className="absolute inset-0 bg-black/30" />
 *     </div>
 *   )}
 * </Blog.Category.Image>
 * ```
 */
export const Image = React.forwardRef<HTMLElement, ImageProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { category, imageUrl } = useCategoryItemRepeaterContext();

  if (!imageUrl) return null;

  const attributes = {
    'data-testid': TestIds.blogCategoryImageUrl,
    'data-has-image': !!imageUrl,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ imageUrl }}
      content={imageUrl}
    >
      <img src={imageUrl} alt={category.label} />
    </AsChildSlot>
  );
});

Image.displayName = 'Blog.Category.Image';
