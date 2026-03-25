import React, { useId, useState, useRef, useEffect } from 'react';

export interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  minDate?: Date;
  maxDate?: Date;
  id?: string;
  format?: (date: Date) => string;
  clearable?: boolean;
}

const DAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const defaultFormat = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

function isToday(d: Date) {
  return isSameDay(d, new Date());
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Seleccionar fecha',
  helperText,
  error,
  required,
  disabled,
  fullWidth = true,
  minDate,
  maxDate,
  id,
  format = defaultFormat,
  clearable = true,
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const initialView = value ?? new Date();
  const [viewMonth, setViewMonth] = useState(initialView.getMonth());
  const [viewYear, setViewYear] = useState(initialView.getFullYear());

  const containerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (value) {
      setViewMonth(value.getMonth());
      setViewYear(value.getFullYear());
    }
  }, [value]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const getDays = () => {
    const first = new Date(viewYear, viewMonth, 1);
    const startOffset = first.getDay(); // 0=Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();

    const cells: Array<{ date: Date; otherMonth: boolean }> = [];

    // Previous month trailing days
    for (let i = startOffset - 1; i >= 0; i--) {
      cells.push({ date: new Date(viewYear, viewMonth - 1, daysInPrev - i), otherMonth: true });
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(viewYear, viewMonth, d), otherMonth: false });
    }
    // Next month leading days
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ date: new Date(viewYear, viewMonth + 1, d), otherMonth: true });
    }

    return cells;
  };

  const isDisabled = (date: Date) => {
    if (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
    if (maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true;
    return false;
  };

  const handleSelect = (date: Date) => {
    if (isDisabled(date)) return;
    onChange?.(date);
    setOpen(false);
    setFocused(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
  };

  const labelClass = [
    'ui-label',
    required ? 'required' : '',
    focused || open ? 'focused' : '',
    hasError ? 'errored' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const cells = getDays();

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
      <div
        id={inputId}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-required={required}
        aria-invalid={hasError}
        tabIndex={disabled ? -1 : 0}
        className={['ui-control', hasError ? 'ui-error' : ''].join(' ')}
        style={{
          justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.38 : 1,
          userSelect: 'none',
        }}
        onClick={() => !disabled && setOpen((o) => !o)}
        onFocus={() => !disabled && setFocused(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!disabled) setOpen((o) => !o); }
          if (e.key === 'Escape') { setOpen(false); setFocused(false); }
        }}
      >
        <span style={{ color: value ? 'var(--ui-text)' : 'var(--ui-text-placeholder)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ui-text-dim)', flexShrink: 0 }} aria-hidden="true">
            <rect x="2" y="3" width="12" height="11" rx="1.5" />
            <path d="M2 7h12M5 2v2M11 2v2" />
          </svg>
          {value ? format(value) : placeholder}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {clearable && value && (
            <span
              role="button"
              aria-label="Limpiar fecha"
              style={{ display: 'flex', color: 'var(--ui-text-dim)', padding: 2, borderRadius: 2, transition: 'color 150ms' }}
              onClick={handleClear}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ui-text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ui-text-dim)')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M2 2l10 10M12 2L2 12" />
              </svg>
            </span>
          )}
          <span style={{ color: 'var(--ui-text-dim)', display: 'flex', transition: 'transform 150ms', transform: open ? 'rotate(180deg)' : 'none' }} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6l4 4 4-4" />
            </svg>
          </span>
        </div>
      </div>

      {open && (
        <div className="ui-calendar" role="dialog" aria-label="Seleccionar fecha">
          <div className="ui-calendar-header">
            <button
              className="ui-icon-btn"
              onClick={prevMonth}
              aria-label="Mes anterior"
              type="button"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 2.5L4.5 7 9 11.5" />
              </svg>
            </button>
            <div className="ui-calendar-month-year">
              {MONTHS[viewMonth]} {viewYear}
            </div>
            <button
              className="ui-icon-btn"
              onClick={nextMonth}
              aria-label="Mes siguiente"
              type="button"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 2.5L9.5 7 5 11.5" />
              </svg>
            </button>
          </div>

          <div className="ui-calendar-grid">
            {DAYS.map((d) => (
              <div key={d} className="ui-calendar-day-name" aria-hidden="true">
                {d}
              </div>
            ))}
            {cells.map(({ date, otherMonth }, i) => {
              const selected = value && isSameDay(date, value);
              const today = isToday(date);
              const dis = isDisabled(date);
              return (
                <button
                  key={i}
                  className={[
                    'ui-calendar-day',
                    selected ? 'selected' : '',
                    today && !selected ? 'today' : '',
                    otherMonth ? 'other-month' : '',
                  ].join(' ')}
                  disabled={dis}
                  onClick={() => handleSelect(date)}
                  aria-label={date.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  aria-pressed={selected ? true : undefined}
                  aria-current={today ? 'date' : undefined}
                  type="button"
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
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
