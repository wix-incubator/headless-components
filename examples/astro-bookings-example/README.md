# Wix Services Demo

This demo showcases how to use Wix Services headless components to create a fully functional services listing and booking experience.

## 🚀 Quick Start

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

## 🎯 Features

- **Services Listing**: Display your services in a responsive grid layout
- **Filtering & Sorting**: Filter services by category and sort by name or price
- **Service Details**: Show comprehensive service information including:
  - Service name and description
  - Pricing information
  - Duration details
  - Category information
  - Service images
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Server-Side Rendering**: Fast initial page loads with Astro
- **SEO Optimization**: Built-in SEO best practices

## 🏗️ Project Structure

```
src/
├── components/          # Reusable React components
├── layouts/            # Layout components
│   ├── BaseLayout.astro
│   └── ServicesLayout.tsx
├── pages/             # Astro pages
│   └── services/
├── react-pages/       # React page components
│   └── services/
└── styles/           # Global styles and Tailwind config
```

## 💻 Usage Example

```tsx
import { List, Options, ServiceRepeater, Service } from '@wix/headless-services/react';

function ServicesList({ servicesConfig }) {
  return (
    <List servicesListConfig={servicesConfig}>
      <Options>
        <ServiceRepeater>
          {({ service }) => (
            <Service.Root service={service}>
              <Service.Name />
              <Service.Description />
              <Service.Price />
              <Service.Duration />
              <Service.Category />
              <Service.Image />
            </Service.Root>
          )}
        </ServiceRepeater>
      </Options>
    </List>
  );
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_WIX_CLIENT_ID=your-client-id
VITE_WIX_INSTANCE_ID=your-instance-id
```

### Tailwind Configuration

The demo uses Tailwind CSS for styling. Configuration can be found in `tailwind.config.js`.

## 📚 Component Documentation

For detailed documentation of the headless components, refer to:
- [Services List Component](../../packages/headless-components/services/README.md)
- [Service Component](../../packages/headless-components/services/README.md#service-component)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
