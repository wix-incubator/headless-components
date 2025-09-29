import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import * as items from '@wix/auto_sdk_restaurants_items';
import { type LineItem } from '@wix/ecom/services';

/**
 * API interface for the Item Detailsservice, providing reactive item data management.
 * This service handles loading and managing a single item's data, loading state, and errors.
 *
 * @interface ItemServiceAPI
 */
export interface ItemServiceAPI {
  /** Reactive signal containing the current item data */
  item: Signal<items.Item>;
  quantity: Signal<number>;
  specialRequest: Signal<string>;
  lineItem: Signal<LineItem>;
  /** Reactive signal indicating if a item is currently being loaded */
  isLoading: Signal<boolean>;
  /** Reactive signal containing any error message, or null if no error */
  error: Signal<string | null>;
  /** Function to update the quantity of the item */
  updateQuantity: (quantity: number) => void;
  /** Function to update the special request of the item */
  updateSpecialRequest: (specialRequest: string) => void;
}

/**
 * Service definition for the Item service.
 * This defines the contract that the ItemService must implement.
 *
 * @constant
 */
export const ItemServiceDefinition =
  defineService<ItemServiceAPI>('item');

/**
 * Configuration interface required to initialize the ItemService.
 * Contains the initial item data that will be loaded into the service.
 *
 * @interface ItemServiceConfig
 */
export interface ItemServiceConfig {
  /** The initial item data to configure the service with */
  item: items.Item;

  itemId?: string;

  operationId?: string;
}

/**
 * Implementation of the Item service that manages reactive item data.
 * This service provides signals for item data, loading state, and error handling,
 * along with methods to dynamically load items.
 *
 * @example
 * ```tsx
 * import { ItemService, ItemServiceDefinition } from '@wix/stores/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function ItemComponent({ itemConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [ItemServiceDefinition, ItemService.withConfig(itemConfig)]
 *     ])}>
 *       <ItemDisplay />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function ItemDisplay() {
 *   const itemService = useService(ItemServiceDefinition);
 *   const item = itemService.item.get();
 *   const isLoading = itemService.isLoading.get();
 *   const error = itemService.error.get();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return <h1>{item.name}</h1>;
 * }
 * ```
 */
const APP_ID = '9a5d83fd-8570-482e-81ab-cfa88942ee60';

export const ItemService =
  implementService.withConfig<ItemServiceConfig>()(
    ItemServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const item: Signal<items.Item> = signalsService.signal(
        config.item,
      );
      const isLoading: Signal<boolean> = signalsService.signal(
        !!config.item,
      );
      const error: Signal<string | null> = signalsService.signal(config.item ? null : 'Item not found');
      const quantity: Signal<number> = signalsService.signal(1);
      const specialRequest: Signal<string> = signalsService.signal('');
      const lineItem: Signal<LineItem> = signalsService.signal({});

      if (config.item) {
        console.log('config.item', config.item);
        lineItem.set({
          quantity: quantity.get(),
          catalogReference: {
            // @ts-expect-error - item is not typed
            catalogItemId: config.item._id,
            appId: APP_ID,
            options: {
              operationId: config.operationId,
              // @ts-expect-error - item is not typed
              menuId: config.item.menuId,
              // @ts-expect-error - item is not typed
              sectionId: config.item.sectionId,
            }
          }
        });
      }

      const updateQuantity = (_quantity: number) => {
        quantity.set(_quantity);
        const _lineItem = lineItem.get();
        lineItem.set({
          ..._lineItem,
          quantity: _quantity,
        });
      }

      const updateSpecialRequest = (_specialRequest: string) => {
        specialRequest.set(_specialRequest);
        const _lineItem = lineItem.get();
        lineItem.set({
          ..._lineItem,
          catalogReference: {
            ..._lineItem.catalogReference,
            options: {
              ..._lineItem.catalogReference?.options,
              specialRequest: _specialRequest
            }
          }
        });
      }

      return {
        item,
        quantity,
        updateQuantity,
        updateSpecialRequest,
        isLoading,
        error,
        specialRequest,
        lineItem,
      };
    },
  );

/**
 * Success result interface for item service configuration loading.
 * Returned when a item is successfully found and loaded.
 *
 * @interface SuccessItemServiceConfigResult
 */
export interface SuccessItemServiceConfigResult {
  /** Type "success" means that the item was found and the config is valid */
  type: 'success';
  /** The item config containing the loaded item data */
  config: ItemServiceConfig;
}

/**
 * Not found result interface for item service configuration loading.
 * Returned when a item with the given id cannot be found.
 *
 * @interface NotFoundItemServiceConfigResult
 */
export interface NotFoundItemServiceConfigResult {
  /** Type "notFound" means that the item was not found */
  type: 'notFound';
}

/**
 * Loads item service configuration from the Wix Items API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * a specific item by id that will be used to configure the ItemService.
 *
 * @param itemSlug The item id to load
 * @returns Promise that resolves to ItemServiceConfigResult (success with config or notFound)
 *
 * @example
 * ```astro
 * ---
 * // Astro page example - pages/item/[id].astro
 * import { loadItemServiceConfig } from '@wix/stores/services';
 * import { Item } from '@wix/stores/components';
 *
 * // Get item id from URL params
 * const { id } = Astro.params;
 *
 * // Load item data during SSR
 * const itemResult = await loadItemServiceConfig(id);
 *
 * // Handle not found case
 * if (itemResult.type === 'notFound') {
 *   return Astro.redirect('/404');
 * }
 * ---
 *
 * <Item.Root itemConfig={itemResult.config}>
 *   <Item.Name>
 *     {({ name }) => <h1>{name}</h1>}
 *   </Item.Name>
 * </Item.Root>
 * ```
 *
 * @example
 * ```tsx
 * // Next.js page example - pages/item/[id].tsx
 * import { GetServerSideProps } from 'next';
 * import { loadItemServiceConfig } from '@wix/stores/services';
 * import { Item } from '@wix/stores/components';
 *
 * interface ItemPageProps {
 *   itemConfig: Extract<Awaited<ReturnType<typeof loadItemServiceConfig>>, { type: 'success' }>['config'];
 * }
 *
 * export const getServerSideProps: GetServerSideProps<ItemPageProps> = async ({ params }) => {
 *   const id = params?.id as string;
 *
 *   // Load item data during SSR
 *   const itemResult = await loadItemServiceConfig(id);
 *
 *   // Handle not found case
 *   if (itemResult.type === 'notFound') {
 *     return {
 *       notFound: true,
 *     };
 *   }
 *
 *   return {
 *     props: {
 *       itemConfig: itemResult.config,
 *     },
 *   };
 * };
 *
 * export default function ItemPage({ itemConfig }: ItemPageProps) {
 *   return (
 *     <Item.Root itemConfig={itemConfig}>
 *       <Item.Name>
 *         {({ name }) => <h1>{name}</h1>}
 *       </Item.Name>
 *     </Item.Root>
 *   );
 * }
 * ```
 */
export function loadItemServiceConfig({
  item,
  operationId,
}: {
    item: any,
    operationId: string,
}): ItemServiceConfig {
  return { item, operationId };
}
// try {
//   if (item === null) {
//     return { item: null };
//   }
//   console.log('loadItemServiceConfig', item);
//   const itemResponse = await loadItemById(item._id);
//   console.log('itemResponse', itemResponse);

//   if (!itemResponse) {
//     return { item: itemResponse, item };
//   }

//   return { item: itemResponse };
// } catch (error) {
//   console.error(`Failed to load item "${itemId}":`, error);
//   return { item: null, itemId };
// }}
