import { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

/**
 * Last line of defense for the WebGL world (context loss, driver bugs, OOM on weak GPUs).
 * The content is never lost — we route to the accessible OS view.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('[nexus] world crashed:', error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="terminal-text text-sm text-rose">
            &gt; world renderer failed on this device
          </p>
          <p className="max-w-md text-sm text-dim">
            The 3D world could not start (usually an older GPU or a blocked WebGL context). All
            content is still here in the accessible OS view.
          </p>
          <Link
            to="/os"
            className="rounded-xl bg-neon px-5 py-2.5 text-sm font-bold text-void transition-transform hover:scale-105"
          >
            Open the OS view
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
