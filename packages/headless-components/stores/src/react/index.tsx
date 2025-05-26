import { cart } from "@wix/ecom";
import { redirects } from "@wix/redirects";
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
      const createdCart = await cart.createCart({
        lineItems: [
          {
            catalogReference: {
              catalogItemId: props.productId,
              appId: "1380b703-ce81-ff05-f115-39571d94dfcd",
              options: {
                  options: props.variant,
              }
            },
            quantity: 1
          },
        ],
      });

      if (!createdCart || !createdCart._id) {
        throw new Error("Failed to create cart :(");
      }

      console.log(`Buy now cart created: ${createdCart._id}`);

      const { checkoutId } = await cart.createCheckout(createdCart._id, {
        channelType: cart.ChannelType.WEB
      });

      console.log(`Buy now checkout created: ${checkoutId}`);

      const { redirectSession } = await redirects.createRedirectSession({
        ecomCheckout: { checkoutId },
        callbacks: {
          postFlowUrl: window.location.href,
        },
      });

      console.log(`Buy now redirecting to: ${redirectSession?.fullUrl}`);
      window.location.href = redirectSession?.fullUrl!;
    } catch (error) {
      console.error("Error during checkout:", error);
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

