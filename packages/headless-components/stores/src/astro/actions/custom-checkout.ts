/// <reference types="astro/client" />
import { defineAction } from 'astro:actions';
import { getCustomLineItemCheckoutURLFactory, type CustomLineItemCheckoutOptions } from '@wix/headless-stores/server-actions';

export const customCheckoutActionFactory = (factoryOpts: CustomLineItemCheckoutOptions) => defineAction({
  handler: () => getCustomLineItemCheckoutURLFactory(factoryOpts)(),
});
