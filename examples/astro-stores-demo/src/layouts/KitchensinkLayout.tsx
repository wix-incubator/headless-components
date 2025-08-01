import React, { useState } from 'react';

interface KitchensinkLayoutProps {
  children: React.ReactNode;
}

export const KitchensinkLayout = ({ children }: KitchensinkLayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      {/* Backdrop for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Floating Navigation Menu */}
      <div className="fixed left-6 top-6 z-50">
        {/* Expandable Menu Panel */}
        <div
          className={`absolute left-full top-0 ml-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl transform transition-all duration-300 ease-out ${
            isMenuOpen
              ? 'translate-x-0 opacity-100 pointer-events-auto'
              : '-translate-x-full opacity-0 pointer-events-none'
          }`}
        >
          <div className="py-4 px-6 min-w-48">
            <div className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3">
              Navigation
            </div>
            <nav className="space-y-2">
              {/* Store Link */}
              <a
                href="/"
                className="flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-3 py-2 transition-all duration-200 group/item"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center group-hover/item:from-orange-500/30 group-hover/item:to-red-500/30 transition-all duration-200">
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                    />
                  </svg>
                </div>
                <span className="font-medium">Store</span>
              </a>

              {/* Cart Link */}
              <a
                href="/cart"
                className="flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-3 py-2 transition-all duration-200 group/item"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center group-hover/item:from-green-500/30 group-hover/item:to-blue-500/30 transition-all duration-200">
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                    />
                  </svg>
                </div>
                <span className="font-medium">Cart</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Hamburger Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`w-12 h-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 hover:bg-white/20 ${
            isMenuOpen ? 'opacity-60 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <svg
            className="w-5 h-5 text-white/80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      {children}

      {/* Floating elements for visual appeal */}
      <div className="fixed top-20 left-20 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-700 pointer-events-none" />
      <div className="fixed top-1/2 left-10 w-16 h-16 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-1000 pointer-events-none" />
    </div>
  );
};
