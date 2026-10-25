"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="not-found">
      <span className="eyebrow">Something needs another look</span>
      <h1>A brief pause.</h1>
      <p>The page could not load. Please try again.</p>
      <button className="button button-dark" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
