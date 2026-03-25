import React, { useId, useState, useRef, useEffect } from 'react';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number | null;
  onChange?: (value: string | number, option: SelectOption) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  id?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Seleccionar...',
  helperText,
  error,
  required,
  disabled,
  fullWidth = true,
  id,
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value) ?? null;
  const hasError = Boolean(error);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) setOpen((o) => !o);
    }
    if (e.key === 'Escape') {
      setOpen(false);
      setFocused(false);
    }
  };

  const labelClass = [
    'ui-label',
    required ? 'required' : '',
    focused || open ? 'focused' : '',
    hasError ? 'errored' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const triggerClass = [
    'ui-control',
    hasError ? 'ui-error' : '',
    'cursor-pointer select-none',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className="ui-field"
      style={{ width: fullWidth ? '100%' : 'auto', position: 'relative' }}
      ref={containerRef}
    >
      {label && (
        <label htmlFor={inputId} className={labelClass}>
          {label}
        </label>
      )}
      <div
        id={inputId}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-required={required}
        aria-invalid={hasError}
        tabIndex={disabled ? -1 : 0}
        className={triggerClass}
        style={{
          justifyContent: 'space-between',
          opacity: disabled ? 0.38 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onClick={() => !disabled && setOpen((o) => !o)}
        onFocus={() => setFocused(true)}
        onBlur={() => { if (!open) setFocused(false); }}
        onKeyDown={handleKeyDown}
      >
        <span style={{ color: selectedOption ? 'var(--ui-text)' : 'var(--ui-text-placeholder)' }}>
          {selectedOption ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {selectedOption.icon && <span aria-hidden="true">{selectedOption.icon}</span>}
              {selectedOption.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <ChevronIcon
          style={{
            transition: 'transform 150ms ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'var(--ui-text-dim)',
            flexShrink: 0,
          }}
        />
      </div>

      {open && (
        <div className="ui-dropdown" role="listbox" aria-label={label}>
          {options.length === 0 ? (
            <div className="ui-dropdown-empty">Sin opciones disponibles</div>
          ) : (
            options.map((opt) => (
              <button
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                disabled={opt.disabled}
                className={[
                  'ui-dropdown-item',
                  opt.value === value ? 'selected' : '',
                ].join(' ')}
                onClick={() => {
                  if (!opt.disabled) {
                    onChange?.(opt.value, opt);
                    setOpen(false);
                    setFocused(false);
                  }
                }}
              >
                {opt.icon && <span aria-hidden="true">{opt.icon}</span>}
                {opt.label}
                {opt.value === value && (
                  <span style={{ marginLeft: 'auto', color: 'var(--ui-accent)' }} aria-hidden="true">
                    <CheckIcon />
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}

      {hasError && (
        <span className="ui-helper ui-error" role="alert">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <path d="M6 0a6 6 0 100 12A6 6 0 006 0zm0 9.5a.75.75 0 110-1.5.75.75 0 010 1.5zm.75-3.25a.75.75 0 01-1.5 0v-3a.75.75 0 011.5 0v3z" />
          </svg>
          {error}
        </span>
      )}
      {!hasError && helperText && <span className="ui-helper">{helperText}</span>}
    </div>
  );
};

const ChevronIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
    <path d="M4 6l4 4 4-4" />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 7l3 3 6-6" />
  </svg>
);
