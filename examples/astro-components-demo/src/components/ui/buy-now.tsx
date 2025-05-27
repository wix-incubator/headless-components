import { BuyNow as BuyNowPrimitive } from "@wix/headless-stores/react";

export function BuyNow(props: Omit<React.ComponentProps<typeof BuyNowPrimitive>, "children">) {
  return <BuyNowPrimitive productId={props.productId} variant={props.variant}>
    {({ isLoading, redirectToCheckout }) => {
      if (isLoading) return <>Preparing checkout...</>;

      return (
          <button onClick={redirectToCheckout} className="bg-blue-500 text-white p-2 rounded-md">
            Yalla, Buy!
          </button>
      );
    }}
  </BuyNowPrimitive>
}
