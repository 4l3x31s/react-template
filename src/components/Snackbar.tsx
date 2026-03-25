import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface SnackbarOptions {
  message: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

interface SnackbarState extends SnackbarOptions {
  id: number;
  exiting: boolean;
}

interface SnackbarContextValue {
  show: (options: SnackbarOptions) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export const useSnackbar = (): SnackbarContextValue => {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used inside SnackbarProvider');
  return ctx;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snackbars, setSnackbars] = useState<SnackbarState[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setSnackbars((prev) =>
      prev.map((s) => (s.id === id ? { ...s, exiting: true } : s))
    );
    setTimeout(() => {
      setSnackbars((prev) => prev.filter((s) => s.id !== id));
    }, 300);
  }, []);

  const show = useCallback((opts: SnackbarOptions) => {
    const id = ++counterRef.current;
    const duration = opts.duration ?? 4000;

    setSnackbars((prev) => [...prev, { ...opts, id, exiting: false }]);

    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
  }, [dismiss]);

  return (
    <SnackbarContext.Provider value={{ show }}>
      {children}
      {createPortal(
        <div className="ui-snackbar-root" aria-live="polite">
          {snackbars.map((s) => (
            <div
              key={s.id}
              className={`ui-snackbar${s.exiting ? ' exiting' : ''}`}
              role="status"
            >
              <span className="ui-snackbar-message">{s.message}</span>
              {s.action && (
                <button
                  type="button"
                  className="ui-snackbar-action"
                  onClick={() => { s.action!.onClick(); dismiss(s.id); }}
                >
                  {s.action.label}
                </button>
              )}
              <button
                type="button"
                className="ui-snackbar-close"
                aria-label="Cerrar"
                onClick={() => dismiss(s.id)}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 1l10 10M11 1L1 11" />
                </svg>
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </SnackbarContext.Provider>
  );
};

SnackbarProvider.displayName = 'SnackbarProvider';
