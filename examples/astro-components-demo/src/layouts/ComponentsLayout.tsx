import React, { useState } from 'react';

interface ComponentsLayoutProps {
  children: React.ReactNode;
}

export const ComponentsLayout = ({ children }: ComponentsLayoutProps) => {
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
              {/* Home Link */}
              <a
                href="/"
                className="flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-3 py-2 transition-all duration-200 group/item"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover/item:from-blue-500/30 group-hover/item:to-purple-500/30 transition-all duration-200">
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
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 5a2 2 0 012-2h4a2 2 0 012 2v14H8V5z"
                    />
                  </svg>
                </div>
                <span className="font-medium">Components</span>
              </a>

              {/* Documentation Link */}
              <a
                href="/docs"
                className="flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-3 py-2 transition-all duration-200 group/item"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-lg flex items-center justify-center group-hover/item:from-green-500/30 group-hover/item:to-teal-500/30 transition-all duration-200">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className="font-medium">Docs</span>
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
