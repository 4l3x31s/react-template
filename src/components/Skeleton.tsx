import React from 'react';

export interface SkeletonProps {
  variant?: 'text' | 'heading' | 'circle' | 'rect' | 'button';
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  style = {},
}) => {
  const variantClass = {
    text: 'ui-skeleton ui-skeleton-text',
    heading: 'ui-skeleton ui-skeleton-heading',
    circle: 'ui-skeleton ui-skeleton-circle',
    rect: 'ui-skeleton ui-skeleton-rect',
    button: 'ui-skeleton',
  }[variant];

  const defaultDimensions: React.CSSProperties = {
    text: { height: 14, width: '100%' },
    heading: { height: 28, width: '60%' },
    circle: { width: 40, height: 40 },
    rect: { width: '100%', height: 120 },
    button: { width: 100, height: 42, borderRadius: 4 },
  }[variant];

  return (
    <span
      className={[variantClass, className].join(' ')}
      style={{
        display: 'block',
        ...defaultDimensions,
        ...(width !== undefined ? { width } : {}),
        ...(height !== undefined ? { height } : {}),
        ...style,
      }}
      aria-hidden="true"
    />
  );
};

// Composite skeleton presets
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={className}
    style={{
      background: 'var(--ui-surface)',
      border: '1px solid var(--ui-border)',
      borderRadius: 10,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}
    aria-busy="true"
    aria-label="Cargando..."
  >
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Skeleton variant="circle" width={44} height={44} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" width="30%" />
      </div>
    </div>
    <Skeleton variant="text" width="100%" />
    <Skeleton variant="text" width="85%" />
    <Skeleton variant="text" width="70%" />
    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
      <Skeleton variant="button" width={80} height={32} />
      <Skeleton variant="button" width={80} height={32} />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => (
  <div
    style={{
      background: 'var(--ui-surface)',
      border: '1px solid var(--ui-border)',
      borderRadius: 10,
      overflow: 'hidden',
    }}
    aria-busy="true"
    aria-label="Cargando tabla..."
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 0,
        background: 'var(--ui-elevated)',
        borderBottom: '1px solid var(--ui-border)',
        padding: '12px 16px',
      }}
    >
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} variant="text" width="60%" height={12} />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div
        key={r}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 0,
          padding: '14px 16px',
          borderBottom: r < rows - 1 ? '1px solid var(--ui-border)' : 'none',
        }}
      >
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} variant="text" width={`${60 + Math.random() * 30}%`} />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonList: React.FC<{ items?: number }> = ({ items = 4 }) => (
  <div
    style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    aria-busy="true"
    aria-label="Cargando lista..."
  >
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Skeleton variant="circle" width={36} height={36} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton variant="text" width={`${40 + i * 10}%`} />
          <Skeleton variant="text" width={`${25 + i * 8}%`} height={11} />
        </div>
      </div>
    ))}
  </div>
);
