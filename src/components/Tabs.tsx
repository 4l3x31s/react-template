import React, { useState } from 'react';

export type TabVariant = 'line' | 'pill' | 'toggle';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  defaultId?: string;
  value?: string;
  onChange?: (id: string) => void;
  variant?: TabVariant;
  fullWidth?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultId,
  value,
  onChange,
  variant = 'line',
  fullWidth = false,
}) => {
  const [internalActive, setInternalActive] = useState(defaultId ?? items[0]?.id);
  const active = value ?? internalActive;

  const handleSelect = (id: string) => {
    if (!value) setInternalActive(id);
    onChange?.(id);
  };

  const activeItem = items.find((i) => i.id === active);

  return (
    <div className={`ui-tabs ui-tabs-${variant}${fullWidth ? ' ui-tabs-full' : ''}`}>
      <div className="ui-tabs-nav" role="tablist">
        {items.map((item) => (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={active === item.id}
            aria-disabled={item.disabled}
            disabled={item.disabled}
            className={`ui-tab-btn${active === item.id ? ' active' : ''}`}
            onClick={() => !item.disabled && handleSelect(item.id)}
          >
            {item.icon && <span aria-hidden="true">{item.icon}</span>}
            {item.label}
            {item.badge !== undefined && (
              <span className="ui-tab-badge">{item.badge}</span>
            )}
          </button>
        ))}
      </div>

      {activeItem && (
        <div
          key={active}
          className="ui-tabs-panel"
          role="tabpanel"
          aria-label={activeItem.label}
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
};

Tabs.displayName = 'Tabs';
