import { checkout } from "@wix/ecom";
import { redirects } from "@wix/redirects";
import { useState } from "react";

// const CATALOG_APP_ID = "1380b703-ce81-ff05-f115-39571d94dfcd";
const CATLOG_APP_ID_V3 = "215238eb-22a5-4c36-9e7b-e7c08025e04e";

export function BuyNow(props: {
  productId: string;
  variant?: Record<string, string>;
  children: (props: {
    isLoading: boolean;
    redirectToCheckout: () => void;
  }) => React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const redirectToCheckout = async () => {
    try {
      setIsLoading(true);

      const checkoutResult = await checkout.createCheckout({
        lineItems: [{
          catalogReference: {
            catalogItemId: props.productId,
            appId: CATLOG_APP_ID_V3,
            options: {
                options: props.variant,
            }
          },
          quantity: 1
        }],
        channelType: checkout.ChannelType.WEB,
      });

      if (!checkoutResult._id) {
        throw new Error("Failed to create checkout");
      }

      const { redirectSession } = await redirects.createRedirectSession({
        ecomCheckout: { checkoutId: checkoutResult._id },
        callbacks: {
          postFlowUrl: window.location.href,
        },
      });

      window.location.href = redirectSession?.fullUrl!;
    } finally {
      setIsLoading(false);
    }
  }

  return props.children({
    isLoading,
    redirectToCheckout,
  })
}

