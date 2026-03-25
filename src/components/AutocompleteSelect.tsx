import React, { useId, useState, useRef, useEffect, useMemo } from 'react';
import type { SelectOption } from './Select';

export interface AutocompleteSelectProps {
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
  emptyMessage?: string;
  multiple?: false;
}

export interface AutocompleteMultiProps {
  options: SelectOption[];
  value?: Array<string | number>;
  onChange?: (values: Array<string | number>, options: SelectOption[]) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  id?: string;
  emptyMessage?: string;
  multiple: true;
}

type Props = AutocompleteSelectProps | AutocompleteMultiProps;

export const AutocompleteSelect: React.FC<Props> = (props) => {
  const {
    options,
    label,
    placeholder = 'Buscar...',
    helperText,
    error,
    required,
    disabled,
    fullWidth = true,
    id,
    emptyMessage = 'Sin resultados',
    multiple = false,
  } = props;

  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const hasError = Boolean(error);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setHighlighted(-1);
  }, [query]);

  const isSelected = (optValue: string | number) => {
    if (multiple) {
      return ((props as AutocompleteMultiProps).value ?? []).includes(optValue);
    }
    return (props as AutocompleteSelectProps).value === optValue;
  };

  const handleSelect = (opt: SelectOption) => {
    if (opt.disabled) return;
    if (multiple) {
      const p = props as AutocompleteMultiProps;
      const current = p.value ?? [];
      const newValues = current.includes(opt.value)
        ? current.filter((v) => v !== opt.value)
        : [...current, opt.value];
      const newOptions = newValues.map((v) => options.find((o) => o.value === v)!).filter(Boolean);
      p.onChange?.(newValues, newOptions);
    } else {
      (props as AutocompleteSelectProps).onChange?.(opt.value, opt);
      setOpen(false);
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === 'Escape') { setOpen(false); setQuery(''); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    }
    if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault();
      handleSelect(filtered[highlighted]);
    }
  };

  const getDisplayValue = () => {
    if (open) return query;
    if (multiple) {
      const vals = (props as AutocompleteMultiProps).value ?? [];
      if (vals.length === 0) return '';
      if (vals.length === 1) {
        return options.find((o) => o.value === vals[0])?.label ?? '';
      }
      return `${vals.length} seleccionados`;
    }
    const val = (props as AutocompleteSelectProps).value;
    return options.find((o) => o.value === val)?.label ?? '';
  };

  const labelClass = [
    'ui-label',
    required ? 'required' : '',
    open ? 'focused' : '',
    hasError ? 'errored' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      className="ui-field"
      style={{ width: fullWidth ? '100%' : 'auto', position: 'relative' }}
    >
      {label && (
        <label htmlFor={inputId} className={labelClass}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          id={inputId}
          className={['ui-control', hasError ? 'ui-error' : ''].join(' ')}
          style={{ paddingRight: 40, cursor: disabled ? 'not-allowed' : 'text' }}
          value={getDisplayValue()}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-invalid={hasError}
          aria-autocomplete="list"
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <span
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
            transition: 'transform 150ms ease',
            color: 'var(--ui-text-dim)',
            pointerEvents: 'none',
            display: 'flex',
          }}
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </span>
      </div>

      {open && (
        <div className="ui-dropdown" ref={listRef} role="listbox" aria-label={label}>
          {filtered.length === 0 ? (
            <div className="ui-dropdown-empty">{emptyMessage}</div>
          ) : (
            filtered.map((opt, idx) => (
              <button
                key={opt.value}
                role="option"
                aria-selected={isSelected(opt.value)}
                disabled={opt.disabled}
                className={[
                  'ui-dropdown-item',
                  isSelected(opt.value) ? 'selected' : '',
                  idx === highlighted ? 'highlighted' : '',
                ].join(' ')}
                onMouseEnter={() => setHighlighted(idx)}
                onClick={() => handleSelect(opt)}
              >
                {multiple && (
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: `1.5px solid ${isSelected(opt.value) ? 'var(--ui-accent)' : 'var(--ui-border)'}`,
                      borderRadius: 2,
                      background: isSelected(opt.value) ? 'var(--ui-accent)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 150ms ease',
                    }}
                    aria-hidden="true"
                  >
                    {isSelected(opt.value) && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#0e0c0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                      </svg>
                    )}
                  </span>
                )}
                {opt.icon && <span aria-hidden="true">{opt.icon}</span>}
                {opt.label}
                {!multiple && isSelected(opt.value) && (
                  <span style={{ marginLeft: 'auto', color: 'var(--ui-accent)' }} aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 7l3 3 6-6" />
                    </svg>
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
