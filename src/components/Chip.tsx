import React from 'react';

export type ChipVariant = 'default' | 'accent' | 'danger' | 'success' | 'info' | 'warning';
export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps {
  label: string;
  variant?: ChipVariant;
  size?: ChipSize;
  icon?: React.ReactNode;
  onRemove?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const sizeStyles: Record<ChipSize, React.CSSProperties> = {
  sm: { fontSize: 10, padding: '2px 8px' },
  md: { fontSize: 12, padding: '4px 10px' },
  lg: { fontSize: 13, padding: '6px 12px' },
};

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'default',
  size = 'md',
  icon,
  onRemove,
  onClick,
  disabled = false,
  className = '',
}) => {
  const isInteractive = Boolean(onClick);

  return (
    <span
      className={[`ui-chip ui-chip-${variant}`, className].join(' ')}
      style={{
        ...sizeStyles[size],
        opacity: disabled ? 0.4 : 1,
        cursor: isInteractive ? 'pointer' : 'default',
        pointerEvents: disabled ? 'none' : 'auto',
      }}
      onClick={disabled ? undefined : onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive && !disabled ? 0 : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {icon && (
        <span style={{ display: 'flex', alignItems: 'center' }} aria-hidden="true">
          {icon}
        </span>
      )}
      {label}
      {onRemove && (
        <button
          className="ui-chip-remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Eliminar ${label}`}
          disabled={disabled}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
          </svg>
        </button>
      )}
    </span>
  );
};

// ChipGroup helper
export interface ChipGroupProps {
  chips: Array<{ id: string | number; label: string; variant?: ChipVariant; icon?: React.ReactNode }>;
  onRemove?: (id: string | number) => void;
  variant?: ChipVariant;
  size?: ChipSize;
  className?: string;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
  chips,
  onRemove,
  variant = 'default',
  size = 'md',
  className = '',
}) => (
  <div
    className={className}
    style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}
    role="list"
    aria-label="Chips"
  >
    {chips.map((chip) => (
      <span key={chip.id} role="listitem">
        <Chip
          label={chip.label}
          variant={chip.variant ?? variant}
          size={size}
          icon={chip.icon}
          onRemove={onRemove ? () => onRemove(chip.id) : undefined}
        />
      </span>
    ))}
  </div>
);
