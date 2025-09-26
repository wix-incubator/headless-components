import React, { useState } from 'react';

interface KitchensinkLayoutProps {
  children: React.ReactNode;
}

export function KitchensinkLayout({ children }: KitchensinkLayoutProps) {
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
              {/* Events Link */}
              <a
                href="/events"
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
                      d="M8 3v2m8-2v2M3 8h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
                    />
                  </svg>
                </div>
                <span className="font-medium">Events</span>
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
    </div>
  );
}
