import React from 'react';

export interface CardProps {
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
  description?: string;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  accent?: boolean;
  accentColor?: string;
}

const paddingMap = {
  none: 0,
  sm: 12,
  md: 20,
  lg: 32,
};

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  title,
  description,
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
  style = {},
  padding = 'md',
  accent = false,
  accentColor,
}) => {
  const classes = [
    'ui-card',
    hoverable ? 'ui-card-hoverable' : '',
    clickable || onClick ? 'ui-card-clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const extraStyle: React.CSSProperties = accent
    ? {
        borderTopColor: accentColor ?? 'var(--ui-accent)',
        borderTopWidth: 3,
      }
    : {};

  const renderHeader = () => {
    if (header) return <div className="ui-card-header">{header}</div>;
    if (title || description) {
      return (
        <div className="ui-card-header">
          {title && (
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--ui-text)',
                lineHeight: 1.3,
              }}
            >
              {title}
            </div>
          )}
          {description && (
            <div
              style={{
                fontSize: 13,
                color: 'var(--ui-text-dim)',
                marginTop: 4,
                lineHeight: 1.5,
              }}
            >
              {description}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={classes}
      style={{ ...extraStyle, ...style }}
      onClick={clickable || onClick ? onClick : undefined}
      role={clickable || onClick ? 'button' : undefined}
      tabIndex={clickable || onClick ? 0 : undefined}
      onKeyDown={
        clickable || onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {renderHeader()}
      {children !== undefined && (
        <div
          className="ui-card-body"
          style={padding !== 'md' ? { padding: paddingMap[padding] } : undefined}
        >
          {children}
        </div>
      )}
      {footer && <div className="ui-card-footer">{footer}</div>}
    </div>
  );
};
