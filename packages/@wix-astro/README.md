# Wix Integration For Astro

The Wix integration for Astro allows you to build custom frontends with Astro on top of the Wix Developer Platform. The integration provides a boilerplate-free development experience with a set of tools to help streamline your development with Wix.

The main features of the Wix integration for Astro include:

- **Easy SDK Integration**: Use the Wix SDK modules directly through a pre-initialized and contextually available `WixClient`.
- **Session Management Middleware**: A middleware that manages a session cookie for the current site visitor.
- **Adapter for Wix Hosting**: The integration provides an adapter for Wix hosting, allowing you to deploy your Astro project to Wix hosting.

## Getting Started

The easiest way to get started with the Wix integration for Astro is to scaffold a new Astro project with one of the Wix templates. If you already have an Astro project or rather start with another template, you can add the Wix integration to an existing Astro project.

### Scaffold a New Astro Project with a Wix Template

Wix provides a collection of Astro templates that are pre-configured with the Wix integration for Astro and also act as a starting point for different types of projects. Check out our Wix Astro templates on GitHub: [wix/headless-templates/astro](https://github.com/wix/headless-templates/tree/main/astro).

```bash
# npm
npm create astro@latest --template wix/headless-templates/astro/<template-name>
# yarn
yarn create astro@latest --template wix/headless-templates/astro/<template-name>
# pnpm
pnpm create astro@latest --template wix/headless-templates/astro/<template-name>
```

Check the template's README for more information on how to get started with the template.

### Add the Wix Integration to an Existing Astro Project

If you already have an Astro project or want to start with another template, you can add the Wix integration to your project.

```bash
# npm
npx astro add @wix/astro
# yarn
yarn astro add @wix/astro
# pnpm
pnpx astro add @wix/astro
```

#### Setting up local development

> 💡 If you are deploying your project to Wix, check out the guide on [local development with the Wix Edge CLI](../cli//local-development.md).

The Wix integration requires the `WIX_CLIENT_ID` environment variable to be set. For local development, you can create a `.env.local` file in the root of your project and add the `WIX_CLIENT_ID` environment variable.

```properties
WIX_CLIENT_ID=your-wix-client-id
```

> ❓ Not sure what the Wix Client ID is or how to obtain it? Check out our documentation to [Create an OAuth App](https://dev.wix.com/docs/go-headless/getting-started/setup/authentication/create-an-oauth-app-for-visitors-and-members)

## Features

### Easy SDK Integration

The Wix integration for Astro provides a pre-initialized and contextually available `WixClient` that allows you to use the Wix SDK modules directly in your Astro project.

For example, to query your products from the Wix Stores API, you can just install the `@wix/stores` npm package and use the methods directly after importing them.

```js
---
import { products } from "@wix/stores";

const storeProducts = await products.queryProducts().find();
---

<h1>Number of products in store: {storeProducts.items.length}</h1>
```

#### SDK Modules in Astro Components frontmatter

You can use any of the SDK modules in your Astro components frontmatter to fetch data at build time or on-demand. There's no need to create an explicit `WixClient` and methods can be called directly.

```astro
---
import { products } from "@wix/stores";

const storeProducts = await products.queryProducts().find();
---

<h1>Products</h1>

{storeProducts.map((product) => (
  <div>
    <h2>{product.name}</h2>
    <p>{product.description}</p>
  </div>
))}
```

##### Pre-rendering

When used in pre-rendered components or pages, the SDK modules will use an automatically generated visitor session for the entire build. This means you'll only be able to access public data, and any data that requires a visitor session will be reset on each build.

> 💡 If you are working with APIs that require a current visitor session, be sure to set the relevant pages / components to [on-demand rendering](#on-demand-rendering).

##### On-demand rendering

When used in on-demand rendered components or pages, the SDK modules will use the current visitor session. This means you'll be able to access data that requires a visitor session, and the data will be fetched on-demand when the page is visited.

Visitor session management is handled by the [Session Management Middleware](#session-management-middleware).

#### SDK Modules in Scripts / UI Frameworks

You can also use the SDK modules in your scripts or UI frameworks. Just import the modules and use them as you would in any other JavaScript environment.

```html
<p>Products in store: <span id="productsCount">...</span></p>
<script>
import { products } from "@wix/stores";

const storeProducts = await products.queryProducts().find();

document.getElementById("productsCount").innerText = storeProducts.items.length;
</script>
```

In your scripts or UI framework components, your API calls will be authenticated with the current visitor session as managed by the [Session Management Middleware](#session-management-middleware).
