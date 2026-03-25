import React, { useEffect, useRef } from 'react';

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: DialogSize;
  closeOnBackdrop?: boolean;
  showClose?: boolean;
  icon?: React.ReactNode;
  iconColor?: string;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  showClose = true,
  icon,
  iconColor,
  className = '',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);

    // Focus trap
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClass = {
    sm: 'ui-dialog-sm',
    md: '',
    lg: 'ui-dialog-lg',
    xl: 'ui-dialog-xl',
  }[size];

  return (
    <div
      className="ui-dialog-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'dialog-title' : undefined}
      aria-describedby={description ? 'dialog-desc' : undefined}
      onClick={closeOnBackdrop ? (e) => { if (e.target === e.currentTarget) onClose(); } : undefined}
    >
      <div
        ref={dialogRef}
        className={['ui-dialog', sizeClass, className].filter(Boolean).join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description || showClose || icon) && (
          <div className="ui-dialog-header">
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flex: 1 }}>
              {icon && (
                <span
                  style={{
                    display: 'flex',
                    padding: 10,
                    borderRadius: 10,
                    background: iconColor
                      ? `${iconColor}20`
                      : 'var(--ui-accent-subtle)',
                    color: iconColor ?? 'var(--ui-accent)',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                  aria-hidden="true"
                >
                  {icon}
                </span>
              )}
              <div>
                {title && (
                  <div id="dialog-title" className="ui-dialog-title">
                    {title}
                  </div>
                )}
                {description && (
                  <div id="dialog-desc" className="ui-dialog-description">
                    {description}
                  </div>
                )}
              </div>
            </div>
            {showClose && (
              <button
                className="ui-icon-btn"
                onClick={onClose}
                aria-label="Cerrar diálogo"
                style={{ marginTop: -2 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M2 2l12 12M14 2L2 14" />
                </svg>
              </button>
            )}
          </div>
        )}

        {children && <div className="ui-dialog-body">{children}</div>}

        {footer && <div className="ui-dialog-footer">{footer}</div>}
      </div>
    </div>
  );
};

// Confirmation dialog
export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'primary',
  loading = false,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    title={title}
    size="sm"
    footer={
      <div style={{ display: 'flex', gap: 10, width: '100%', justifyContent: 'flex-end' }}>
        <button className="ui-btn ui-btn-ghost ui-btn-sm" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </button>
        <button
          className={`ui-btn ui-btn-${variant} ui-btn-sm`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading && <span className="ui-spinner" aria-hidden="true" />}
          {confirmLabel}
        </button>
      </div>
    }
  >
    <p style={{ margin: 0, fontSize: 14, color: 'var(--ui-text-dim)', lineHeight: 1.6 }}>
      {message}
    </p>
  </Dialog>
);
