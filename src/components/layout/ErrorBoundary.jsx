import React from 'react';

/** Catches render errors in a route so one broken section never leaves a blank page. */
export default class ErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.error('[Stratum] render error:', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="grid min-h-svh place-items-center bg-deep px-6 text-center text-on-dark">
        <div>
          <h1 className="h-display text-[clamp(2rem,5vw,3.6rem)]">Something went wrong.</h1>
          <p className="mx-auto mt-4 max-w-md text-on-dark/70">The page could not be displayed. Please reload, or contact us if it keeps happening.</p>
          <button type="button" onClick={() => window.location.reload()} className="btn-fx btn-fx--ply mt-8 bg-on-dark px-7 py-3 text-sm text-ink">
            Reload page
          </button>
        </div>
      </main>
    );
  }
}
