import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      var self = this;
      return (
        <div className='min-h-[400px] flex items-center justify-center p-8'>
          <div className='text-center max-w-md'>
            <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-3xl'>{"⚠️"}</span>
            </div>
            <h2 className='text-xl font-bold text-gray-900 mb-2'>Something went wrong</h2>
            <p className='text-gray-500 mb-6'>
              This section encountered an error. Your data is safe.
            </p>
            <div className='flex gap-3 justify-center'>
              <button
                onClick={function () {
                  self.setState({ hasError: false, error: null });
                }}
                className='px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition'
              >
                {"🔄 Try Again"}
              </button>
              <button
                onClick={function () {
                  window.location.href = '/';
                }}
                className='px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition'
              >
                {"🏠 Go Home"}
              </button>
            </div>
            {self.state.error && (
              <p className='mt-4 text-xs text-gray-400 font-mono'>
                {self.state.error.toString().substring(0, 120)}
              </p>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
