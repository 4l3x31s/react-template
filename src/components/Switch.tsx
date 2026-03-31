import React, { useId } from 'react';

export type SwitchSize = 'sm' | 'md' | 'lg';
export type SwitchColor = 'accent' | 'success' | 'danger' | 'warning' | 'rose';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  size?: SwitchSize;
  color?: SwitchColor;
  labelPosition?: 'left' | 'right';
  id?: string;
  name?: string;
}

export interface SwitchGroupItem {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
  checked?: boolean;
}

export interface SwitchGroupProps {
  items: SwitchGroupItem[];
  onChange?: (id: string, checked: boolean) => void;
  label?: string;
  helperText?: string;
  size?: SwitchSize;
  color?: SwitchColor;
  orientation?: 'vertical' | 'horizontal';
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked,
      onChange,
      label,
      description,
      helperText,
      error,
      disabled = false,
      size = 'md',
      color = 'accent',
      labelPosition = 'right',
      id: idProp,
      name,
    },
    ref,
  ) => {
    const autoId = useId();
    const id = idProp ?? autoId;

    const labelContent = label ? (
      <span className="ui-switch-content">
        <span className="ui-switch-label">{label}</span>
        {description && <span className="ui-switch-description">{description}</span>}
      </span>
    ) : null;

    return (
      <div className={`ui-switch-field${error ? ' errored' : ''}`}>
        <label
          className={`ui-switch ui-switch-${size} ui-switch-color-${color}${disabled ? ' disabled' : ''}`}
          htmlFor={id}
        >
          {labelPosition === 'left' && labelContent}

          <input
            ref={ref}
            id={id}
            name={name}
            type="checkbox"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.checked)}
          />

          <span className="ui-switch-track" aria-hidden="true">
            <span className="ui-switch-thumb" />
          </span>

          {labelPosition === 'right' && labelContent}
        </label>

        {error && (
          <span className="ui-helper ui-error" role="alert">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6 0a6 6 0 100 12A6 6 0 006 0zm0 9.5a.75.75 0 110-1.5.75.75 0 010 1.5zm.75-3.25a.75.75 0 01-1.5 0v-3a.75.75 0 011.5 0v3z" />
            </svg>
            {error}
          </span>
        )}
        {!error && helperText && <span className="ui-helper">{helperText}</span>}
      </div>
    );
  },
);

Switch.displayName = 'Switch';

export const SwitchGroup: React.FC<SwitchGroupProps> = ({
  items,
  onChange,
  label,
  helperText,
  size = 'md',
  color = 'accent',
  orientation = 'vertical',
}) => {
  return (
    <div className="ui-switch-group">
      {label && <div className="ui-switch-group-label">{label}</div>}
      <div
        className={`ui-switch-group-list${orientation === 'horizontal' ? ' horizontal' : ''}`}
      >
        {items.map((item) => (
          <Switch
            key={item.id}
            id={item.id}
            label={item.label}
            description={item.description}
            checked={item.checked}
            disabled={item.disabled}
            size={size}
            color={color}
            onChange={(val) => onChange?.(item.id, val)}
          />
        ))}
      </div>
      {helperText && <span className="ui-helper">{helperText}</span>}
    </div>
  );
};

SwitchGroup.displayName = 'SwitchGroup';
