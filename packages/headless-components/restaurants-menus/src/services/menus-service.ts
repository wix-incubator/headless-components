import { defineService, implementService } from '@wix/services-definitions';
import {
  menus,
  sections,
  items,
  itemVariants,
  itemLabels,
  itemModifierGroups,
  itemModifiers,
} from '@wix/restaurants';
import type {
  Menu,
  Section,
  Item,
  Variant,
  Label,
  ModifierGroup,
  Modifier,
  EnhancedItem,
  EnhancedModifierGroup,
  CursorPagingMetadata,
  EnhancedModifier,
  Location,
} from './types.js';
import {
  SignalsServiceDefinition,
  type Signal,
  type ReadOnlySignal,
} from '@wix/services-definitions/core-services/signals';

export interface MenusServiceConfig {
  autoLoad?: boolean;
  menus?: Menu[];
  sections?: Section[];
  items?: EnhancedItem[];
  variants?: Variant[];
  labels?: Label[];
  modifierGroups?: EnhancedModifierGroup[];
  modifiers?: Modifier[];
}
export interface MenusServiceAPI {
  menus: Signal<Menu[]>;
  filteredMenus: ReadOnlySignal<Menu[]>;
  sections: Signal<Section[]>;
  items: Signal<EnhancedItem[]>;
  variants: Signal<Variant[]>;
  labels: Signal<Label[]>;
  modifierGroups: Signal<EnhancedModifierGroup[]>;
  modifiers: Signal<Modifier[]>;
  locations: Signal<Location[]>;
  loading: Signal<boolean>;
  error: Signal<string | null>;
  selectedMenu: Signal<Menu | null>;
  selectedLocation: Signal<string | null>;
}

export const MenusServiceDefinition = defineService<
  MenusServiceAPI,
  MenusServiceConfig
>('MenusService');

type Result<T> = {
  [key in
    | 'menus'
    | 'sections'
    | 'items'
    | 'variants'
    | 'labels'
    | 'modifierGroups'
    | 'modifiers']?: T[];
} & {
  pagingMetadata?: CursorPagingMetadata;
};

async function fetchAllPaginated<T>(
  apiCall: (paging?: { cursor?: string }) => Promise<Result<T>>,
  dataKey: keyof Result<T>,
): Promise<T[]> {
  const allData: T[] = [];
  let cursor: string | null | undefined;

  do {
    try {
      const response = await apiCall(cursor ? { cursor } : undefined);
      const currentData = (response[dataKey] as T[]) ?? [];
      allData.push(...currentData);

      cursor = response.pagingMetadata?.cursors?.next;
    } catch (error) {
      console.error(`Error fetching ${dataKey}:`, error);
      break;
    }
  } while (cursor);

  return allData;
}

function createEnhancedEntities(
  items: Item[],
  variants: Variant[],
  labels: Label[],
  modifierGroups: ModifierGroup[],
  modifiers: Modifier[],
) {
  const enhancedModifierGroups: EnhancedModifierGroup[] = modifierGroups.map(
    (modifierGroup) => ({
      ...modifierGroup,
      modifiers:
        (modifierGroup.modifiers
          ?.map((modifierRef) => {
            const modifier = modifiers.find((m) => m._id === modifierRef._id);
            return modifier
              ? {
                  ...modifier,
                  additionalChargeInfo: modifierRef.additionalChargeInfo,
                }
              : null;
          })
          .filter(Boolean) as EnhancedModifier[]) ?? [],
    }),
  );

  const enhancedItems: EnhancedItem[] = items.map((item) => {
    let mappedLabels: Label[] = [];
    if (item.labels && Array.isArray(item.labels)) {
      if (item.labels.length > 0) {
        if (typeof item.labels[0] === 'string') {
          mappedLabels = item.labels
            .map((labelId) => labels.find((label) => label._id === labelId))
            .filter(Boolean) as Label[];
        } else if (
          item.labels[0] &&
          typeof item.labels[0] === 'object' &&
          '_id' in item.labels[0]
        ) {
          mappedLabels = item.labels
            .map((labelRef: Label) =>
              labels.find((label) => label._id === labelRef._id),
            )
            .filter(Boolean) as Label[];
        } else {
          mappedLabels = item.labels as Label[];
        }
      }
    }

    return {
      ...item,
      labels: mappedLabels,
      modifierGroups:
        (item.modifierGroups
          ?.map((modifierGroupRef: ModifierGroup) =>
            enhancedModifierGroups.find(
              (mg) => mg._id === modifierGroupRef._id,
            ),
          )
          .filter(Boolean) as EnhancedModifierGroup[]) ?? [],
      priceVariants: item.priceVariants
        ? item.priceVariants.variants?.map((variant) => {
            const variantObj =
              variants.find((v) => v._id === variant.variantId) ||
              ({} as Variant);
            return {
              ...variantObj,
              priceInfo: variant.priceInfo,
            };
          })
        : undefined,
    };
  });

  return {
    enhancedItems,
    enhancedModifierGroups,
  };
}

export const getLocations = (menus: Menu[]) => {
  return menus.reduce<Location[]>((acc, menu) => {
    const locationId = menu.businessLocationId;
    const locationName = menu.businessLocationDetails?.name;
    const archived = menu.businessLocationDetails?.archived;

    if (locationId && !archived) {
      const existingLocation = acc.find((loc) => loc.id === locationId);
      if (!existingLocation) {
        acc.push({
          id: locationId,
          name: locationName || `Location ${locationId}`,
        });
      }
    }
    return acc;
  }, []);
};

export const MenusService = implementService.withConfig<MenusServiceConfig>()(
  MenusServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const menusSignal = signalsService.signal<Menu[]>(config.menus || []);
    const sectionsSignal = signalsService.signal<Section[]>(
      config.sections || [],
    );
    const itemsSignal = signalsService.signal<EnhancedItem[]>(
      config.items || [],
    );
    const variantsSignal = signalsService.signal<Variant[]>(
      config.variants || [],
    );
    const labelsSignal = signalsService.signal<Label[]>(config.labels || []);
    const modifierGroupsSignal = signalsService.signal<EnhancedModifierGroup[]>(
      config.modifierGroups || [],
    );
    const modifiersSignal = signalsService.signal<Modifier[]>(
      config.modifiers || [],
    );
    const locationsSignal = signalsService.signal<Location[]>([]);
    const loadingSignal = signalsService.signal<boolean>(false);
    const errorSignal = signalsService.signal<string | null>(null);
    const selectedMenuSignal = signalsService.signal<Menu | null>(null);
    const selectedLocationSignal = signalsService.signal<string | null>(null);

    const updateLocations = () => {
      const currentMenus = menusSignal.get();
      const locations = getLocations(currentMenus);
      locationsSignal.set(locations);
    };

    const filterMenusByLocation = () => {
      const allMenus = menusSignal.get();
      const selectedLocationId = selectedLocationSignal.get();

      if (!selectedLocationId || selectedLocationId === 'all') {
        // If no location selected or "all" selected, show all menus
        return allMenus;
      }

      // Filter menus by selected location
      return allMenus.filter(menu => menu.businessLocationId === selectedLocationId);
    };

    signalsService.effect(() => {
      updateLocations();
    });

    // Reset selected menu when location changes
    signalsService.effect(() => {
      const selectedMenu = selectedMenuSignal.get();

      // If there's a selected menu, check if it's still valid for the current location
      if (selectedMenu) {
        const filteredMenus = filterMenusByLocation();
        const isMenuStillValid = filteredMenus.some(menu => menu._id === selectedMenu._id);

        // If the selected menu is not available in the filtered menus, reset selection
        if (!isMenuStillValid) {
          selectedMenuSignal.set(null);
        }
      }
    });

    // Create a computed signal for filtered menus
    const filteredMenusSignal = signalsService.computed(() => {
      return filterMenusByLocation();
    });

    return {
      menus: menusSignal,
      filteredMenus: filteredMenusSignal,
      sections: sectionsSignal,
      items: itemsSignal,
      variants: variantsSignal,
      labels: labelsSignal,
      modifierGroups: modifierGroupsSignal,
      modifiers: modifiersSignal,
      locations: locationsSignal,
      loading: loadingSignal,
      error: errorSignal,
      selectedMenu: selectedMenuSignal,
      selectedLocation: selectedLocationSignal,
    };
  },
);

export async function loadMenusServiceConfig(): Promise<MenusServiceConfig> {
  try {
    const [
      allMenus,
      allSections,
      allItems,
      allVariants,
      allLabels,
      allModifierGroups,
      allModifiers,
    ] = await Promise.all([
      fetchAllPaginated<Menu>(
        (paging) => menus.listMenus({ onlyVisible: true, paging }),
        'menus',
      ),
      fetchAllPaginated<Section>(
        (paging) => sections.listSections({ paging }),
        'sections',
      ),
      fetchAllPaginated<Item>((paging) => items.listItems({ paging }), 'items'),
      fetchAllPaginated<Variant>(
        (paging) => itemVariants.listVariants({ paging }),
        'variants',
      ),
      fetchAllPaginated<Label>(() => itemLabels.listLabels(), 'labels'),
      fetchAllPaginated<ModifierGroup>(
        (paging) => itemModifierGroups.listModifierGroups({ paging }),
        'modifierGroups',
      ),
      fetchAllPaginated<Modifier>(
        (paging) => itemModifiers.listModifiers({ paging }),
        'modifiers',
      ),
    ]);

    const enhanced = createEnhancedEntities(
      allItems,
      allVariants,
      allLabels,
      allModifierGroups,
      allModifiers,
    );

    return {
      menus: allMenus,
      sections: allSections,
      items: enhanced.enhancedItems,
      variants: allVariants,
      labels: allLabels,
      modifierGroups: enhanced.enhancedModifierGroups,
      modifiers: allModifiers,
    };
  } catch (err) {
    throw err;
  }
}
