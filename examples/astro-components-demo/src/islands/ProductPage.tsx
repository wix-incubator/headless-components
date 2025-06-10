import { BuyNow } from "@wix/headless-stores/react";
import { buyNowServiceBinding } from "@wix/headless-stores/services";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import { actions } from "astro:actions";

export function ProductPage(props: { servicesConfigs: any }) {
  return (
    <ServicesManagerProvider
      servicesManager={createServicesManager(
        createServicesMap().addService(
          ...buyNowServiceBinding(props.servicesConfigs, { customCheckoutAction: actions.customCheckoutAction })
        )
      )}
    >
      <BuyNow>
        {({
          isLoading,
          redirectToCheckout,
          productName,
          price,
          currency,
          error,
        }) => (
          <button
            onClick={() => redirectToCheckout()}
            disabled={isLoading || Boolean(error)}
          >
            {error
              ? error
              : isLoading
              ? "Loading..."
              : `Buy Now ${productName} ${price} ${currency}`}
          </button>
        )}
      </BuyNow>
    </ServicesManagerProvider>
  );
}
