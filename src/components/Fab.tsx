import React from 'react';

export type FabVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'surface';
export type FabSize = 'sm' | 'md' | 'lg';
export type FabPosition = 'bottom-right' | 'bottom-left' | 'bottom-center' | 'static';

export interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  variant?: FabVariant;
  size?: FabSize;
  /** Where to render. 'static' = inline in document flow. */
  position?: FabPosition;
  tooltip?: string;
}

export const Fab = React.forwardRef<HTMLButtonElement, FabProps>(
  (
    {
      icon,
      label,
      variant = 'primary',
      size = 'md',
      position = 'static',
      tooltip,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const isExtended = Boolean(label);
    const isFixed = position !== 'static';

    const classes = [
      'ui-fab',
      `ui-fab-${variant}`,
      `ui-fab-${size}`,
      isExtended ? 'ui-fab-extended' : '',
      isFixed ? 'ui-fab-fixed' : '',
      isFixed ? `ui-fab-${position}` : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type="button"
        className={classes}
        title={tooltip}
        aria-label={tooltip ?? label ?? undefined}
        style={style}
        {...props}
      >
        <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </span>
        {label && <span>{label}</span>}
      </button>
    );
  }
);

Fab.displayName = 'Fab';
