import React from 'react';

export default function InstagramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="py-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <a href="/" className="text-xl font-semibold">
            Instagram Demo
          </a>
          <nav className="text-sm opacity-80 flex items-center gap-4">
            <a href="/accounts" className="hover:underline">
              Accounts
            </a>
            <a href="/" className="hover:underline">
              Home
            </a>
          </nav>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 pb-12">{children}</div>
    </div>
  );
}
