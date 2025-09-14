import { defineService, implementService } from "@wix/services-definitions";
import {
  menus,
  sections,
  items,
  itemVariants,
  itemLabels,
  itemModifierGroups,
  itemModifiers,
} from "@wix/restaurants";
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
} from "./types";
import {
  SignalsServiceDefinition,
  type Signal,
} from "@wix/services-definitions/core-services/signals";

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
  sections: Signal<Section[]>;
  items: Signal<EnhancedItem[]>;
  variants: Signal<Variant[]>;
  labels: Signal<Label[]>;
  modifierGroups: Signal<EnhancedModifierGroup[]>;
  modifiers: Signal<Modifier[]>;
  loading: Signal<boolean>;
  error: Signal<string | null>;
}

export const MenusServiceDefinition = defineService<
  MenusServiceAPI,
  MenusServiceConfig
>("MenusService");

type Result<T> = {
  [key in
    | "menus"
    | "sections"
    | "items"
    | "variants"
    | "labels"
    | "modifierGroups"
    | "modifiers"]?: T[];
} & {
  pagingMetadata?: CursorPagingMetadata;
};

async function fetchAllPaginated<T>(
  apiCall: (paging?: { cursor?: string }) => Promise<Result<T>>,
  dataKey: keyof Result<T>
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
  modifiers: Modifier[]
) {
  const enhancedModifierGroups: EnhancedModifierGroup[] = modifierGroups.map(
    (modifierGroup) => ({
      ...modifierGroup,
      modifiers:
        modifierGroup.modifiers
          ?.map((modifierRef) => {
            const modifier = modifiers.find((m) => m._id === modifierRef._id);
            return modifier
              ? {
                  ...modifier,
                  additionalChargeInfo: modifierRef.additionalChargeInfo,
                }
              : null;
          })
          .filter(Boolean) as EnhancedModifier[] ?? [],
    })
  );

  const enhancedItems: EnhancedItem[] = items.map((item) => {
    let mappedLabels: Label[] = [];
    if (item.labels && Array.isArray(item.labels)) {
      if (item.labels.length > 0) {
        if (typeof item.labels[0] === "string") {
          mappedLabels = item.labels
            .map((labelId) => labels.find((label) => label._id === labelId))
            .filter(Boolean) as Label[];
        } else if (
          item.labels[0] &&
          typeof item.labels[0] === "object" &&
          "_id" in item.labels[0]
        ) {
          mappedLabels = item.labels
            .map((labelRef: Label) =>
              labels.find((label) => label._id === labelRef._id)
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
        item.modifierGroups
          ?.map((modifierGroupRef: ModifierGroup) =>
            enhancedModifierGroups.find((mg) => mg._id === modifierGroupRef._id)
          )
          .filter(Boolean) as EnhancedModifierGroup[] ?? [],
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

export const MenusService = implementService.withConfig<MenusServiceConfig>()(
  MenusServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const menusSignal = signalsService.signal<Menu[]>(config.menus || []);
    const sectionsSignal = signalsService.signal<Section[]>(
      config.sections || []
    );
    const itemsSignal = signalsService.signal<EnhancedItem[]>(
      config.items || []
    );
    const variantsSignal = signalsService.signal<Variant[]>(
      config.variants || []
    );
    const labelsSignal = signalsService.signal<Label[]>(config.labels || []);
    const modifierGroupsSignal = signalsService.signal<EnhancedModifierGroup[]>(
      config.modifierGroups || []
    );
    const modifiersSignal = signalsService.signal<Modifier[]>(
      config.modifiers || []
    );
    const loadingSignal = signalsService.signal<boolean>(false);
    const errorSignal = signalsService.signal<string | null>(null);

    return {
      menus: menusSignal,
      sections: sectionsSignal,
      items: itemsSignal,
      variants: variantsSignal,
      labels: labelsSignal,
      modifierGroups: modifierGroupsSignal,
      modifiers: modifiersSignal,
      loading: loadingSignal,
      error: errorSignal,
    };
  }
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
        "menus"
      ),
      fetchAllPaginated<Section>(
        (paging) => sections.listSections({ paging }),
        "sections"
      ),
      fetchAllPaginated<Item>((paging) => items.listItems({ paging }), "items"),
      fetchAllPaginated<Variant>(
        (paging) => itemVariants.listVariants({ paging }),
        "variants"
      ),
      fetchAllPaginated<Label>(() => itemLabels.listLabels(), "labels"),
      fetchAllPaginated<ModifierGroup>(
        (paging) => itemModifierGroups.listModifierGroups({ paging }),
        "modifierGroups"
      ),
      fetchAllPaginated<Modifier>(
        (paging) => itemModifiers.listModifiers({ paging }),
        "modifiers"
      ),
    ]);

    const enhanced = createEnhancedEntities(
      allItems,
      allVariants,
      allLabels,
      allModifierGroups,
      allModifiers
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
