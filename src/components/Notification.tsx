import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

export type NotificationType = 'success' | 'danger' | 'warning' | 'info';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  exiting?: boolean;
}

interface NotificationContextValue {
  notify: (opts: Omit<NotificationItem, 'id'>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const useNotification = (): NotificationContextValue => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used inside <NotificationProvider>');
  return ctx;
};

const icons: Record<NotificationType, React.ReactNode> = {
  success: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10" cy="10" r="8" />
      <path d="M6.5 10l2.5 2.5 4.5-4.5" />
    </svg>
  ),
  danger: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10" cy="10" r="8" />
      <path d="M10 6.5v4M10 13.5h.01" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 2L18 17H2L10 2z" />
      <path d="M10 8v4M10 14.5h.01" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10" cy="10" r="8" />
      <path d="M10 9v5M10 6.5h.01" />
    </svg>
  ),
};

const NotificationToast: React.FC<{
  item: NotificationItem;
  onDismiss: (id: string) => void;
}> = ({ item, onDismiss }) => {
  const { id, type, title, message, duration = 4000, exiting } = item;

  return (
    <div
      className={[`ui-notification ui-notification-${type}`, exiting ? 'exiting' : ''].join(' ')}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="ui-notification-body">
        <span className="ui-notification-icon">{icons[type]}</span>
        <div className="ui-notification-content">
          <div className="ui-notification-title">{title}</div>
          {message && <div className="ui-notification-message">{message}</div>}
        </div>
        <button
          className="ui-notification-close"
          onClick={() => onDismiss(id)}
          aria-label="Cerrar notificación"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" />
          </svg>
        </button>
      </div>
      {duration > 0 && (
        <div
          className="ui-notification-progress"
          style={{ animationDuration: `${duration}ms` }}
        />
      )}
    </div>
  );
};

export const NotificationProvider: React.FC<{ children: React.ReactNode; maxVisible?: number }> = ({
  children,
  maxVisible = 5,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, exiting: true } : n))
    );

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 220);
  }, []);

  const notify = useCallback(
    (opts: Omit<NotificationItem, 'id'>) => {
      const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const duration = opts.duration ?? 4000;

      setNotifications((prev) => {
        const next = [{ ...opts, id }, ...prev];
        return next.slice(0, maxVisible);
      });

      if (duration > 0) {
        const t = setTimeout(() => dismiss(id), duration);
        timers.current.set(id, t);
      }

      return id;
    },
    [dismiss, maxVisible]
  );

  const dismissAll = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current.clear();
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify, dismiss, dismissAll }}>
      {children}
      <div className="ui-notifications" aria-label="Notificaciones" aria-live="polite">
        {notifications.map((n) => (
          <NotificationToast key={n.id} item={n} onDismiss={dismiss} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
