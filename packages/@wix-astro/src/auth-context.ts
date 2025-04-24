import { AsyncLocalStorage } from "node:async_hooks";
import type { AuthenticationStrategy } from "@wix/sdk";

export const authStrategyAsyncLocalStorage = new AsyncLocalStorage<{
  auth: AuthenticationStrategy<void>;
}>();
