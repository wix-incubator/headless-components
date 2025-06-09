import { BuyNow, PayNow } from "@wix/headless-stores/react";
import { buyNowServiceBinding, payNowServiceBinding } from "@wix/headless-stores/services";
import {
  createServicesManager,
  createServicesMap,
} from "@wix/services-manager";
import { ServicesManagerProvider } from "@wix/services-manager-react";
import { actions } from "astro:actions";

export function ProductPage(props: { servicesConfigs: any }) {
  const payNowServiceBindingResult = payNowServiceBinding(props.servicesConfigs);
  const srvcMgr = createServicesManager(
    createServicesMap().addService(
      ...buyNowServiceBinding(props.servicesConfigs)
    ).addService(
      payNowServiceBindingResult[0],
      payNowServiceBindingResult[1],
      {
        ...payNowServiceBindingResult[2],
        //@ts-expect-error
        payNowServiceActions: actions.payNowServiceActions,
      }
    )
  );
  return (
    <ServicesManagerProvider
      servicesManager={srvcMgr}
    >
      <PayNow>
        {({
          isLoading,
          redirectToCheckout,
          productName,
          error,
        }) => (
          <button
            onClick={() => redirectToCheckout()}
            disabled={isLoading || Boolean(error)}
          >
            Pay NOW!
            </button>
        )}
        </PayNow>
    </ServicesManagerProvider>
  );
}
