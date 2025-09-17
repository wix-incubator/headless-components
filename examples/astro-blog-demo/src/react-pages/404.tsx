export default function NotFoundPage() {
  return (
    <div className="bg-surface-primary flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md px-6 text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <svg
              className="text-content-muted h-12 w-12"
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
          <h1 className="text-content-primary mb-2 text-6xl font-bold">404</h1>
          <h2 className="text-content-secondary mb-4 text-2xl font-semibold">
            Page Not Found
          </h2>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <p className="text-content-light mb-4">
            Oops! The page you're looking for seems to have wandered off into
            the digital void.
          </p>
          <p className="text-content-muted text-sm">
            Don't worry, it happens to the best of us. Let's get you back on
            track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="/"
            className="btn-secondary rounded-lg px-6 py-3 font-medium transition-all hover:scale-105"
          >
            Browse Blog
          </a>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 text-center">
          <p className="text-content-muted mb-2 text-sm">
            Looking for something specific?
          </p>
          <button
            onClick={() => window.history.back()}
            className="text-brand-primary hover:text-brand-light text-sm transition-colors hover:underline"
          >
            ← Go back to previous page
          </button>
        </div>
      </div>
    </div>
  );
}
