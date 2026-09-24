import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 text-2xl font-bold">
              TF
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Tuba Foundation Gokak</h2>
              <p className="text-sm text-gray-600 mt-2">
                An unexpected error occurred while loading this section.
              </p>
            </div>
            {this.state.error && (
              <pre className="text-xs bg-gray-50 p-3 rounded-lg text-left text-red-600 overflow-x-auto border border-gray-200">
                {this.state.error.message}
              </pre>
            )}
            <div className="pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.hash = '#/';
                  window.location.reload();
                }}
                className="w-full py-2.5 px-4 bg-[#0e6245] hover:bg-[#0b4d36] text-white font-medium rounded-xl text-sm transition-colors shadow-xs"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
