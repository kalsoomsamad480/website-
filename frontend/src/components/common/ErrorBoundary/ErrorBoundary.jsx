import { Component } from 'react';
import Button from '../Button/Button';
import styles from './ErrorBoundary.module.css';

/**
 * Catches render errors below it. Pass `fallback={({ error, reset }) => ...}` for a custom
 * section-level fallback; without it a full-page message is shown.
 */
class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('UI error:', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    const { fallback, children } = this.props;
    if (!error) return children;
    if (fallback) return fallback({ error, reset: this.reset });

    return (
      <div className={`container ${styles.wrap}`} role="alert">
        <span className="eyebrow">Something went wrong</span>
        <h1>
          We spilled the <em>coffee</em>.
        </h1>
        <p className="lead">
          An unexpected error stopped this page from loading. Please try again.
        </p>
        <Button href="/">Back to home</Button>
      </div>
    );
  }
}

export default ErrorBoundary;
