import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { checkout } from "@wix/ecom";
import { redirects } from "@wix/redirects";
import { auth } from "@wix/essentials";


async function zibi(opts: { productName: string, price: string, policies: { content: string, title: string }[] }) {
  try {
    const checkoutResult = await auth.elevate(checkout.createCheckout)({
      customLineItems: [
        {
          productName: {
            original: opts.productName,
          },
          price: opts.price,
          quantity: 1,
          itemType: {
            preset: checkout.ItemTypeItemType.PHYSICAL,
          },
          priceDescription: {
            original: "Ze description"
          },
          policies: opts.policies || [],
        }
      ],
      channelType: checkout.ChannelType.WEB,
    });

    if (!checkoutResult._id) {
      throw new Error("Failed to create checkout");
    }

    const { redirectSession } = await redirects.createRedirectSession({
      ecomCheckout: { checkoutId: checkoutResult._id },
      callbacks: {
        postFlowUrl: `https://localhost:4321/`,
      },
    });

    return redirectSession?.fullUrl!;
  } catch (error) {
    console.error('Error creating checkout', error);
    throw error;
  }
}

const customLineItemCheckout = defineAction({
    input: z.object({
      productName: z.string(),
      price: z.string(),
    }),
    handler: async (input) => {
      try {
        const checkoutResult = await auth.elevate(checkout.createCheckout)({
          customLineItems: [
            {
              productName: {
                original: input.productName,
              },
              price: input.price,
              quantity: 1,
              itemType: {
                preset: checkout.ItemTypeItemType.PHYSICAL,
              },
              priceDescription: {
                original: "Ze description"
              },
              policies: [
                {
                  content: "Ze policy hashuv",
                  title: "POLICY blat"
                },
                {
                  content: "Ze policy hashuv https://www.walla.co.il",
                  title: "Od POLICY hashuv"
                },
                {
                  content: "Ze policy hashuv",
                  title: "Vegam policy"
                }
              ],
              consentRequiredPaymentPolicy: "please consent https://www.walla.co.il",
            }
          ],
          channelType: checkout.ChannelType.WEB,
        });

        if (!checkoutResult._id) {
          throw new Error("Failed to create checkout");
        }

        const { redirectSession } = await redirects.createRedirectSession({
          ecomCheckout: { checkoutId: checkoutResult._id },
          callbacks: {
            postFlowUrl: `https://localhost:4321/`,
          },
        });

        return redirectSession?.fullUrl!;
      } catch (error) {
        console.error('Error creating checkout', error);
        throw error;
      }
    }
});

export const payNowServiceActions = {
  customLineItemCheckout,
};
