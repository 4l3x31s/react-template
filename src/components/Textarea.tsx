import React, { useId, useState } from 'react';
import type { InputColorScheme } from './Input';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  required?: boolean;
  fullWidth?: boolean;
  colorScheme?: InputColorScheme;
  onChange?: (value: string) => void;
  onValidate?: (value: string) => string | undefined;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  minRows?: number;
  maxRows?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      required,
      fullWidth = true,
      colorScheme,
      onChange,
      onValidate,
      resize = 'vertical',
      rows = 4,
      className = '',
      id,
      style,
      onBlur,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [focused, setFocused] = useState(false);
    const [touched, setTouched] = useState(false);
    const [internalError, setInternalError] = useState<string | undefined>(undefined);

    const activeError = error ?? internalError;
    const hasError = Boolean(activeError);
    const hasSuccess = Boolean(success) && !hasError;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      onChange?.(val);
      if (touched && onValidate) setInternalError(onValidate(val));
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setFocused(false);
      setTouched(true);
      if (required && !e.target.value.trim()) {
        setInternalError('Este campo es requerido');
      } else if (onValidate) {
        setInternalError(onValidate(e.target.value));
      } else {
        setInternalError(undefined);
      }
      onBlur?.(e);
    };

    const labelClass = [
      'ui-label',
      required ? 'required' : '',
      focused ? 'focused' : '',
      hasError ? 'errored' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const controlClass = [
      'ui-control',
      hasError ? 'ui-error' : '',
      hasSuccess ? 'ui-valid' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const labelStyle: React.CSSProperties = {};
    if (colorScheme?.label) labelStyle.color = colorScheme.label;
    if (colorScheme?.error && hasError) labelStyle.color = colorScheme.error;

    return (
      <div className="ui-field" style={{ width: fullWidth ? '100%' : 'auto' }}>
        {label && (
          <label htmlFor={inputId} className={labelClass} style={labelStyle}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={controlClass}
          rows={rows}
          required={required}
          aria-invalid={hasError}
          aria-describedby={
            activeError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          style={{
            resize,
            minHeight: 44,
            alignItems: 'flex-start',
            paddingTop: 12,
            borderColor: colorScheme?.error && hasError ? colorScheme.error : undefined,
            ...style,
          }}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        {activeError && (
          <span
            id={`${inputId}-error`}
            className="ui-helper ui-error"
            role="alert"
            style={colorScheme?.error ? { color: colorScheme.error } : undefined}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <path d="M6 0a6 6 0 100 12A6 6 0 006 0zm0 9.5a.75.75 0 110-1.5.75.75 0 010 1.5zm.75-3.25a.75.75 0 01-1.5 0v-3a.75.75 0 011.5 0v3z" />
            </svg>
            {activeError}
          </span>
        )}
        {!activeError && success && (
          <span id={`${inputId}-helper`} className="ui-helper ui-valid">{success}</span>
        )}
        {!activeError && !success && helperText && (
          <span id={`${inputId}-helper`} className="ui-helper">{helperText}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
