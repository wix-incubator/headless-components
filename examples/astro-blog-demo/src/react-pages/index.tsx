import React from 'react';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import '../styles/theme-blog.css';

export default function HomePage() {
  return (
    <KitchensinkLayout>
      <div className="min-h-screen bg-surface-primary flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-blog-title mb-6">
              Wix Headless Blog Demo
            </h1>
            <p className="text-xl text-blog-excerpt mb-8 max-w-3xl mx-auto">
              Welcome to the comprehensive demonstration of Wix headless blog
              components. This example showcases how to build modern, scalable
              blog applications using React, Astro, and Wix's headless
              architecture.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/blog"
                className="btn-primary px-8 py-3 rounded-lg font-medium text-lg transition-all hover:scale-105"
              >
                Explore Blog Posts
              </a>
              <a
                href="https://github.com/wix-incubator/headless-components"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary px-8 py-3 rounded-lg font-medium text-lg transition-all hover:scale-105 inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View Source Code
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="card-blog-post text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blog-category"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blog-title mb-2">
                Headless Architecture
              </h3>
              <p className="text-blog-excerpt">
                Built with modern headless principles for maximum flexibility
                and performance.
              </p>
            </div>

            <div className="card-blog-post text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-link-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blog-title mb-2">
                Lightning Fast
              </h3>
              <p className="text-blog-excerpt">
                Optimized for speed with static generation and intelligent
                client hydration.
              </p>
            </div>

            <div className="card-blog-post text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blog-tag"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blog-title mb-2">
                Developer Friendly
              </h3>
              <p className="text-blog-excerpt">
                Clean APIs, excellent TypeScript support, and comprehensive
                documentation.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-surface-card rounded-xl p-6 border border-blog-card-border">
            <h2 className="text-2xl font-semibold text-blog-title mb-4">
              Quick Links
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/blog"
                className="link-primary font-medium hover:underline"
              >
                📝 Browse Posts
              </a>
              <a
                href="https://github.com/wix-incubator/headless-components/tree/main/examples/astro-blog-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="link-primary font-medium hover:underline"
              >
                💻 Source Code
              </a>
              <a
                href="https://github.com/wix-incubator/headless-components/blob/main/docs/IMPLEMENTATION_STATUS.md"
                target="_blank"
                rel="noopener noreferrer"
                className="link-primary font-medium hover:underline"
              >
                📊 Implementation Status
              </a>
              <a
                href="https://wix.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="link-primary font-medium hover:underline"
              >
                🚀 Wix Developer
              </a>
            </div>
          </div>
        </div>
      </div>
    </KitchensinkLayout>
  );
}
