import type { Item as ItemType } from '../../services/common-types';
import { media } from '@wix/sdk';

/**
 * Props for Item headless component
 */
export interface ItemProps {
  /** Line item data */
  item: ItemType;
  /** Render prop function that receives item data */
  children: (props: ItemRenderProps) => React.ReactNode;
}

export interface SelectedOption {
  name: string;
  value: string | { name: string; code: string };
}

/**
 * Render props for Item component
 */
export interface ItemRenderProps {
  /** Item name */
  name: string;
  /** Item description */
  description: string;
  /** Item image URL */
  image: string | null;
  /** Item price */
  price: string;
}

/**
 * Headless component for individual menu item
 *
 * @example
 * ```tsx
 * <Item.Item item={item}>
 *   {({ name, description, image, price }) => (
 *     <div>
 *       <h3>{name}</h3>
 *       <p>{description}</p>
 *       <p>{price}</p>
 *       <img src={image} alt={name} />
 *     </div>
 *   )}
 * </Item.Item>
 * ```
 */
export const Item = (props: ItemProps) => {
  const item = props.item;

  if (!item) {
    return props.children({
      name: '',
      description: '',
      price: '',
      image: null,
    });
  }

  // Fix image URL access - properly handle null/undefined image
  let image: string | null = null;
  if (item.image) {
    try {
      image = media.getImageUrl(item.image).url;
    } catch (error) {
      console.warn('Failed to get image URL:', error);
      image = null;
    }
  }

  return props.children({
    name: item.name || '',
    description: item.description || '',
    image,
    price: item.priceInfo?.price || '',
  });
};
