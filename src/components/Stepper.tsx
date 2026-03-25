import React, { useState } from 'react';

export interface StepperStep {
  label: string;
  subtitle?: string;
  content: React.ReactNode;
  validate?: () => string | undefined;
  optional?: boolean;
}

export interface StepperProps {
  steps: StepperStep[];
  onComplete?: () => void;
  completeLabel?: string;
  nextLabel?: string;
  backLabel?: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 6.5l3 3 6-6" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
    <path d="M6 0a6 6 0 100 12A6 6 0 006 0zm0 9a.75.75 0 110-1.5A.75.75 0 016 9zm.6-2.6a.6.6 0 01-1.2 0V4a.6.6 0 011.2 0v2.4z" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────
export const Stepper: React.FC<StepperProps> = ({
  steps,
  onComplete,
  completeLabel = 'Finalizar',
  nextLabel = 'Siguiente',
  backLabel = 'Atrás',
}) => {
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<Record<number, string>>({});

  const clearError = (i: number) =>
    setErrors(prev => { const n = { ...prev }; delete n[i]; return n; });

  const handleNext = () => {
    const step = steps[current];
    if (step.validate) {
      const err = step.validate();
      if (err) { setErrors(prev => ({ ...prev, [current]: err })); return; }
    }
    clearError(current);
    setCompleted(prev => new Set(prev).add(current));

    if (current === steps.length - 1) {
      onComplete?.();
    } else {
      setCurrent(c => c + 1);
    }
  };

  const handleBack = () => {
    clearError(current);
    setCurrent(c => c - 1);
  };

  // Allow clicking a completed step to jump back
  const handleStepClick = (i: number) => {
    if (i < current || completed.has(i)) {
      clearError(current);
      setCurrent(i);
    }
  };

  const isLast = current === steps.length - 1;

  return (
    <div className="ui-stepper">
      {/* ── Step header ───────────────────────────────── */}
      <div className="ui-stepper-header">
        {steps.map((step, i) => {
          const isDone = completed.has(i) && i !== current;
          const isActive = i === current;
          const hasError = Boolean(errors[i]);
          const isClickable = isDone || i < current;

          const status = hasError ? 'error' : isDone ? 'done' : isActive ? 'active' : '';

          return (
            <div
              key={i}
              className={`ui-step-item ${status}${isClickable ? ' clickable' : ''}`}
              onClick={() => isClickable && handleStepClick(i)}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleStepClick(i); } : undefined}
              aria-label={isClickable ? `Ir al paso ${i + 1}: ${step.label}` : undefined}
            >
              <div className="ui-step-circle">
                {hasError ? <ErrorIcon /> : isDone ? <CheckIcon /> : i + 1}
              </div>

              <div className="ui-step-meta">
                <span className="ui-step-label">{step.label}</span>
                {step.subtitle && (
                  <span className="ui-step-subtitle">
                    {step.optional ? 'Opcional' : step.subtitle}
                  </span>
                )}
                {step.optional && !step.subtitle && (
                  <span className="ui-step-subtitle">Opcional</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Content card ──────────────────────────────── */}
      <div className="ui-stepper-body">
        <div className="ui-stepper-content">
          <div className="ui-stepper-panel" key={current}>
            {steps[current].content}
          </div>

          {errors[current] && (
            <div className="ui-stepper-error">
              <ErrorIcon />
              {errors[current]}
            </div>
          )}
        </div>

        {/* ── Footer actions ──────────────────────────── */}
        <div className="ui-stepper-actions">
          <span className="ui-stepper-hint">
            Paso {current + 1} de {steps.length}
          </span>

          <div className="ui-stepper-actions-right">
            {current > 0 && (
              <button
                type="button"
                className="ui-btn ui-btn-ghost ui-btn-sm"
                onClick={handleBack}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2L3.5 6.5 8 11" />
                </svg>
                {backLabel}
              </button>
            )}
            <button
              type="button"
              className={`ui-btn ui-btn-sm ${isLast ? 'ui-btn-success' : 'ui-btn-primary'}`}
              onClick={handleNext}
            >
              {isLast ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1.5 6.5l3.5 3.5L11.5 2" />
                  </svg>
                  {completeLabel}
                </>
              ) : (
                <>
                  {nextLabel}
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 2l4.5 4.5L5 11" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Stepper.displayName = 'Stepper';
