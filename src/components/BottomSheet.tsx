import React, { useEffect } from 'react';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  showHandle?: boolean;
  showClose?: boolean;
  className?: string;
  maxHeight?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onClose,
  title,
  children,
  showHandle = true,
  showClose = true,
  className = '',
  maxHeight = '90vh',
}) => {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="ui-sheet-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={['ui-sheet', className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Bottom sheet'}
        style={{ maxHeight }}
      >
        {showHandle && <div className="ui-sheet-handle" />}
        {(title || showClose) && (
          <div className="ui-sheet-header">
            {title && <span className="ui-sheet-title">{title}</span>}
            {showClose && (
              <button
                className="ui-icon-btn"
                onClick={onClose}
                aria-label="Cerrar"
                style={{ marginLeft: 'auto' }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M2 2l12 12M14 2L2 14" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="ui-sheet-body">{children}</div>
      </div>
    </>
  );
};
