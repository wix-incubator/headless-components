import { BuyNow } from "@wix/headless-stores/react";
import { buyNowServiceBinding } from "@wix/headless-stores/services";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { ServicesManagerProvider } from "@wix/services-manager-react";

export function ProductPage(props: { servicesConfigs: any }) {
  return (
    <ServicesManagerProvider
      servicesManager={createServicesManager(
        createServicesMap().addService(
          ...buyNowServiceBinding(props.servicesConfigs)
        )
      )}
    >
      <BuyNow>
        {({ isLoading, redirectToCheckout, productName }) => (
          <button onClick={redirectToCheckout}>
            {isLoading ? "Loading..." : `Buy Now ${productName}`}
          </button>
        )}
      </BuyNow>
    </ServicesManagerProvider>
  );
}
