/// <reference types="astro/client" />
import { defineAction } from 'astro:actions';
import { getCustomLineItemCheckoutURLFactory, type CustomLineItemCheckoutOptions } from '@wix/headless-stores/server-actions';
import { z } from 'zod';

export const customCheckoutActionFactory = (price: string) => defineAction({
  handler: (input: CustomLineItemCheckoutOptions) => getCustomLineItemCheckoutURLFactory({ price })(input),
  input: z.object({
    productName: z.string(),
    priceDescription: z.string().optional(),
    policies: z.array(z.object({ content: z.string(), title: z.string() })).optional(),
    quantity: z.number().optional(),
  })
});
