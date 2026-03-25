import React, { useId, useRef } from 'react';

export interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  options: CheckboxOption[];
  value?: string[];
  onChange?: (values: string[]) => void;
  label?: string;
  helperText?: string;
  error?: string;
  orientation?: 'vertical' | 'horizontal';
  selectAllLabel?: string;
  showSelectAll?: boolean;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  value = [],
  onChange,
  label,
  helperText,
  error,
  orientation = 'vertical',
  selectAllLabel = 'Seleccionar todos',
  showSelectAll = true,
}) => {
  const id = useId();
  const selectAllRef = useRef<HTMLInputElement>(null);

  const enabledOptions = options.filter((o) => !o.disabled);
  const allSelected = enabledOptions.length > 0 && enabledOptions.every((o) => value.includes(o.value));
  const someSelected = enabledOptions.some((o) => value.includes(o.value)) && !allSelected;

  const handleSelectAll = () => {
    if (allSelected) {
      onChange?.(value.filter((v) => !enabledOptions.find((o) => o.value === v)));
    } else {
      const next = [...value];
      enabledOptions.forEach((o) => { if (!next.includes(o.value)) next.push(o.value); });
      onChange?.(next);
    }
  };

  const handleToggle = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange?.(value.filter((v) => v !== optValue));
    } else {
      onChange?.([...value, optValue]);
    }
  };

  // Apply indeterminate state via callback ref
  const selectAllCallbackRef = (el: HTMLInputElement | null) => {
    (selectAllRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
    if (el) el.indeterminate = someSelected;
  };

  return (
    <div className="ui-checkbox-group">
      {label && <div className="ui-checkbox-group-label">{label}</div>}

      {showSelectAll && options.length > 1 && (
        <>
          <label className="ui-checkbox" style={{ marginBottom: 2 }}>
            <input
              type="checkbox"
              ref={selectAllCallbackRef}
              checked={allSelected}
              onChange={handleSelectAll}
            />
            <span className="ui-checkbox-box">
              {someSelected ? (
                <span className="ui-checkbox-indeterminate" style={{ opacity: 1 }}>
                  <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor">
                    <rect width="10" height="2" rx="1" />
                  </svg>
                </span>
              ) : (
                <span className="ui-checkbox-mark">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 4l2.5 2.5L9 1" />
                  </svg>
                </span>
              )}
            </span>
            <span className="ui-checkbox-label" style={{ fontWeight: 600 }}>{selectAllLabel}</span>
          </label>
          <div className="ui-checkbox-group-divider" />
        </>
      )}

      <div className={`ui-checkbox-group-list${orientation === 'horizontal' ? ' horizontal' : ''}`}>
        {options.map((opt) => (
          <label
            key={opt.value}
            className="ui-checkbox"
            style={{ opacity: opt.disabled ? 0.45 : 1, cursor: opt.disabled ? 'not-allowed' : 'pointer' }}
          >
            <input
              type="checkbox"
              id={`${id}-${opt.value}`}
              value={opt.value}
              checked={value.includes(opt.value)}
              disabled={opt.disabled}
              onChange={() => !opt.disabled && handleToggle(opt.value)}
            />
            <span className="ui-checkbox-box">
              <span className="ui-checkbox-mark">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 4l2.5 2.5L9 1" />
                </svg>
              </span>
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span className="ui-checkbox-label">{opt.label}</span>
              {opt.description && <span className="ui-checkbox-helper">{opt.description}</span>}
            </span>
          </label>
        ))}
      </div>

      {error && (
        <span className="ui-helper ui-error" role="alert">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <path d="M6 0a6 6 0 100 12A6 6 0 006 0zm0 9.5a.75.75 0 110-1.5.75.75 0 010 1.5zm.75-3.25a.75.75 0 01-1.5 0v-3a.75.75 0 011.5 0v3z" />
          </svg>
          {error}
        </span>
      )}
      {!error && helperText && <span className="ui-helper">{helperText}</span>}
    </div>
  );
};

CheckboxGroup.displayName = 'CheckboxGroup';
