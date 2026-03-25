import React, { useId } from 'react';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  helperText?: string;
  error?: string;
  orientation?: 'vertical' | 'horizontal';
  variant?: 'default' | 'card';
  name?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  label,
  helperText,
  error,
  orientation = 'vertical',
  variant = 'default',
  name,
}) => {
  const id = useId();
  const groupName = name ?? id;

  const handleChange = (val: string) => {
    onChange?.(val);
  };

  if (variant === 'card') {
    return (
      <div className="ui-radio-group">
        {label && <div className="ui-radio-group-label">{label}</div>}
        <div className={`ui-radio-card-list${orientation === 'horizontal' ? ' horizontal' : ''}`}>
          {options.map((opt) => (
            <label
              key={opt.value}
              className={`ui-radio-card${value === opt.value ? ' checked' : ''}${opt.disabled ? '' : ''}`}
              style={{ opacity: opt.disabled ? 0.45 : 1, cursor: opt.disabled ? 'not-allowed' : 'pointer' }}
            >
              <input
                type="radio"
                name={groupName}
                value={opt.value}
                checked={value === opt.value}
                disabled={opt.disabled}
                onChange={() => !opt.disabled && handleChange(opt.value)}
              />
              <div className="ui-radio-circle">
                <div className="ui-radio-dot" style={value === opt.value ? { opacity: 1, transform: 'scale(1)' } : {}} />
              </div>
              <div className="ui-radio-body">
                <span className="ui-radio-label">{opt.label}</span>
                {opt.description && (
                  <span className="ui-radio-description">{opt.description}</span>
                )}
              </div>
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
  }

  return (
    <div className="ui-radio-group">
      {label && <div className="ui-radio-group-label">{label}</div>}
      <div className={`ui-radio-group-list${orientation === 'horizontal' ? ' horizontal' : ''}`}>
        {options.map((opt) => (
          <label
            key={opt.value}
            className="ui-radio"
            style={{ opacity: opt.disabled ? 0.45 : 1, cursor: opt.disabled ? 'not-allowed' : 'pointer' }}
          >
            <input
              type="radio"
              name={groupName}
              value={opt.value}
              checked={value === opt.value}
              disabled={opt.disabled}
              onChange={() => !opt.disabled && handleChange(opt.value)}
            />
            <div className="ui-radio-circle">
              <div
                className="ui-radio-dot"
                style={value === opt.value ? { opacity: 1, transform: 'scale(1)' } : {}}
              />
            </div>
            <div className="ui-radio-body">
              <span className="ui-radio-label">{opt.label}</span>
              {opt.description && (
                <span className="ui-radio-description">{opt.description}</span>
              )}
            </div>
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

RadioGroup.displayName = 'RadioGroup';
