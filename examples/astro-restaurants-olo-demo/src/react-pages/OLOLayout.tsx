// import { MiniCartContent, MiniCartIcon } from '@/components/ecom/MiniCartIcon';
// import { MiniCartModalProvider, useMiniCartModal } from '@/components/ecom/MiniCartModal';
// import { loadOLOSettingsServiceConfig, OLOSettingsServiceAPI } from '@/components/restaurants-olo/services/OLOSettingsService';
import { Commerce, CurrentCart } from '@wix/ecom/components';
import { loadCurrentCartServiceConfig } from '@wix/ecom/services';
import { loadOLOSettingsServiceConfig } from '@wix/headless-restaurants-olo/services';
import { Item, Menu, Menus, Section } from '@wix/restaurants/components';
import { loadMenusServiceConfig } from '@wix/restaurants/services';
import React, { useEffect, useState } from 'react';
// import { useLoaderData } from 'react-router-dom';
import OLOPage from './OLOPage';

interface OLOLayoutProps {
  children: React.ReactNode;
  oloSettingsServiceConfig: any;
}

export async function rootRouteLoader() {
    const [oloSettingsServiceConfig, currentCartServiceConfig, menusServiceConfig] = await Promise.all([
      loadOLOSettingsServiceConfig(),
      loadCurrentCartServiceConfig(),
      loadMenusServiceConfig(),
    ]);

    return {
      oloSettingsServiceConfig,
      currentCartServiceConfig,
      menusServiceConfig,
    };
}

const OLOLayoutContent = ({ children, oloSettingsServiceConfig }: OLOLayoutProps) => {
  // const { open } = useMiniCartModal();
  return (
    <>
    {children}
      {/* <Cart.LineItemAdded>
        {({ onAddedToCart }) => {
        useEffect(
            () =>
            onAddedToCart(() => {
                console.log('onAddedToCart');
                setTimeout(() => {
                open();
                }, 100);
            }),
            [onAddedToCart]
        );

        return null;
        }}
    </Cart.LineItemAdded> */}
    {/* <MiniCartIcon />
    {children}
    <MiniCartContent /> */}
    </>
  );
}

export const OLOLayout = ({ children }: Omit<OLOLayoutProps, 'oloSettingsServiceConfig'>) => {
  console.log('OLOLayout');

  const [oloSettingsServiceConfig, setOloSettingsServiceConfig] = useState<any>(null);
  const [currentCartServiceConfig, setCurrentCartServiceConfig] = useState<any>(null);
  const [menusServiceConfig, setMenusServiceConfig] = useState<any>(null);
// const { oloSettingsServiceConfig, currentCartServiceConfig, menusServiceConfig } = useLoaderData<typeof rootRouteLoader>();

useEffect(() => {
rootRouteLoader().then((data) => {
  setOloSettingsServiceConfig(data.oloSettingsServiceConfig);
    setCurrentCartServiceConfig(data.currentCartServiceConfig);
    setMenusServiceConfig(data.menusServiceConfig);
  });
}, []);
// const { open } = useMiniCartModal();

console.log('oloSettingsServiceConfig', oloSettingsServiceConfig);
console.log('currentCartServiceConfig', currentCartServiceConfig);
console.log('menusServiceConfig', menusServiceConfig);

  return (
    <div className="min-h-screen bg-background">
      {/* Regular Header Navigation */}
      <header className="w-full bg-background border-b border-foreground/10">
        <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            {/* Store Link */}
            <a
              href="/"
              className="flex items-center gap-2 text-foreground hover:bg-secondary hover:text-secondary-foreground rounded-lg px-3 py-2 transition-colors font-medium"
            >
              {/* <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                  />
                </svg>
              </span> */}
              <span className="font-medium">Online Ordering</span>
            </a>
            {/* Cart Link */}
            <a
              href="/cart"
              className="flex items-center gap-2 text-foreground hover:bg-secondary hover:text-secondary-foreground rounded-lg px-3 py-2 transition-colors font-medium"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                  />
                </svg>
              </span>
              <span className="font-medium">Cart</span>
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
      {/* <MiniCartModalProvider> */}
      {menusServiceConfig && <Menus.Root config={menusServiceConfig}>
        <Commerce.Root checkoutServiceConfig={{}}>
          <CurrentCart.Root currentCartServiceConfig={currentCartServiceConfig}>
            <OLOLayoutContent oloSettingsServiceConfig={oloSettingsServiceConfig}>
                <OLOPage />
            </OLOLayoutContent>
          </CurrentCart.Root>
        </Commerce.Root>
        </Menus.Root>}
      {/* </MiniCartModalProvider> */}
      </main>
    </div>
  );
};
