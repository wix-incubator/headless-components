import { cart } from "@wix/ecom";
import { redirects, checkout } from "@wix/redirects";
import { useState } from "react";

export function BuyNow(props: {
  productId: string;
  variant?: Record<string, string>;
  children: (props: {
    isLoading: boolean;
    redirectToCheckout: () => void;
  }) => React.ReactNode;
}) {
  console.log("BuyNow component render:start", props);
  const [isLoading, setIsLoading] = useState(false);

  const redirectToCheckout = async () => {
    console.log("BuyNow redirectToCheckout");
    try {
      setIsLoading(true);

      const { checkoutId } = await checkout.createCheckout({
        lineItems: [{
          catalogReference: {
            catalogItemId: props.productId,
            appId: "1380b703-ce81-ff05-f115-39571d94dfcd",
            options: {
                options: props.variant,
            }
          },
          quantity: 1
        }],
        channelType: checkout.ChannelType.WEB,
      });

      const { redirectSession } = await redirects.createRedirectSession({
        ecomCheckout: { checkoutId },
        callbacks: {
          postFlowUrl: window.location.href,
        },
      });

      window.location.href = redirectSession?.fullUrl!;
    } finally {
      setIsLoading(false);
    }
  }

  console.log("BuyNow component render:end");
  return props.children({
    isLoading,
    redirectToCheckout,
  })
}

export function Stores() {
  return <div>Stores</div>;
}

