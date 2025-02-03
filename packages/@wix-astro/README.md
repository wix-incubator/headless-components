# Wix Astro Integration

## Features

### Session Management

The Wix Astro integration provides session management for your Astro project.

### Integrating into an exinsting Astro project

If you already have an Astro project and you want to add the Wix Astro integration to it, follow these steps:

1. Install the Wix Astro integration package and the Wix CLI packages:

```bash
npm install @wix/astro
```

2. Add the Wix integration to your Astro project's `astro.config.mjs` file:

```js
import wix from "@wix/astro-internal";

export default {
  // ...
  output: "server",
  integrations: [wix()],
  // ...
};
```
