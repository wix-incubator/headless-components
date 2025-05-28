import type { ClientDirective } from "astro";

export default <ClientDirective>(async (load, _, el) => {
  await new Promise(resolve => setTimeout(resolve, 5000));

  const service = (el.closest("context-provider") as any).service;
  console.log("context-provider service", service);
  const contextId = crypto.randomUUID();
  (globalThis as any).contexts = (globalThis as any).contexts || {};
  (globalThis as any).contexts[contextId] = service;
  const props = JSON.parse(el.getAttribute("props") || "{}");
  console.log("context-provider Props from wait-for-store:", props);
  props["contextId"] = [0, contextId];
  el.setAttribute("props", JSON.stringify(props));
  const [hydrate] = await Promise.all([load()]);
  await hydrate();
});
