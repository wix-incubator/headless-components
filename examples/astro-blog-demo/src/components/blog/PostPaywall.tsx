import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useMember } from "@/integrations";
import {
  PricingPlans,
  type PlanDurationData,
  type PlanRecurrenceData,
} from "@wix/pricing-plans/components";
import { CheckIcon, Loader2Icon } from "lucide-react";
import React from "react";

type PostPaywallProps = {
  pricingPlanIds: string[];
  uiLocale: string;
};

export default function PostPaywall({
  pricingPlanIds,
  uiLocale,
}: PostPaywallProps) {
  const { isAuthenticated, member, actions } = useMember();
  const colorOverlay = (
    <div className="pointer-events-none absolute bottom-full left-0 mb-1 h-32 w-full bg-gradient-to-t from-background via-background/90 via-30% to-transparent" />
  );

  const subscribeNowCta = (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Subscribe Now</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] max-w-screen-xl overflow-auto px-2 sm:px-6">
        <DialogHeader className="mb-2 mt-4">
          <DialogTitle className="text-center font-heading text-3xl">
            Choose your pricing plan
          </DialogTitle>
          <DialogDescription className="text-center font-paragraph">
            Choose a plan that fits your needs and unlocks full content.
          </DialogDescription>
        </DialogHeader>
        <div className="d-flex justify-center">
          <PricingPlans.PlanList.Root
            planListServiceConfig={{ planIds: pricingPlanIds }}
          >
            <PricingPlans.PlanList.Plans
              className="grid grid-cols-[repeat(auto-fit,minmax(288px,1fr))] grid-rows-[repeat(auto-fit,minmax(0,auto))] justify-center gap-6"
              loadingState={
                <>
                  {/* Skeleton loader for the plan list */}
                  <div className="aspect-[3/4] w-full animate-pulse rounded-lg bg-foreground/5"></div>
                  <div className="aspect-[3/4] w-full animate-pulse rounded-lg bg-foreground/5"></div>
                  <div className="aspect-[3/4] w-full animate-pulse rounded-lg bg-foreground/5"></div>
                </>
              }
            >
              <PricingPlans.PlanList.PlanRepeater>
                <div
                  className={`row-span-7 grid grid-rows-subgrid gap-0 rounded-lg border border-foreground/15 text-foreground shadow-xl`}
                >
                  <PricingPlans.Plan.Image className="h-36 w-full rounded-t-lg object-cover object-center" />

                  <section className="row-span-5 grid grid-rows-subgrid gap-4 px-3 py-6 text-center sm:px-6">
                    <PricingPlans.Plan.Name
                      className="-mt-2 text-balance font-heading text-2xl"
                      asChild
                    >
                      <h3 />
                    </PricingPlans.Plan.Name>

                    <div className="grid justify-center text-center font-heading lining-nums">
                      <PricingPlans.Plan.Price asChild>
                        {({ price }) => {
                          const { currencySymbol, currencyValue } =
                            toCurrencyParts(
                              uiLocale,
                              price.amount,
                              price.currency
                            );

                          return (
                            <div className="flex justify-center gap-1">
                              <span className="text-lg font-normal">
                                {currencySymbol}
                              </span>
                              <span className="-mt-1 text-5xl">
                                {currencyValue}
                              </span>
                            </div>
                          );
                        }}
                      </PricingPlans.Plan.Price>
                      <PricingPlans.Plan.Recurrence>
                        {React.forwardRef<HTMLSpanElement, PlanRecurrenceData>(
                          ({ recurrence }, ref) => {
                            if (!recurrence) return null;

                            const periodText = recurrence.period.toLowerCase();
                            const displayText =
                              recurrence.count === 1
                                ? ` / ${periodText}`
                                : ` every ${recurrence.count} ${periodText}s`;

                            return (
                              <span
                                ref={ref}
                                className="font-paragraph text-sm text-foreground/80"
                              >
                                {displayText}
                              </span>
                            );
                          }
                        )}
                      </PricingPlans.Plan.Recurrence>
                    </div>

                    <PricingPlans.Plan.Description
                      className="row-start-3 text-balance font-paragraph text-foreground/80"
                      asChild
                    >
                      <p />
                    </PricingPlans.Plan.Description>

                    <PricingPlans.Plan.Duration>
                      {React.forwardRef<HTMLSpanElement, PlanDurationData>(
                        ({ duration }, ref) => {
                          if (!duration) return null;

                          return (
                            <span
                              ref={ref}
                              className="row-start-4 font-paragraph text-sm text-foreground/60"
                            >
                              Valid for {duration.count}{" "}
                              {duration.period.toLowerCase()}
                              {duration.count === 1 ? "" : "s"}
                            </span>
                          );
                        }
                      )}
                    </PricingPlans.Plan.Duration>

                    <PricingPlans.Plan.Action.BuyNow
                      className="row-start-5"
                      asChild
                    >
                      <Button className="group">
                        <span className="hidden group-data-[in-progress=false]:contents">
                          Buy Now
                        </span>
                        <span className="hidden group-data-[in-progress=true]:contents">
                          <Loader2Icon className="animate-spin" />
                          Processing...
                        </span>
                      </Button>
                    </PricingPlans.Plan.Action.BuyNow>
                  </section>

                  <Separator className="mx-6 w-auto" />

                  <section className="flex flex-col gap-4 px-6 py-6 empty:hidden">
                    <PricingPlans.Plan.Perks className="mx-auto max-w-fit space-y-2">
                      <PricingPlans.Plan.PerksRepeater>
                        <div className="flex items-center font-paragraph text-sm text-foreground/80">
                          <CheckIcon className="mr-2 h-4 w-4 flex-shrink-0 text-primary" />
                          <PricingPlans.Plan.PerkItem />
                        </div>
                      </PricingPlans.Plan.PerksRepeater>
                    </PricingPlans.Plan.Perks>
                  </section>
                </div>
              </PricingPlans.PlanList.PlanRepeater>
            </PricingPlans.PlanList.Plans>
          </PricingPlans.PlanList.Root>
        </div>
      </DialogContent>
    </Dialog>
  );

  const loginCta = (
    <div className="flex items-baseline gap-1 font-paragraph text-sm">
      {isAuthenticated ? (
        <>
          Logged in as {member?.profile?.nickname}
          <Button
            variant="link"
            className="p-0 underline"
            onClick={actions.logout}
          >
            Log out
          </Button>
        </>
      ) : (
        <>
          Already subscribed?
          <Button
            variant="link"
            className="p-0 underline"
            onClick={actions.login}
          >
            Log in
          </Button>
        </>
      )}
    </div>
  );

  return (
    <PricingPlans.PlanPaywall.Root
      planPaywallServiceConfig={{ requiredPlanIds: pricingPlanIds }}
    >
      <PricingPlans.PlanPaywall.Paywall>
        <PricingPlans.PlanPaywall.Fallback>
          <div className="relative mb-10 mt-4 grid place-items-center gap-y-6 rounded-xl py-12 text-center text-foreground">
            {colorOverlay}

            <div className="grid gap-y-2">
              <h3 className="font-heading text-xl text-foreground">
                Subscribe to get access to full content
              </h3>
              <p className="font-paragraph text-foreground">
                This post is behind a paywall. It's only available to read with
                an upgraded account.
              </p>
            </div>

            <div className="grid justify-items-center">
              {subscribeNowCta}
              {loginCta}
            </div>
          </div>
        </PricingPlans.PlanPaywall.Fallback>
      </PricingPlans.PlanPaywall.Paywall>
    </PricingPlans.PlanPaywall.Root>
  );
}

function toCurrencyParts(uiLocale: string, amount: number, currency: string) {
  const parts = new Intl.NumberFormat(uiLocale, {
    style: "currency",
    currencyDisplay: "symbol",
    minimumFractionDigits: 0,
    currency: currency,
  }).formatToParts(amount);

  const currencySymbol = parts.find((part) => part.type === "currency")?.value;
  const currencyValue = parts
    .filter((part) => part.type !== "currency")
    .map((part) => part.value)
    .join("");

  return {
    currencySymbol,
    currencyValue,
  };
}
