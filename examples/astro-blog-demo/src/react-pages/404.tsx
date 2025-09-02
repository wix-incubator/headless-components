import React from 'react';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import '../styles/theme-blog.css';

export default function NotFoundPage() {
  return (
    <KitchensinkLayout>
      <div className="min-h-screen bg-surface-primary flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-content-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.455-5.12-3.5M15 13.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.455-5.12-3.5M12 3a9 9 0 11-9 9 9 9 0 019-9z"
                />
              </svg>
            </div>
            <h1 className="text-6xl font-bold text-blog-title mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-content-secondary mb-4">
              Page Not Found
            </h2>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <p className="text-blog-excerpt mb-4">
              Oops! The page you're looking for seems to have wandered off into
              the digital void.
            </p>
            <p className="text-content-muted text-sm">
              Don't worry, it happens to the best of us. Let's get you back on
              track.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="btn-primary px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
            >
              Go Home
            </a>
            <a
              href="/blog"
              className="btn-secondary px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
            >
              Browse Blog
            </a>
          </div>

          {/* Search Suggestion */}
          <div className="mt-8 text-center">
            <p className="text-content-muted text-sm mb-2">
              Looking for something specific?
            </p>
            <button
              onClick={() => window.history.back()}
              className="link-primary text-sm hover:underline"
            >
              ← Go back to previous page
            </button>
          </div>
        </div>
      </div>
    </KitchensinkLayout>
  );
}
