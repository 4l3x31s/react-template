import React, { useId, useState } from 'react';

export interface InputColorScheme {
  error?: string;
  focus?: string;
  label?: string;
  success?: string;
}

// ─── Built-in validators ──────────────────────────────────────────────────────
export type InputValidateType =
  | 'email'
  | 'url'
  | 'phone'
  | 'number'
  | 'integer'
  | 'alphanumeric'
  | 'username'
  | 'creditcard'
  | 'postalcode'
  | 'ip';

export interface InputValidateRule {
  type: InputValidateType | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern';
  value?: number | string | RegExp;
  message?: string;
}

const VALIDATORS: Record<InputValidateType, { pattern: RegExp; message: string }> = {
  email:       { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' },
  url:         { pattern: /^https?:\/\/.+\..+/, message: 'URL inválida (debe comenzar con http/https)' },
  phone:       { pattern: /^\+?[\d\s\-().]{7,20}$/, message: 'Teléfono inválido' },
  number:      { pattern: /^-?\d+([.,]\d+)?$/, message: 'Debe ser un número' },
  integer:     { pattern: /^-?\d+$/, message: 'Debe ser un número entero' },
  alphanumeric:{ pattern: /^[a-zA-Z0-9]+$/, message: 'Solo letras y números' },
  username:    { pattern: /^[a-zA-Z0-9._-]{3,30}$/, message: 'Solo letras, números, puntos, guiones (3-30 caracteres)' },
  creditcard:  { pattern: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/, message: 'Número de tarjeta inválido' },
  postalcode:  { pattern: /^\d{4,10}$/, message: 'Código postal inválido' },
  ip:          { pattern: /^(\d{1,3}\.){3}\d{1,3}$/, message: 'Dirección IP inválida' },
};

function runValidation(
  value: string,
  validate?: InputValidateType | InputValidateRule | InputValidateRule[],
  onValidate?: (v: string) => string | undefined
): string | undefined {
  if (!value) return undefined;

  // Custom function validator
  if (onValidate) {
    const err = onValidate(value);
    if (err) return err;
  }

  if (!validate) return undefined;

  const rules: InputValidateRule[] = typeof validate === 'string'
    ? [{ type: validate }]
    : Array.isArray(validate)
    ? validate
    : [validate];

  for (const rule of rules) {
    const preset = VALIDATORS[rule.type as InputValidateType];

    if (preset) {
      if (!preset.pattern.test(value)) return rule.message ?? preset.message;
    } else {
      // Non-preset rules
      if (rule.type === 'minLength' && typeof rule.value === 'number' && value.length < rule.value) {
        return rule.message ?? `Mínimo ${rule.value} caracteres`;
      }
      if (rule.type === 'maxLength' && typeof rule.value === 'number' && value.length > rule.value) {
        return rule.message ?? `Máximo ${rule.value} caracteres`;
      }
      if (rule.type === 'min' && typeof rule.value === 'number' && Number(value) < rule.value) {
        return rule.message ?? `El valor mínimo es ${rule.value}`;
      }
      if (rule.type === 'max' && typeof rule.value === 'number' && Number(value) > rule.value) {
        return rule.message ?? `El valor máximo es ${rule.value}`;
      }
      if (rule.type === 'pattern' && rule.value instanceof RegExp && !rule.value.test(value)) {
        return rule.message ?? 'Formato inválido';
      }
    }
  }

  return undefined;
}

// ─── Status icons ─────────────────────────────────────────────────────────────
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 7l3 3 7-7" />
  </svg>
);

const IconError = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
    <path d="M7 0a7 7 0 100 14A7 7 0 007 0zm0 10.5a.875.875 0 110-1.75.875.875 0 010 1.75zm.7-3.5a.7.7 0 01-1.4 0V4.5a.7.7 0 011.4 0V7z" />
  </svg>
);

// ─── Auto-detect icons by context ─────────────────────────────────────────────
const AUTO_ICONS: Record<string, React.ReactNode> = {
  email: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="3.5" width="13" height="9" rx="1.5" />
      <path d="M1 5.5l6.5 4 6.5-4" />
    </svg>
  ),
  password: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="6.5" width="9" height="7" rx="1.5" />
      <path d="M5 6.5V4.5a2.5 2.5 0 015 0v2" />
      <circle cx="7.5" cy="10" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  phone: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 1.5h3l1.5 3.5-2 1.5a8.5 8.5 0 003.5 3.5L10.5 8l3.5 1.5v3A1.5 1.5 0 0112.5 14 11.5 11.5 0 011 2.5 1.5 1.5 0 013 1.5z" />
    </svg>
  ),
  url: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5.5 8.5s-.5 2 2 2h3c1.657 0 3-1.343 3-3s-1.343-3-3-3h-1" />
      <path d="M9.5 6.5s.5-2-2-2h-3C2.843 4.5 1.5 5.843 1.5 7.5s1.343 3 3 3h1" />
    </svg>
  ),
  number: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5.5 2.5l-2 10M11.5 2.5l-2 10M2 5.5h11M1.5 9.5h11" />
    </svg>
  ),
  integer: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5.5 2.5l-2 10M11.5 2.5l-2 10M2 5.5h11M1.5 9.5h11" />
    </svg>
  ),
  username: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7.5" cy="5" r="3" />
      <path d="M1.5 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  ),
  user: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7.5" cy="5" r="3" />
      <path d="M1.5 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  ),
  creditcard: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="3" width="13" height="9" rx="1.5" />
      <path d="M1 7h13M4 10.5h2" />
    </svg>
  ),
  postalcode: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7.5 1C5 1 3 3 3 5.5c0 3.5 4.5 8 4.5 8S12 9 12 5.5C12 3 10 1 7.5 1z" />
      <circle cx="7.5" cy="5.5" r="1.5" />
    </svg>
  ),
  ip: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="2" width="13" height="4" rx="1" />
      <rect x="1" y="9" width="13" height="4" rx="1" />
      <path d="M4 4h.5M4 11h.5" />
    </svg>
  ),
  alphanumeric: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12l3.5-9 3.5 9M3.5 9h4M10 3v9M10 3c1.5 0 3 .5 3 2s-1.5 2-3 2M10 7c1.5 0 3 .5 3 2s-1.5 2-3 2" />
    </svg>
  ),
  search: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="4.5" />
      <path d="M10 10l3.5 3.5" />
    </svg>
  ),
  date: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1.5" y="2.5" width="12" height="11" rx="1.5" />
      <path d="M1.5 6.5h12M5 1.5v2M10 1.5v2" />
    </svg>
  ),
  time: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="6" />
      <path d="M7.5 4.5v3l2 2" />
    </svg>
  ),
};

function resolveAutoIcon(
  type?: string,
  validate?: InputValidateType | InputValidateRule | InputValidateRule[],
  name?: string,
  label?: string
): React.ReactNode | null {
  // 1. Derive validate type
  const vType = typeof validate === 'string'
    ? validate
    : Array.isArray(validate)
    ? (validate[0] as InputValidateRule).type
    : (validate as InputValidateRule | undefined)?.type;

  // 2. Check input type
  if (type === 'email' || vType === 'email') return AUTO_ICONS.email;
  if (type === 'password') return AUTO_ICONS.password;
  if (type === 'tel' || vType === 'phone') return AUTO_ICONS.phone;
  if (type === 'url' || vType === 'url') return AUTO_ICONS.url;
  if (type === 'date') return AUTO_ICONS.date;
  if (type === 'time') return AUTO_ICONS.time;
  if (type === 'search') return AUTO_ICONS.search;
  if (type === 'number') return AUTO_ICONS.number;

  // 3. Check validate type
  if (vType && vType in AUTO_ICONS) return AUTO_ICONS[vType as string];

  // 4. Heuristics from name/label
  const hint = ((name ?? '') + ' ' + (label ?? '')).toLowerCase();
  if (/email|correo|mail/.test(hint)) return AUTO_ICONS.email;
  if (/contrase[ñn]|password|clave|pin/.test(hint)) return AUTO_ICONS.password;
  if (/tel[eé]fono|phone|cel|m[oó]vil/.test(hint)) return AUTO_ICONS.phone;
  if (/nombre|name|apellido|usuario/.test(hint)) return AUTO_ICONS.user;
  if (/url|web|sitio|link|enlace/.test(hint)) return AUTO_ICONS.url;
  if (/buscar|search|filtrar/.test(hint)) return AUTO_ICONS.search;
  if (/fecha|date/.test(hint)) return AUTO_ICONS.date;
  if (/hora|time/.test(hint)) return AUTO_ICONS.time;
  if (/postal|zip|c[oó]digo/.test(hint)) return AUTO_ICONS.postalcode;
  if (/tarjeta|card|cr[eé]dito|d[eé]bito/.test(hint)) return AUTO_ICONS.creditcard;

  return null;
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  required?: boolean;
  fullWidth?: boolean;
  colorScheme?: InputColorScheme;
  onChange?: (value: string) => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  /** Custom validate function (runs in addition to `validate`) */
  onValidate?: (value: string) => string | undefined;
  /** Built-in type validation or rule(s) */
  validate?: InputValidateType | InputValidateRule | InputValidateRule[];
  /** Show check/error icon automatically in end slot. Defaults to true when `validate` or `onValidate` is set. */
  showStatusIcon?: boolean;
  /** Auto-detect and inject a contextual icon based on type/validate/name/label. Defaults to true. */
  autoIcon?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
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
      startIcon,
      endIcon,
      onValidate,
      validate,
      showStatusIcon,
      autoIcon = true,
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
    const [internalSuccess, setInternalSuccess] = useState(false);

    const activeError = error ?? internalError;
    const hasError = Boolean(activeError);
    const hasSuccess = (Boolean(success) || internalSuccess) && !hasError;

    // Auto show status icon when validation is configured
    const autoStatusIcon = showStatusIcon ?? Boolean(validate ?? onValidate);

    // Resolve start icon: explicit > auto-detected
    const resolvedStartIcon = startIcon ?? (autoIcon
      ? resolveAutoIcon(props.type, validate, props.name, label)
      : null);

    const customStyles: React.CSSProperties = {};
    if (colorScheme?.focus && focused) {
      customStyles['--ui-border-focus' as string] = colorScheme.focus;
    }
    if (colorScheme?.error && hasError) {
      customStyles['--ui-border-error' as string] = colorScheme.error;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      onChange?.(val);
      if (touched) {
        const err = val.trim()
          ? runValidation(val, validate, onValidate)
          : required ? 'Este campo es requerido' : undefined;
        setInternalError(err);
        setInternalSuccess(!err && val.trim().length > 0);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setTouched(true);
      const val = e.target.value;
      if (required && !val.trim()) {
        setInternalError('Este campo es requerido');
        setInternalSuccess(false);
      } else if (val.trim()) {
        const err = runValidation(val, validate, onValidate);
        setInternalError(err);
        setInternalSuccess(!err);
      } else {
        setInternalError(undefined);
        setInternalSuccess(false);
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

    // Determine end slot: explicit endIcon OR auto status icon (never both)
    const endSlot = endIcon ?? (autoStatusIcon && touched ? (
      hasError ? <IconError /> : hasSuccess ? <IconCheck /> : null
    ) : null);

    const iconColor = hasError
      ? 'var(--ui-danger)'
      : hasSuccess
      ? 'var(--ui-success)'
      : focused
      ? 'var(--ui-accent)'
      : 'var(--ui-text-dim)';

    return (
      <div
        className="ui-field"
        style={{ width: fullWidth ? '100%' : 'auto', ...customStyles }}
      >
        {label && (
          <label htmlFor={inputId} className={labelClass} style={labelStyle}>
            {label}
          </label>
        )}
        <div style={{ position: 'relative' }}>
          {resolvedStartIcon && (
            <span
              className="ui-input-icon ui-input-icon-start"
              style={{ color: iconColor, transition: 'color var(--ui-transition)' }}
              aria-hidden="true"
            >
              {resolvedStartIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={controlClass}
            style={{
              paddingLeft: resolvedStartIcon ? 38 : undefined,
              paddingRight: endSlot ? 38 : undefined,
              borderColor: colorScheme?.error && hasError ? colorScheme.error : undefined,
              ...style,
            }}
            required={required}
            aria-invalid={hasError}
            aria-describedby={
              activeError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          {endSlot && (
            <span
              className="ui-input-icon ui-input-icon-end"
              style={{ color: iconColor, transition: 'color var(--ui-transition)' }}
              aria-hidden="true"
            >
              {endSlot}
            </span>
          )}
        </div>
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
          <span id={`${inputId}-helper`} className="ui-helper ui-valid">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <path d="M6 0a6 6 0 100 12A6 6 0 006 0zm2.78 4.72L5.53 7.97a.75.75 0 01-1.06 0L3.22 6.72a.75.75 0 011.06-1.06l.72.72 2.72-2.72a.75.75 0 011.06 1.06z" />
            </svg>
            {success}
          </span>
        )}
        {!activeError && !success && internalSuccess && (
          <span className="ui-helper ui-valid">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <path d="M6 0a6 6 0 100 12A6 6 0 006 0zm2.78 4.72L5.53 7.97a.75.75 0 01-1.06 0L3.22 6.72a.75.75 0 011.06-1.06l.72.72 2.72-2.72a.75.75 0 011.06 1.06z" />
            </svg>
            Válido
          </span>
        )}
        {!activeError && !success && !internalSuccess && helperText && (
          <span id={`${inputId}-helper`} className="ui-helper">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
