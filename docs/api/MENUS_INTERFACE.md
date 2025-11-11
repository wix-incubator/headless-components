# Menus Interface Documentation

A comprehensive restaurant menus display component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The Menus component follows a compound component pattern where each part can be composed together to create flexible menu displays. Components are organized hierarchically from Menus → Menu → Section → Item → Variant/Label/ModifierGroup → Modifier.

## Components

### Menus.Root

The root container that initializes the service and provides context to all child components.

**Props**

```tsx
interface MenusRootProps {
  children: React.ReactNode;
  config: MenusServiceConfig;
}
```

**Example**

```tsx
<Menus.Root config={menusConfig}>
  {/* All menus components */}
</Menus.Root>
```

---

### Menus.LocationSelector

Dropdown selector for filtering menus by location. Only renders if more than 1 real location exists (excluding "All" option).

**Props**

```tsx
interface LocationSelectorProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    locations: Location[];
    selectedLocation: string | null;
    onLocationSelect: (location: string) => void;
  }>;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  viewportClassName?: string;
  optionClassName?: string;
  scrollUpButtonClassName?: string;
  scrollDownButtonClassName?: string;
  placeholder?: string;
  allText?: string;
  showAll?: boolean;
}
```

**Example**

```tsx
// Default usage
<Menus.LocationSelector
  className="w-full"
  triggerClassName="w-full p-2 border rounded-md"
  placeholder="Choose your location"
/>

// asChild with custom component
<Menus.LocationSelector asChild>
  {React.forwardRef(({locations, selectedLocation, onLocationSelect, ...props}, ref) => (
    <Select.Root ref={ref} {...props} value={selectedLocation || ''} onValueChange={onLocationSelect}>
      <Select.Trigger>
        <Select.Value placeholder="Select a location" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content>
          <Select.Viewport>
            {locations.map(location => (
              <Select.Item key={location.id} value={location.id}>
                <Select.ItemText>{location.name}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  ))}
</Menus.LocationSelector>
```

**Data Attributes**

- `data-testid="location-selector"` - Applied to location selector container

---

### Menus.MenuSelector

Tabs selector for choosing a specific menu. Only renders if more than 1 real menu exists (excluding "All" option).

**Props**

```tsx
interface MenuSelectorProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    menus: Menu[];
    selectedMenu: Menu | null;
    onMenuSelect: (menu: Menu) => void;
  }>;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  allText?: string;
  showAll?: boolean;
}
```

**Example**

```tsx
// Default usage
<Menus.MenuSelector
  className="w-full"
  listClassName="flex space-x-1"
  triggerClassName="px-4 py-2 rounded-md"
/>

// asChild with custom tabs
<Menus.MenuSelector asChild>
  {React.forwardRef(({menus, selectedMenu, onMenuSelect, ...props}, ref) => (
    <Tabs.Root ref={ref} {...props} value={selectedMenu?._id || ''} onValueChange={(value) => {
      const menu = menus.find(m => m._id === value);
      if (menu) onMenuSelect(menu);
    }}>
      <Tabs.List>
        {menus.map(menu => (
          <Tabs.Trigger key={menu._id} value={menu._id}>
            {menu.name}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  ))}
</Menus.MenuSelector>
```

**Data Attributes**

- `data-testid="menu-selector"` - Applied to menu selector container

---

### Menus.MenusRepeater

Repeater that renders Menu.Root for each menu. If a menu is selected, renders only that menu; otherwise renders all filtered menus.

**Props**

```tsx
interface MenusRepeaterProps {
  children: React.ReactNode;
}
```

**Example**

```tsx
<Menus.MenusRepeater>
  <Menu.Name />
  <Menu.Description />
  <Menu.SectionsRepeater>
    {/* Section components */}
  </Menu.SectionsRepeater>
</Menus.MenusRepeater>
```

**Warning**: Do not use Menu.Root directly inside this repeater. The repeater automatically renders Menu.Root for each menu.

---

### Menus.Loading

Displays loading state. Only displays its children when the menus are currently loading.

**Props**

```tsx
interface LoadingProps {
  asChild?: boolean;
  children?: AsChildChildren<{ loading: boolean }>;
  className?: string;
  loadingText?: string;
}
```

**Example**

```tsx
// Default usage
<Menus.Loading className="text-center" loadingText="Loading menus..." />

// asChild with custom component
<Menus.Loading asChild>
  {React.forwardRef(({loading, ...props}, ref) => (
    <div ref={ref} {...props} className="text-center">
      {loading ? <Spinner /> : null}
    </div>
  ))}
</Menus.Loading>
```

**Data Attributes**

- `data-testid="menus-loading"` - Applied to loading element

---

### Menus.Error

Displays error state. Only displays its children when there is an error.

**Props**

```tsx
interface ErrorProps {
  asChild?: boolean;
  children?: AsChildChildren<{ error: string | null }>;
  className?: string;
  errorPrefix?: string;
}
```

**Example**

```tsx
// Default usage
<Menus.Error className="text-red-600" errorPrefix="Error: " />

// asChild with custom component
<Menus.Error asChild>
  {React.forwardRef(({error, ...props}, ref) => (
    <div ref={ref} {...props} className="text-red-600">
      {error ? `Error: ${error}` : null}
    </div>
  ))}
</Menus.Error>
```

**Data Attributes**

- `data-testid="menus-error"` - Applied to error element

---

### Menu.Root

Container for a single menu, provides menu context to all child components.

**Props**

```tsx
interface MenuRootProps {
  children: React.ReactNode;
  menu?: Menu;
}
```

**Example**

```tsx
<Menu.Root menu={menu}>
  <Menu.Name />
  <Menu.Description />
  <Menu.SectionsRepeater>
    {/* Section components */}
  </Menu.SectionsRepeater>
</Menu.Root>
```

**Warning**: Do not use this component directly if it's inside a repeater. Use the repeater component (e.g., Menus.MenusRepeater) instead, which will automatically render this Root component for each menu.

---

### Menu.Name

Displays the menu name.

**Props**

```tsx
interface MenuNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ name: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Menu.Name className="text-2xl font-semibold" />

// asChild with primitive
<Menu.Name asChild>
  <h2 className="text-2xl font-semibold" />
</Menu.Name>

// asChild with react component
<Menu.Name asChild>
  {React.forwardRef(({name, ...props}, ref) => (
    <h2 ref={ref} {...props} className="text-2xl font-semibold">
      {name}
    </h2>
  ))}
</Menu.Name>
```

**Data Attributes**

- `data-testid="menu-name"` - Applied to menu name element

---

### Menu.Description

Displays the menu description.

**Props**

```tsx
interface MenuDescriptionProps {
  asChild?: boolean;
  children?: AsChildChildren<{ description: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Menu.Description className="text-secondary-foreground" />

// asChild with primitive
<Menu.Description asChild>
  <p className="text-secondary-foreground" />
</Menu.Description>

// asChild with react component
<Menu.Description asChild>
  {React.forwardRef(({description, ...props}, ref) => (
    <p ref={ref} {...props} className="text-secondary-foreground">
      {description}
    </p>
  ))}
</Menu.Description>
```

**Data Attributes**

- `data-testid="menu-description"` - Applied to menu description element

---

### Menu.SectionsRepeater

Repeater that renders Section.Root for each section in the menu. Returns null if no sections found.

**Props**

```tsx
interface MenuSectionsRepeaterProps {
  children: React.ReactNode;
}
```

**Example**

```tsx
<Menu.SectionsRepeater>
  <Section.Name />
  <Section.Description />
  <Section.ItemsRepeater>
    {/* Item components */}
  </Section.ItemsRepeater>
</Menu.SectionsRepeater>
```

**Warning**: Do not use Section.Root directly inside this repeater. The repeater automatically renders Section.Root for each section.

---

### Section.Root

Container for a single section, provides section context to all child components.

**Props**

```tsx
interface SectionRootProps {
  children: React.ReactNode;
  section?: Section;
}
```

**Example**

```tsx
<Section.Root section={section}>
  <Section.Name />
  <Section.Description />
  <Section.ItemsRepeater>
    {/* Item components */}
  </Section.ItemsRepeater>
</Section.Root>
```

**Warning**: Do not use this component directly if it's inside a repeater. Use the repeater component (e.g., Menu.SectionsRepeater) instead, which will automatically render this Root component for each section.

---

### Section.Name

Displays the section name.

**Props**

```tsx
interface SectionNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ name: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Section.Name className="text-xl font-medium" />

// asChild with primitive
<Section.Name asChild>
  <h3 className="text-xl font-medium" />
</Section.Name>

// asChild with react component
<Section.Name asChild>
  {React.forwardRef(({name, ...props}, ref) => (
    <h3 ref={ref} {...props} className="text-xl font-medium">
      {name}
    </h3>
  ))}
</Section.Name>
```

**Data Attributes**

- `data-testid="section-name"` - Applied to section name element

---

### Section.Description

Displays the section description.

**Props**

```tsx
interface SectionDescriptionProps {
  asChild?: boolean;
  children?: AsChildChildren<{ description: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Section.Description className="text-secondary-foreground" />

// asChild with primitive
<Section.Description asChild>
  <p className="text-secondary-foreground" />
</Section.Description>

// asChild with react component
<Section.Description asChild>
  {React.forwardRef(({description, ...props}, ref) => (
    <p ref={ref} {...props} className="text-secondary-foreground">
      {description}
    </p>
  ))}
</Section.Description>
```

**Data Attributes**

- `data-testid="section-description"` - Applied to section description element

---

### Section.ItemsRepeater

Repeater that renders Item.Root for each item in the section. Returns null if no items found.

**Props**

```tsx
interface SectionItemsRepeaterProps {
  children: React.ReactNode;
}
```

**Example**

```tsx
<Section.ItemsRepeater>
  <Item.Name />
  <Item.Description />
  <Item.Price />
  <Item.Images />
  <Item.Featured />
</Section.ItemsRepeater>
```

**Warning**: Do not use Item.Root directly inside this repeater. The repeater automatically renders Item.Root for each item.

---

### Item.Root

Container for a single item, provides item context to all child components. Wraps children in a div with `data-featured` and `className="group"`.

**Props**

```tsx
interface ItemRootProps {
  children: React.ReactNode;
  item?: EnhancedItem;
}
```

**Example**

```tsx
<Item.Root item={item}>
  <Item.Name />
  <Item.Description />
  <Item.Price />
  <Item.Images />
  <Item.Featured />
  <Item.VariantsRepeater>
    {/* Variant components */}
  </Item.VariantsRepeater>
  <Item.LabelsRepeater>
    {/* Label components */}
  </Item.LabelsRepeater>
  <Item.ModifierGroupsRepeater>
    {/* ModifierGroup components */}
  </Item.ModifierGroupsRepeater>
</Item.Root>
```

**Warning**: Do not use this component directly if it's inside a repeater. Use the repeater component (e.g., Section.ItemsRepeater) instead, which will automatically render this Root component for each item.

**Data Attributes**

- `data-featured` - Item is featured (true/false)

---

### Item.Name

Displays the item name.

**Props**

```tsx
interface ItemNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ name: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Item.Name className="text-lg font-semibold" />

// asChild with primitive
<Item.Name asChild>
  <h3 className="text-lg font-semibold" />
</Item.Name>

// asChild with react component
<Item.Name asChild>
  {React.forwardRef(({name, ...props}, ref) => (
    <h3 ref={ref} {...props} className="text-lg font-semibold">
      {name}
    </h3>
  ))}
</Item.Name>
```

**Data Attributes**

- `data-testid="item-name"` - Applied to item name element

---

### Item.Description

Displays the item description.

**Props**

```tsx
interface ItemDescriptionProps {
  asChild?: boolean;
  children?: AsChildChildren<{ description: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Item.Description className="text-sm text-muted-foreground" />

// asChild with primitive
<Item.Description asChild>
  <p className="text-sm text-muted-foreground" />
</Item.Description>

// asChild with react component
<Item.Description asChild>
  {React.forwardRef(({description, ...props}, ref) => (
    <p ref={ref} {...props} className="text-sm text-muted-foreground">
      {description}
    </p>
  ))}
</Item.Description>
```

**Data Attributes**

- `data-testid="item-description"` - Applied to item description element

---

### Item.Price

Displays the item price. Returns null if no price data (`hasPrice` is false).

**Props**

```tsx
interface ItemPriceProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    price?: string;
    formattedPrice?: string;
    hasPrice: boolean;
  }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Item.Price className="text-lg font-bold text-primary" />

// asChild with primitive
<Item.Price asChild>
  <span className="text-lg font-bold text-primary" />
</Item.Price>

// asChild with react component
<Item.Price asChild>
  {React.forwardRef(({price, formattedPrice, hasPrice, ...props}, ref) => (
    <span ref={ref} {...props} className="text-lg font-bold text-primary">
      {formattedPrice || price || 'No price'}
    </span>
  ))}
</Item.Price>
```

**Data Attributes**

- `data-testid="item-price"` - Applied to item price element

---

### Item.Images

Intelligently displays item images (single or gallery). Returns null if no images. Renders single `WixMediaImage` if 1 image, or `MediaGallery` with Previous, Next, and Indicator controls if multiple images.

**Props**

```tsx
interface ItemImagesProps {
  asChild?: boolean;
  children?: AsChildRenderFunction<{
    images: string[];
    altText: string;
  }>;
  className?: string;
  previousClassName?: string;
  nextClassName?: string;
  indicatorClassName?: string;
  previousIconClassName?: string;
  nextIconClassName?: string;
}
```

**Example**

```tsx
// Default usage
<Item.Images className="w-full h-48" />

// With custom gallery controls styling
<Item.Images
  className="w-full h-48"
  previousClassName="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
  nextClassName="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
  indicatorClassName="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1"
/>

// asChild with custom component
<Item.Images asChild>
  {React.forwardRef(({images, altText, ...props}, ref) => (
    <div ref={ref} {...props} className="w-full h-48">
      {images.length > 0 && (
        images.length === 1 ? (
          <WixMediaImage media={{ image: images[0] }} alt={altText} />
        ) : (
          <MediaGallery.Root mediaGalleryServiceConfig={{ media: images.map(img => ({ image: img })) }}>
            <MediaGallery.Viewport />
            <MediaGallery.Previous />
            <MediaGallery.Next />
          </MediaGallery.Root>
        )
      )}
    </div>
  ))}
</Item.Images>
```

**Data Attributes**

- `data-testid="item-images"` - Applied to images container

---

### Item.Featured

Displays featured indicator. Returns null if not featured.

**Props**

```tsx
interface ItemFeaturedProps {
  asChild?: boolean;
  children?: AsChildChildren<{ featured: boolean }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Item.Featured className="w-4 h-4 text-blue-500" />

// asChild with primitive
<Item.Featured asChild>
  <StarFilledIcon className="w-4 h-4 text-blue-500" />
</Item.Featured>

// asChild with react component
<Item.Featured asChild>
  {React.forwardRef(({featured, ...props}, ref) => (
    <StarFilledIcon ref={ref} {...props} className="w-4 h-4 text-blue-500" />
  ))}
</Item.Featured>
```

**Data Attributes**

- `data-testid="item-featured"` - Applied to featured indicator element

---

### Item.VariantsRepeater

Repeater that renders Variant.Root for each price variant. Returns null if no variants found.

**Props**

```tsx
interface ItemVariantsRepeaterProps {
  children: React.ReactNode;
}
```

**Example**

```tsx
<Item.VariantsRepeater>
  <Variant.Name />
  <Variant.Price />
</Item.VariantsRepeater>
```

**Warning**: Do not use Variant.Root directly inside this repeater. The repeater automatically renders Variant.Root for each variant.

---

### Item.LabelsRepeater

Repeater that renders Label.Root for each label. Returns null if no labels found.

**Props**

```tsx
interface ItemLabelsRepeaterProps {
  children: React.ReactNode;
}
```

**Example**

```tsx
<Item.LabelsRepeater>
  <Label.Name />
  <Label.Icon />
</Item.LabelsRepeater>
```

**Warning**: Do not use Label.Root directly inside this repeater. The repeater automatically renders Label.Root for each label.

---

### Item.ModifierGroupsRepeater

Repeater that renders ModifierGroup.Root for each modifier group. Returns null if no modifier groups found.

**Props**

```tsx
interface ItemModifierGroupsRepeaterProps {
  children: React.ReactNode;
}
```

**Example**

```tsx
<Item.ModifierGroupsRepeater>
  <ModifierGroup.Name />
  <ModifierGroup.ModifiersRepeater>
    {/* Modifier components */}
  </ModifierGroup.ModifiersRepeater>
</Item.ModifierGroupsRepeater>
```

**Warning**: Do not use ModifierGroup.Root directly inside this repeater. The repeater automatically renders ModifierGroup.Root for each modifier group.

---

### Variant.Root

Container for a single variant, provides variant context to all child components.

**Props**

```tsx
interface VariantRootProps {
  children: React.ReactNode;
  variant: Variant & {
    priceInfo?: {
      price?: string;
      formattedPrice?: string;
    };
  };
}
```

**Example**

```tsx
<Variant.Root variant={variant}>
  <Variant.Name />
  <Variant.Price />
</Variant.Root>
```

**Warning**: Do not use this component directly if it's inside a repeater. Use the repeater component (e.g., Item.VariantsRepeater) instead, which will automatically render this Root component for each variant.

---

### Variant.Name

Displays the variant name.

**Props**

```tsx
interface VariantNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ name: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Variant.Name className="text-lg font-semibold" />

// asChild with primitive
<Variant.Name asChild>
  <h3 className="text-lg font-semibold" />
</Variant.Name>

// asChild with react component
<Variant.Name asChild>
  {React.forwardRef(({name, ...props}, ref) => (
    <h3 ref={ref} {...props} className="text-lg font-semibold">
      {name}
    </h3>
  ))}
</Variant.Name>
```

**Data Attributes**

- `data-testid="variant-name"` - Applied to variant name element

---

### Variant.Price

Displays the variant price. Returns null if no price data.

**Props**

```tsx
interface VariantPriceProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    price?: string;
    formattedPrice?: string;
    hasPrice: boolean;
  }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Variant.Price className="text-lg font-bold text-primary" />

// asChild with primitive
<Variant.Price asChild>
  <span className="text-lg font-bold text-primary" />
</Variant.Price>

// asChild with react component
<Variant.Price asChild>
  {React.forwardRef(({price, formattedPrice, hasPrice, ...props}, ref) => (
    <span ref={ref} {...props} className="text-lg font-bold text-primary">
      {formattedPrice || price || 'No price'}
    </span>
  ))}
</Variant.Price>
```

**Data Attributes**

- `data-testid="variant-price"` - Applied to variant price element

---

### Label.Root

Container for a single label, provides label context to all child components.

**Props**

```tsx
interface LabelRootProps {
  label?: Label;
  children: React.ReactNode;
}
```

**Example**

```tsx
<Label.Root label={label}>
  <Label.Name />
  <Label.Icon />
</Label.Root>
```

**Warning**: Do not use this component directly if it's inside a repeater. Use the repeater component (e.g., Item.LabelsRepeater) instead, which will automatically render this Root component for each label.

---

### Label.Name

Displays the label name.

**Props**

```tsx
interface LabelNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ name: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Label.Name className="text-xs" />

// asChild with primitive
<Label.Name asChild>
  <span className="text-xs" />
</Label.Name>

// asChild with react component
<Label.Name asChild>
  {React.forwardRef(({name, ...props}, ref) => (
    <span ref={ref} {...props} className="text-xs">
      {name}
    </span>
  ))}
</Label.Name>
```

**Data Attributes**

- `data-testid="label-name"` - Applied to label name element

---

### Label.Icon

Displays the label icon image. Renders `WixMediaImage` with icon if available.

**Props**

```tsx
interface LabelIconProps {
  asChild?: boolean;
  children?: AsChildRenderFunction<{
    hasIcon: boolean;
    icon: string | null;
    altText: string;
  }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Label.Icon className="w-4 h-4 object-contain" />

// asChild with primitive
<Label.Icon asChild>
  <img className="w-4 h-4 object-contain" />
</Label.Icon>

// asChild with custom component
<Label.Icon asChild>
  {React.forwardRef(({hasIcon, icon, altText, ...props}, ref) => (
    <div ref={ref} {...props} className="w-4 h-4">
      {hasIcon && <img src={icon} alt={altText} />}
    </div>
  ))}
</Label.Icon>
```

**Data Attributes**

- `data-testid="label-icon"` - Applied to label icon element

---

### ModifierGroup.Root

Container for a single modifier group, provides modifier group context to all child components.

**Props**

```tsx
interface ModifierGroupRootProps {
  modifierGroup?: EnhancedModifierGroup;
  children: React.ReactNode;
}
```

**Example**

```tsx
<ModifierGroup.Root modifierGroup={modifierGroup}>
  <ModifierGroup.Name />
  <ModifierGroup.ModifiersRepeater>
    {/* Modifier components */}
  </ModifierGroup.ModifiersRepeater>
</ModifierGroup.Root>
```

**Warning**: Do not use this component directly if it's inside a repeater. Use the repeater component (e.g., Item.ModifierGroupsRepeater) instead, which will automatically render this Root component for each modifier group.

---

### ModifierGroup.Name

Displays the modifier group name.

**Props**

```tsx
interface ModifierGroupNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ name: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<ModifierGroup.Name className="text-sm font-medium" />

// asChild with primitive
<ModifierGroup.Name asChild>
  <h4 className="text-sm font-medium" />
</ModifierGroup.Name>

// asChild with react component
<ModifierGroup.Name asChild>
  {React.forwardRef(({name, ...props}, ref) => (
    <h4 ref={ref} {...props} className="text-sm font-medium">
      {name}
    </h4>
  ))}
</ModifierGroup.Name>
```

**Data Attributes**

- `data-testid="modifier-group-name"` - Applied to modifier group name element

---

### ModifierGroup.ModifiersRepeater

Repeater that renders Modifier.Root for each modifier in the group. Returns null if no modifiers found.

**Props**

```tsx
interface ModifierGroupModifiersRepeaterProps {
  children: React.ReactNode;
}
```

**Example**

```tsx
<ModifierGroup.ModifiersRepeater>
  <Modifier.Name />
  <Modifier.Price />
</ModifierGroup.ModifiersRepeater>
```

**Warning**: Do not use Modifier.Root directly inside this repeater. The repeater automatically renders Modifier.Root for each modifier.

---

### Modifier.Root

Container for a single modifier, provides modifier context to all child components.

**Props**

```tsx
interface ModifierRootProps {
  modifier?: EnhancedModifier;
  children: React.ReactNode;
}
```

**Example**

```tsx
<Modifier.Root modifier={modifier}>
  <Modifier.Name />
  <Modifier.Price />
</Modifier.Root>
```

**Warning**: Do not use this component directly if it's inside a repeater. Use the repeater component (e.g., ModifierGroup.ModifiersRepeater) instead, which will automatically render this Root component for each modifier.

---

### Modifier.Name

Displays the modifier name.

**Props**

```tsx
interface ModifierNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ name: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Modifier.Name className="text-sm" />

// asChild with primitive
<Modifier.Name asChild>
  <span className="text-sm" />
</Modifier.Name>

// asChild with react component
<Modifier.Name asChild>
  {React.forwardRef(({name, ...props}, ref) => (
    <span ref={ref} {...props} className="text-sm">
      {name}
    </span>
  ))}
</Modifier.Name>
```

**Data Attributes**

- `data-testid="modifier-name"` - Applied to modifier name element

---

### Modifier.Price

Displays the modifier additional charge.

**Props**

```tsx
interface ModifierPriceProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    additionalCharge?: string;
    formattedAdditionalCharge?: string;
    hasAdditionalCharge: boolean;
  }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Modifier.Price className="text-sm font-medium" />

// asChild with primitive
<Modifier.Price asChild>
  <span className="text-sm font-medium" />
</Modifier.Price>

// asChild with react component
<Modifier.Price asChild>
  {React.forwardRef(({additionalCharge, formattedAdditionalCharge, hasAdditionalCharge, ...props}, ref) => (
    <span ref={ref} {...props} className="text-sm font-medium">
      {hasAdditionalCharge ? formattedAdditionalCharge : 'No charge'}
    </span>
  ))}
</Modifier.Price>
```

**Data Attributes**

- `data-testid="modifier-price"` - Applied to modifier price element

---

## Data Attributes Summary

| Attribute | Applied To | Purpose |
|-----------|------------|---------|
| `data-testid="location-selector"` | Menus.LocationSelector | Location selector container |
| `data-testid="menu-selector"` | Menus.MenuSelector | Menu selector container |
| `data-testid="menus-loading"` | Menus.Loading | Loading state element |
| `data-testid="menus-error"` | Menus.Error | Error state element |
| `data-testid="menu-name"` | Menu.Name | Menu name element |
| `data-testid="menu-description"` | Menu.Description | Menu description element |
| `data-testid="section-name"` | Section.Name | Section name element |
| `data-testid="section-description"` | Section.Description | Section description element |
| `data-testid="item-name"` | Item.Name | Item name element |
| `data-testid="item-description"` | Item.Description | Item description element |
| `data-testid="item-price"` | Item.Price | Item price element |
| `data-testid="item-images"` | Item.Images | Item images container |
| `data-testid="item-featured"` | Item.Featured | Featured indicator element |
| `data-featured` | Item.Root | Item featured status (true/false) |
| `data-testid="variant-name"` | Variant.Name | Variant name element |
| `data-testid="variant-price"` | Variant.Price | Variant price element |
| `data-testid="label-name"` | Label.Name | Label name element |
| `data-testid="label-icon"` | Label.Icon | Label icon element |
| `data-testid="modifier-group-name"` | ModifierGroup.Name | Modifier group name element |
| `data-testid="modifier-name"` | Modifier.Name | Modifier name element |
| `data-testid="modifier-price"` | Modifier.Price | Modifier price element |

---

## Usage Examples

### Basic Usage

```tsx
function BasicMenus() {
  const menusConfig = useMenusConfig();

  return (
    <Menus.Root config={menusConfig}>
      <Menus.LocationSelector />
      <Menus.MenuSelector />
      <Menus.MenusRepeater>
        <Menu.Name className="text-2xl font-semibold" />
        <Menu.Description className="text-secondary-foreground" />
        <Menu.SectionsRepeater>
          <Section.Name className="text-xl font-medium" />
          <Section.Description className="text-secondary-foreground" />
          <Section.ItemsRepeater>
            <Item.Name className="text-lg font-semibold" />
            <Item.Description className="text-sm text-muted-foreground" />
            <Item.Price className="text-lg font-bold text-primary" />
            <Item.Images className="w-full h-48" />
            <Item.Featured className="w-4 h-4 text-blue-500" />
          </Section.ItemsRepeater>
        </Menu.SectionsRepeater>
      </Menus.MenusRepeater>
    </Menus.Root>
  );
}
```

### Advanced Usage with Variants, Labels, and Modifiers

```tsx
function AdvancedMenus() {
  const menusConfig = useMenusConfig();

  return (
    <Menus.Root config={menusConfig}>
      <Menus.LocationSelector
        className="w-full mb-4"
        triggerClassName="w-full p-3 border rounded-lg"
      />
      <Menus.MenuSelector
        className="w-full mb-4"
        listClassName="flex space-x-2"
        triggerClassName="px-4 py-2 rounded-md"
      />
      <Menus.MenusRepeater>
        <div className="space-y-8">
          <Menu.Name className="text-3xl font-bold" />
          <Menu.Description className="text-lg text-secondary-foreground" />
          <Menu.SectionsRepeater>
            <div className="space-y-6">
              <Section.Name className="text-2xl font-semibold" />
              <Section.Description className="text-secondary-foreground" />
              <Section.ItemsRepeater>
                <div className="border rounded-lg p-4 space-y-4">
                  <Item.Name className="text-xl font-semibold" />
                  <Item.Description className="text-sm text-muted-foreground" />
                  <Item.Price className="text-xl font-bold text-primary" />
                  <Item.Images
                    className="w-full h-64 rounded-lg"
                    previousClassName="absolute left-2 top-1/2 bg-black/50 text-white p-2 rounded-full"
                    nextClassName="absolute right-2 top-1/2 bg-black/50 text-white p-2 rounded-full"
                  />
                  <Item.Featured className="w-5 h-5 text-yellow-500" />

                  <Item.VariantsRepeater>
                    <div className="flex items-center gap-2">
                      <Variant.Name className="text-sm font-medium" />
                      <Variant.Price className="text-sm font-bold" />
                    </div>
                  </Item.VariantsRepeater>

                  <Item.LabelsRepeater>
                    <div className="flex gap-2">
                      <Label.Name className="text-xs px-2 py-1 bg-secondary rounded" />
                      <Label.Icon className="w-4 h-4" />
                    </div>
                  </Item.LabelsRepeater>

                  <Item.ModifierGroupsRepeater>
                    <div className="space-y-2">
                      <ModifierGroup.Name className="text-sm font-medium" />
                      <ModifierGroup.ModifiersRepeater>
                        <div className="flex items-center justify-between">
                          <Modifier.Name className="text-sm" />
                          <Modifier.Price className="text-sm font-medium" />
                        </div>
                      </ModifierGroup.ModifiersRepeater>
                    </div>
                  </Item.ModifierGroupsRepeater>
                </div>
              </Section.ItemsRepeater>
            </div>
          </Menu.SectionsRepeater>
        </div>
      </Menus.MenusRepeater>
      <Menus.Loading loadingText="Loading menus..." />
      <Menus.Error errorPrefix="Error: " />
    </Menus.Root>
  );
}
```

