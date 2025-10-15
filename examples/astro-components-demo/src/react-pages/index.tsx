import '../styles/theme-1.css';
import { ComponentsLayout } from '../layouts/ComponentsLayout';
import { useState } from 'react';
import PriceExamples from '../components/PriceExamples';
import AddressExamples from '../components/AddressExamples';

interface Component {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
}

const components: Component[] = [
  {
    id: 'price',
    name: 'Price',
    description:
      'Display prices with support for sales, discounts, and price ranges.',
    category: 'Generic Components',
    status: 'Ready',
  },
  {
    id: 'address',
    name: 'Address',
    description:
      'Display and format addresses with support for different address formats.',
    category: 'Generic Components',
    status: 'Ready',
  },
];

interface ComponentCardProps {
  component: Component;
  onSelect: (component: Component) => void;
  isSelected: boolean;
}

const ComponentCard = ({
  component,
  onSelect,
  isSelected,
}: ComponentCardProps) => (
  <div
    onClick={() => onSelect(component)}
    className={`group relative bg-surface-card border border-surface-card rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:border-surface-card-hover ${
      isSelected ? 'border-surface-card-hover bg-white/10' : ''
    }`}
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h3 className="text-content-primary text-xl font-semibold mb-2 group-hover:text-white transition-colors duration-200">
          {component.name}
        </h3>
        <p className="text-content-muted text-sm leading-relaxed">
          {component.description}
        </p>
      </div>
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full ${
          component.status === 'Ready'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
        }`}
      >
        {component.status}
      </span>
    </div>

    <div className="flex items-center text-content-muted text-sm">
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
      {component.category}
    </div>
  </div>
);

interface ComponentViewerProps {
  component: Component;
}

const ComponentViewer = ({ component }: ComponentViewerProps) => {
  // For other components, show the generic viewer
  return (
    <div className="bg-surface-card border border-surface-card rounded-2xl p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-content-primary text-3xl font-bold">
            {component.name}
          </h2>
          <span className="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
            {component.status}
          </span>
        </div>
        <p className="text-content-secondary text-lg leading-relaxed">
          {component.description}
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-content-primary text-xl font-semibold mb-4">
            Installation
          </h3>
          <pre className="bg-black/30 border border-white/10 rounded-lg p-4 text-sm font-mono overflow-x-auto">
            <code className="text-content-secondary">
              npm install @wix/headless-components
            </code>
          </pre>
        </section>

        <section>
          <h3 className="text-content-primary text-xl font-semibold mb-4">
            Import
          </h3>
          <pre className="bg-black/30 border border-white/10 rounded-lg p-4 text-sm font-mono overflow-x-auto">
            <code className="text-content-secondary">{`import { ${component.name} } from '@wix/headless-components';`}</code>
          </pre>
        </section>

        <section>
          <h3 className="text-content-primary text-xl font-semibold mb-4">
            Example
          </h3>
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <div className="bg-black/20 border-b border-white/10 px-4 py-3">
              <span className="text-xs font-medium text-content-muted">
                Live Example
              </span>
            </div>
            <div className="p-6 bg-black/10">
              <div className="text-content-secondary">
                Interactive {component.name.toLowerCase()} examples:
                {component.id === 'price' ? <PriceExamples /> : ''}
                {component.id === 'address' ? <AddressExamples /> : ''}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const IntroductionContent = () => (
  <div className="bg-surface-card border border-surface-card rounded-2xl p-8">
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-6">
        <span className="gradient-hero-text">Headless Components</span>
      </h1>
      <p className="text-content-secondary text-lg leading-relaxed">
        A collection of unstyled, accessible React components for building
        high-quality design systems and web applications.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="gradient-hero-card border border-white/10 rounded-xl p-6">
        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
          <svg
            className="w-5 h-5 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <h3 className="text-content-primary text-lg font-semibold mb-2">
          Accessible by Default
        </h3>
        <p className="text-content-muted text-sm">
          Built with proper ARIA attributes and keyboard navigation support.
        </p>
      </div>

      <div className="gradient-hero-card border border-white/10 rounded-xl p-6">
        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
          <svg
            className="w-5 h-5 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
            />
          </svg>
        </div>
        <h3 className="text-content-primary text-lg font-semibold mb-2">
          Fully Customizable
        </h3>
        <p className="text-content-muted text-sm">
          Unstyled components that adapt to your design system.
        </p>
      </div>

      <div className="gradient-hero-card border border-white/10 rounded-xl p-6">
        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
          <svg
            className="w-5 h-5 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        </div>
        <h3 className="text-content-primary text-lg font-semibold mb-2">
          TypeScript Support
        </h3>
        <p className="text-content-muted text-sm">
          Full TypeScript support with comprehensive type definitions.
        </p>
      </div>

      <div className="gradient-hero-card border border-white/10 rounded-xl p-6">
        <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4">
          <svg
            className="w-5 h-5 text-teal-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-content-primary text-lg font-semibold mb-2">
          Composable
        </h3>
        <p className="text-content-muted text-sm">
          Maximum flexibility through composable architecture patterns.
        </p>
      </div>
    </div>
  </div>
);

export default function ComponentsDemo() {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(
    null,
  );

  return (
    <ComponentsLayout>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Component Selection Grid */}
          {!selectedComponent && (
            <>
              <IntroductionContent />

              <div className="mt-12">
                <h2 className="text-content-primary text-2xl font-bold mb-6">
                  Available Components
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {components.map((component) => (
                    <ComponentCard
                      key={component.id}
                      component={component}
                      onSelect={setSelectedComponent}
                      isSelected={
                        (selectedComponent as Component | null)?.id ===
                        component.id
                      }
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Component Detail View */}
          {selectedComponent && (
            <div>
              {/* Back Button */}
              <button
                onClick={() => setSelectedComponent(null)}
                className="mb-6 inline-flex items-center gap-2 text-content-muted hover:text-content-primary transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Components
              </button>

              <ComponentViewer component={selectedComponent} />
            </div>
          )}
        </div>
      </div>
    </ComponentsLayout>
  );
}
