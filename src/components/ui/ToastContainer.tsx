import { useToast } from '../../hooks/useToast';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/90 border-green-600';
      case 'error':
        return 'bg-accent-red/90 border-accent-red';
      case 'warning':
        return 'bg-yellow-500/90 border-yellow-600';
      case 'info':
      default:
        return 'bg-accent-blue/90 border-accent-blue';
    }
  };

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto min-w-[320px] max-w-md rounded-lg border-2 p-4 shadow-2xl backdrop-blur-sm animate-slide-in-right ${getToastStyles(
            toast.type
          )}`}
        >
          <div className="flex items-start gap-3">
            <span
              className="material-symbols-outlined text-white flex-shrink-0"
              style={{ fontSize: 24 }}
            >
              {getToastIcon(toast.type)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm leading-relaxed break-words">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
              aria-label="Fechar"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                close
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
