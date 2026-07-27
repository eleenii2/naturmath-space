import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-slate-900/95 text-white p-6 text-center z-50 rounded-2xl border-2 border-amber-500/50 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mb-4 border border-amber-500/30">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-lg font-black tracking-wide text-amber-300 mb-2">
            {this.props.fallbackTitle || "Opps! Kendala Memuat Tampilan 3D"}
          </h3>
          <p className="text-xs text-slate-300 max-w-md mb-6 leading-relaxed">
            {this.props.fallbackMessage || "Terjadi gangguan saat memuat aset grafis atau koneksi internet. Silakan klik tombol di bawah untuk memuat ulang tampilan."}
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer uppercase tracking-wider"
          >
            <RefreshCw size={16} />
            <span>Muat Ulang Halaman</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
