import { createIntegration } from "./integration.js";
import { wixBlogLoader } from "./loaders/index.js";

export type { Runtime } from "./entrypoints/server.js";
export { wixBlogLoader };

export default createIntegration;
