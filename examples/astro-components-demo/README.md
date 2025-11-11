# Headless Components Demo

This demo showcases the Wix Headless Components using Storybook for interactive component examples.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start Storybook
yarn storybook

# Or start Astro dev server
yarn dev
```

## 📚 Storybook

This project uses Storybook to demonstrate component examples. Currently, it includes stories for:

- **Sort Component**: Multiple examples showing different ways to use the Sort primitive
  - Select Dropdown
  - Button List
  - Custom Styled Options

### Storybook Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `yarn storybook`          | Starts Storybook dev server at `localhost:6006` |
| `yarn build-storybook`   | Builds Storybook for production                  |

## 🧞 Other Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `yarn dev`                | Starts Astro dev server at `localhost:4321`      |
| `yarn build`              | Build your production site to `./dist/`          |
| `yarn preview`            | Preview your build locally, before deploying     |
| `yarn test`               | Run Playwright tests                             |

## 🏗️ Project Structure

```
/
├── .storybook/            # Storybook configuration
│   ├── main.ts           # Main Storybook config
│   └── preview.ts        # Storybook preview config
├── src/
│   ├── components/
│   │   ├── Sort.stories.tsx  # Sort component stories
│   │   ├── MySort.tsx        # Sort component examples
│   │   └── MySort.css        # Sort component styles
│   └── ...
└── package.json
```

## 👀 Want to learn more?

- [Storybook Documentation](https://storybook.js.org/)
- [Wix Headless Components](https://dev.wix.com/docs/rest/api-reference/wix-headless-components)
