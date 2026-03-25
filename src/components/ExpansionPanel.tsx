import React, { useId, useRef, useState, useEffect } from 'react';

export interface ExpansionPanelProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const ExpansionPanel: React.FC<ExpansionPanelProps> = ({
  title,
  subtitle,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
  icon,
  disabled = false,
  className = '',
}) => {
  const id = useId();
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [children, isOpen]);

  const toggle = () => {
    if (disabled) return;
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onToggle?.(next);
  };

  return (
    <div className={['ui-expansion', className].filter(Boolean).join(' ')}>
      <button
        className="ui-expansion-trigger"
        aria-expanded={isOpen}
        aria-controls={`panel-${id}`}
        id={`trigger-${id}`}
        onClick={toggle}
        disabled={disabled}
        type="button"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          {icon && (
            <span
              style={{ color: 'var(--ui-accent)', display: 'flex', flexShrink: 0 }}
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: 'var(--ui-text)', fontSize: 14 }}>{title}</div>
            {subtitle && (
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--ui-text-dim)',
                  marginTop: 2,
                  fontWeight: 400,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
        </div>
        <span className="ui-expansion-icon" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4.5 6.75L9 11.25l4.5-4.5" />
          </svg>
        </span>
      </button>
      <div
        id={`panel-${id}`}
        role="region"
        aria-labelledby={`trigger-${id}`}
        className="ui-expansion-content"
        style={{
          height: isOpen ? height : 0,
          transition: 'height 280ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div ref={contentRef} className="ui-expansion-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Accordion group: only one open at a time
export interface AccordionItem {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenId,
  allowMultiple = false,
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<string[]>(
    defaultOpenId ? [defaultOpenId] : []
  );

  const handleToggle = (id: string, isOpen: boolean) => {
    setOpenIds((prev) => {
      if (allowMultiple) {
        return isOpen ? [...prev, id] : prev.filter((i) => i !== id);
      }
      return isOpen ? [id] : [];
    });
  };

  return (
    <div className={['ui-expansion-group', className].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <ExpansionPanel
          key={item.id}
          title={item.title}
          subtitle={item.subtitle}
          icon={item.icon}
          disabled={item.disabled}
          open={openIds.includes(item.id)}
          onToggle={(open) => handleToggle(item.id, open)}
        >
          {item.content}
        </ExpansionPanel>
      ))}
    </div>
  );
};
