import React from 'react';
import { Quantity } from '@wix/headless-components/react';
// import { cn } from '@/lib/utils';
import { Item, Label, Modifier, ModifierGroup, Variant } from '@wix/restaurants/components';
import { type ItemServiceConfig } from '@wix/headless-restaurants-olo/services';
import { ItemDetails } from '@wix/headless-restaurants-olo/react';
import { cn } from '../components/lib/utils';
import { CheckboxWithText } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
// import { CheckboxWithText } from '../checkbox';
// import { RadioGroup, RadioGroupItem } from '../radio-group';


// services:
// OLOSettingsService (operations, fulfillments, availabilities)
// CurrentCartService (add to cart, remove from cart, clear cart, update cart)
// MenusService (get menu item, get menu item modifiers, get menu item variants, get menu item labels)

// import { Button } from '@/components/ui/button';

// Import UI components - these wrap the headless primitives with styling
// import {
//   VerticalItem,
//   VerticalItemName,
//   VerticalItemPrice,
//   VerticalItemDescription,
// } from '@/components/ui/restaurants-olo';

// ========================================
// MOCK API - inline simulation of real API calls
// ========================================
// const mockVerticalAPI = {
//   getItem: async (id: string) => {
//     await new Promise(resolve => setTimeout(resolve, 200));
//     return {
//       id,
//       name: "Sample Vertical Item Details",
//       price: "$49.99",
//       description: "This is a detailed description of the vertical item showing how it would work with real data."
//     };
//   }
// };

// export async function rootRouteLoader(itemId: string) {
//   const itemDetailsServiceConfig = loadItemServiceConfig(itemId);

//   return {
//     itemDetailsServiceConfig,
//   };
// }

// ========================================
// MAIN COMPONENT - inspired by stores ProductDetails
// ========================================
interface ItemDetailsLayoutProps {
  itemId?: string;
  itemDetailsServiceConfig: ItemServiceConfig;
  onClose: () => void;
}

export const ItemDetailsLayout: React.FC<ItemDetailsLayoutProps> = ({ itemDetailsServiceConfig, onClose }) => {
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="p-6">Loading item...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ItemDetails.Root>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={
            "bg-gray-200 rounded-lg mb-4 flex items-center justify-center"
          }>
            {/* <ItemDetails.Image /> */}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="mb-4">
                <ItemDetails.Name />
              </h1>
              <div className="text-2xl mb-4">
                <ItemDetails.Price className="text-2xl" />
              </div>
            </div>

            <div>
              <ItemDetails.Description />
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {/* <ItemDetails.Labels iconClassName='w-4 h-4 object-contain' nameClassName='inline-block px-2 py-0.5 rounded-full bg-secondary text-foreground text-xs font-paragraph' /> */}
              {/* <Item.LabelsRepeater>
                <Label.Icon className="w-4 h-4 object-contain" />
                <Label.Name className="inline-block px-2 py-0.5 rounded-full bg-secondary text-foreground text-xs font-paragraph" />
              </Item.LabelsRepeater> */}
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {/* <ItemDetails.ModifierGroups
                modifierNameClassName="text-sm text-foreground font-paragraph"
                modifierPriceClassName="text-sm text-foreground font-paragraph" /> */}
              {/* <Item.ModifierGroupsRepeater>
                <ModifierGroup.ModifiersRepeater>
                  <Modifier.Name asChild>
                    {({ name }) => (
                      <div className="mb-2">
                        <CheckboxWithText
                          label={name}
                          className="rounded border border-primary text-primary focus:ring-2 focus:ring-primary/50 focus:outline-none"
                        />
                      </div>
                    )}
                  </Modifier.Name>
                  <Modifier.Price className="text-sm text-foreground font-paragraph" />
                </ModifierGroup.ModifiersRepeater>
              </Item.ModifierGroupsRepeater> */}
            </div>

            <div>
              <RadioGroup>
                <ItemDetails.Variants>
                  <div className="flex items-center">
                    <div className="flex items-center h-6">
                      <Variant.Name asChild>
                        {({ name }) => (
                          <RadioGroupItem value={name} className="mr-2" />
                        )}
                      </Variant.Name>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-sm font-paragraph text-foreground">
                        <div className="flex items-center gap-2">
                          <Variant.Name className="text-sm font-heading text-foreground" />
                          <Variant.Price className="text-sm font-paragraph text-foreground" />
                        </div>
                      </span>
                    </div>
                  </div>
                </ItemDetails.Variants>
              </RadioGroup>

            </div>

            <div>
              <ItemDetails.SpecialRequest
                label="Special Requests"
                labelClassName="block text-sm font-medium text-gray-700 mb-2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              </ItemDetails.SpecialRequest>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <ItemDetails.Quantity>
                <div className="inline-flex items-center border border-gray-300 rounded-lg bg-white shadow-sm">
                  <Quantity.Decrement
                    className={cn(
                      "w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50",
                      "transition-colors duration-200 rounded-l-lg border-r border-gray-300",
                      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                    )}
                  />
                  <Quantity.Input
                    className={cn(
                      "w-16 h-10 text-center border-0 bg-transparent",
                      "focus:outline-none focus:ring-0 text-gray-900 font-medium",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  />
                  <Quantity.Increment
                    className={cn(
                      "w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50",
                      "transition-colors duration-200 rounded-r-lg border-l border-gray-300",
                      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                    )}
                  />
                </div>
              </ItemDetails.Quantity>
            </div>

            <div className="space-y-3">
              <ItemDetails.AddToCartButton label="add to cart" className="w-full bg-gray-200 btn-primary px-6 py-3" /*onClick={onClose}*/ >
              </ItemDetails.AddToCartButton>
            </div>
          </div>
        </div>
      </ItemDetails.Root>
    </div>
  );
};

export default ItemDetailsLayout;
