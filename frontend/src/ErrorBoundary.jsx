import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error('Captured error in ErrorBoundary', error, info);
    try {
      // save last error for debugging (can be read from console or localStorage)
      const payload = { error: error?.toString(), info: info?.componentStack };
      localStorage.setItem('lastRuntimeError', JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40 }}>
          <h1 style={{ color: '#b91c1c' }}>Something went wrong</h1>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f8fafc', padding: 16 }}>{this.state.error?.toString()}</pre>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Stack trace / details</summary>
            <pre>{this.state.info?.componentStack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
