import { Suspense } from 'react';
import { RotateCw } from 'lucide-react';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import EmptyState from '../EmptyState/EmptyState';
import Button from '../Button/Button';

/**
 * Suspense + error boundary for a section that reads API data with use().
 * Pass `onRetry` when the data comes from a promise the parent must recreate.
 */
function DataBoundary({
  fallback = null,
  errorTitle = 'This section did not load.',
  tone = 'light',
  onRetry,
  children,
}) {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <EmptyState
          tone={tone}
          title={errorTitle}
          text={error.message}
          action={
            <Button
              variant={tone === 'dark' ? 'ghostLight' : 'ghost'}
              icon={RotateCw}
              onClick={() => {
                onRetry?.();
                reset();
              }}
            >
              Try again
            </Button>
          }
        />
      )}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export default DataBoundary;
