# CMS Collection Demo - Restaurant Menu

A comprehensive demo application showcasing the Wix Headless CMS components with a restaurant menu use case, featuring sorting, filtering, and item creation.

## Running the Demo

**Note:** All commands should be run from the root of the project.

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## Local Development with Headless Components

When developing locally (`yarn dev`) and making changes to headless components in `packages/headless-components`, you need to rebuild the specific package for changes to be reflected in your local run.

For example, if you're making changes to the CMS components:

```bash
# From the root of the project
cd packages/headless-components/cms
yarn build
```

This applies to all packages in `packages/headless-components` - rebuild the specific package you're modifying to see changes reflected in your local development server.
