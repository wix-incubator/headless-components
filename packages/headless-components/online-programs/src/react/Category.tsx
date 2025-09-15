import React from 'react';
import { categories } from '@wix/online-programs';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';

enum TestIds {
  categoryId = 'program-category-id',
  categoryName = 'program-category-label',
}

interface CategoryContextValue {
  category: categories.Category;
}

const CategoryContext = React.createContext<CategoryContextValue | null>(null);

function useCategoryContext(): CategoryContextValue {
  const context = React.useContext(CategoryContext);

  if (!context) {
    throw new Error(
      'useCategoryContext must be used within a Category.Root component',
    );
  }

  return context;
}

/**
 * Props for Category.Root component
 */
interface CategoryRootProps {
  children: React.ReactNode;
  category: categories.Category;
}

/**
 * Root component that provides the Category context to its children.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Category } from '@wix/online-programs/components';
 *
 * function CategoryCard(props) {
 *  const { category } = props;
 *
 *   return (
 *    <Category.Root category={category}>
 *      <Category.Label />
 *      <Category.Id />
 *    </Category.Root>
 *   );
 * }
 * ```
 */
function Root(props: CategoryRootProps): React.ReactNode {
  const { category, children } = props;

  return (
    <CategoryContext.Provider
      value={{
        category,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

/**
 * Props for Category.Id component
 */
interface CategoryIdProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    id: string;
  }>;
  className?: string;
}

/**
 * Headless component for category id display
 *
 * @component
 * @example
 * ```tsx
 * import { Category } from '@wix/online-programs/components';
 *
 * function CategoryCard(props) {
 *  const { category } = props;
 *
 *   return (
 *    <Category.Root category={category}>
 *      <Category.Id>
 *        {({ id }) => (
 *          <span>Category ID: {id}</span>
 *        )}
 *      </Category.Id>
 *    </Category.Root>
 *   );
 * }
 * ```
 */
const Id = React.forwardRef<HTMLElement, CategoryIdProps>((props, ref) => {
  const { asChild, children, className } = props;

  const { category } = useCategoryContext();

  const { _id: id } = category;

  if (!id) {
    return null;
  }

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.categoryId}
      customElement={children}
      customElementProps={{ id }}
      content={id}
    >
      <span>{id}</span>
    </AsChildSlot>
  );
});

/**
 * Props for Category.Label component
 */
interface CategoryLabelProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    label: string;
  }>;
  className?: string;
}

/**
 * Headless component for category id display
 *
 * @component
 * @example
 * ```tsx
 * import { Category } from '@wix/online-programs/components';
 *
 * function CategoryCard(props) {
 *  const { category } = props;
 *
 *   return (
 *    <Category.Root category={category}>
 *      <Category.Label />
 *    </Category.Root>
 *   );
 * }
 * ```
 */
const Label = React.forwardRef<HTMLElement, CategoryLabelProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const { category } = useCategoryContext();

    const { label } = category;

    if (!label) {
      return null;
    }

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.categoryName}
        customElement={children}
        customElementProps={{ label }}
        content={label}
      >
        <span>{label}</span>
      </AsChildSlot>
    );
  },
);

/**
 * Compound component for Category with all sub-components
 */
export const Category = {
  Root,
  Id,
  Label,
} as const;
