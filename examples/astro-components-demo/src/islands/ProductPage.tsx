import { BuyNow, PayNow } from "@wix/headless-stores/react";
import {
  buyNowServiceBinding,
  payNowServiceBinding,
} from "@wix/headless-stores/services";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import { actions } from "astro:actions";

// BuyNow And PayNow still dont have Root component
export function ProductPage(props: { servicesConfigs: any }) {
  return (
    <ServicesManagerProvider
      servicesManager={createServicesManager(
        createServicesMap()
          .addService(...buyNowServiceBinding(props.servicesConfigs))
          .addService(
            ...payNowServiceBinding(props.servicesConfigs, {
              customCheckoutAction: actions.buyTestProduct,
            }),
          ),
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
      <PayNow>
        {({ isLoading, redirectToCheckout, error }) => (
          <button
            onClick={() => redirectToCheckout()}
            disabled={isLoading || Boolean(error)}
          >
            {error ? error : isLoading ? "Loading..." : "Pay Now"}
          </button>
        )}
      </PayNow>
    </ServicesManagerProvider>
  );
}
