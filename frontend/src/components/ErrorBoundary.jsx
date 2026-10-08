import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 select-none">
          <div className="text-center max-w-md w-full">
            <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <AlertTriangle className="w-10 h-10 text-rose-400" />
            </div>
            
            <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">
              {this.props.fallbackTitle || 'Unable to Load Section'}
            </h1>
            
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Unable to complete this action. Please check your internet connection or try reloading.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <button 
                type="button"
                onClick={this.handleRetry}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <RefreshCw size={14} /> Try Again
              </button>
              
              <button 
                type="button"
                onClick={() => { window.location.href = '/'; }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                <Home size={14} /> Dashboard
              </button>
            </div>

            {this.state.error && (
              <details className="text-left bg-slate-900/90 text-rose-200 border border-rose-500/30 p-3.5 rounded-2xl text-xs overflow-auto max-w-xl mx-auto font-mono">
                <summary className="font-bold text-rose-400 cursor-pointer hover:underline text-[11px] uppercase tracking-wider">
                  View Technical Diagnostics
                </summary>
                <p className="font-bold text-rose-300 mt-2 mb-1 text-[11px]">{this.state.error.toString()}</p>
                <p className="text-[10px] text-white/50 whitespace-pre-wrap">{this.state.error.stack}</p>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

