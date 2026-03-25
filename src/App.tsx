import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Button,
  Input,
  Textarea,
  Select,
  AutocompleteSelect,
  Chip,
  ChipGroup,
  Table,
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonList,
  Card,
  BottomSheet,
  Dialog,
  ConfirmDialog,
  DatePicker,
  ExpansionPanel,
  Accordion,
  NotificationProvider,
  useNotification,
  Stepper,
  Tabs,
  SnackbarProvider,
  useSnackbar,
  CheckboxGroup,
  RadioGroup,
  Fab,
} from './components';
import type { ChipVariant } from './components';

// ─── Types ────────────────────────────────────────────────────────────────────
type Theme = 'light' | 'dark' | 'system';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
}

// ─── Sample data ──────────────────────────────────────────────────────────────
const USERS: User[] = [
  { id: 1, name: 'Valentina Gómez', email: 'vale@example.com', role: 'Admin', status: 'Activo', joined: '2024-01-15' },
  { id: 2, name: 'Matías Torres', email: 'matias@example.com', role: 'Editor', status: 'Activo', joined: '2024-02-20' },
  { id: 3, name: 'Lucía Fernández', email: 'lucia@example.com', role: 'Viewer', status: 'Inactivo', joined: '2024-03-05' },
  { id: 4, name: 'Rodrigo Pérez', email: 'rodrigo@example.com', role: 'Editor', status: 'Activo', joined: '2024-03-18' },
  { id: 5, name: 'Camila Sánchez', email: 'camila@example.com', role: 'Admin', status: 'Activo', joined: '2024-04-01' },
  { id: 6, name: 'Facundo Díaz', email: 'facundo@example.com', role: 'Viewer', status: 'Inactivo', joined: '2024-04-12' },
  { id: 7, name: 'Julieta Ramírez', email: 'juli@example.com', role: 'Editor', status: 'Activo', joined: '2024-05-03' },
  { id: 8, name: 'Gonzalo López', email: 'gonza@example.com', role: 'Viewer', status: 'Activo', joined: '2024-05-20' },
  { id: 9, name: 'Florencia Castro', email: 'flor@example.com', role: 'Editor', status: 'Inactivo', joined: '2024-06-08' },
  { id: 10, name: 'Ezequiel Moreno', email: 'eze@example.com', role: 'Admin', status: 'Activo', joined: '2024-06-25' },
  { id: 11, name: 'Agustina Ruiz', email: 'agus@example.com', role: 'Viewer', status: 'Activo', joined: '2024-07-10' },
  { id: 12, name: 'Tomás Herrera', email: 'tomas@example.com', role: 'Editor', status: 'Activo', joined: '2024-08-01' },
];

const roleOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'developer', label: 'Desarrollador' },
];

const countryOptions = [
  { value: 'ar', label: 'Argentina' },
  { value: 'cl', label: 'Chile' },
  { value: 'uy', label: 'Uruguay' },
  { value: 'py', label: 'Paraguay' },
  { value: 'bo', label: 'Bolivia' },
  { value: 'pe', label: 'Perú' },
  { value: 'ec', label: 'Ecuador' },
  { value: 'co', label: 'Colombia' },
];

const accordionItems = [
  { id: '1', title: '¿Qué es este sistema de componentes?', subtitle: 'Introducción y filosofía de diseño', content: 'Una librería de componentes React de producción con sistema de diseño cohesivo. Cada componente está diseñado para ser accesible, customizable y fácil de usar.' },
  { id: '2', title: '¿Cómo usar los inputs con validaciones?', subtitle: 'Validaciones y mensajes de error', content: 'Los inputs aceptan required para validación automática y onValidate para validación personalizada. El colorScheme permite customizar los colores de error, foco y label.' },
  { id: '3', title: '¿Cómo funciona el modo oscuro?', subtitle: 'Tokens CSS y data-theme', content: 'Todos los tokens están en variables CSS con prefijo --ui-*. El modo oscuro se activa con data-theme="dark" en el html, o automáticamente via prefers-color-scheme.' },
  { id: '4', title: '¿El sistema es accesible?', subtitle: 'ARIA y keyboard navigation', content: 'Sí. Todos los componentes implementan los patrones ARIA correctos, navegación por teclado, focus management, y roles semánticos.' },
];

const NAV_SECTIONS = [
  'Botones', 'Inputs', 'Textarea', 'Selects', 'Autocomplete',
  'Chips', 'Tabla', 'Skeletons', 'Cards', 'Bottom Sheet',
  'Dialogs', 'DatePicker', 'Expansión', 'Notificaciones',
  'Stepper', 'Tabs', 'Snackbar', 'Checkboxes', 'Radios', 'FAB',
  'Avatar Cards', 'Formulario',
];

// ─── Theme hook ───────────────────────────────────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('ui-theme') as Theme) ?? 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    localStorage.setItem('ui-theme', theme);
  }, [theme]);

  return { theme, setTheme };
}

// ─── Theme Toggle ─────────────────────────────────────────────────────────────
function ThemeToggle({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  const cycle = () => {
    const order: Theme[] = ['light', 'dark', 'system'];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };

  const icons: Record<Theme, React.ReactNode> = {
    light: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" />
      </svg>
    ),
    dark: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13.5 10A6 6 0 016 2.5a6 6 0 100 11A6 6 0 0013.5 10z" />
      </svg>
    ),
    system: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="12" height="8" rx="1.5" />
        <path d="M5 14h6M8 11v3" />
      </svg>
    ),
  };

  const labels: Record<Theme, string> = { light: 'Claro', dark: 'Oscuro', system: 'Sistema' };

  return (
    <button
      onClick={cycle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        width: '100%',
        padding: '8px 10px',
        borderRadius: 'var(--ui-radius-sm)',
        background: 'var(--ui-accent-subtle)',
        border: '1px solid var(--ui-accent-border)',
        color: 'var(--ui-accent)',
        cursor: 'pointer',
        fontSize: 12,
        fontFamily: 'inherit',
        fontWeight: 600,
        transition: 'all 150ms ease',
      }}
      aria-label={`Modo actual: ${labels[theme]}. Click para cambiar.`}
    >
      {icons[theme]}
      {labels[theme]}
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', opacity: 0.5 }} aria-hidden="true">
        <path d="M2 4l3 3 3-3" />
      </svg>
    </button>
  );
}

// ─── Notification demo ────────────────────────────────────────────────────────
function NotificationDemo() {
  const { notify } = useNotification();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Button variant="success-outline" size="sm" onClick={() => notify({ type: 'success', title: 'Guardado exitoso', message: 'Los cambios fueron guardados correctamente.' })}>Éxito</Button>
      <Button variant="danger-outline" size="sm" onClick={() => notify({ type: 'danger', title: 'Error crítico', message: 'No se pudo completar la operación.' })}>Error</Button>
      <Button variant="secondary" size="sm" onClick={() => notify({ type: 'warning', title: 'Atención', message: 'Esta acción no se puede deshacer.' })}>Advertencia</Button>
      <Button variant="ghost" size="sm" onClick={() => notify({ type: 'info', title: 'Información', message: 'Hay una nueva versión disponible.' })}>Info</Button>
      <Button variant="ghost" size="sm" onClick={() => notify({ type: 'success', title: 'Persistente', message: 'Esta no desaparece sola.', duration: 0 })}>Sin duración</Button>
    </div>
  );
}

// ─── Scroll reveal hook ───────────────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── Avatar helpers ────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  { bg: 'rgba(91,141,238,0.12)',  color: '#5b8dee' },
  { bg: 'rgba(14,168,114,0.12)', color: '#0ea872' },
  { bg: 'rgba(232,147,32,0.12)', color: '#e89320' },
  { bg: 'rgba(224,82,82,0.12)',  color: '#e05252' },
  { bg: 'rgba(138,86,230,0.12)', color: '#8a56e6' },
  { bg: 'rgba(20,184,166,0.12)', color: '#14b8a6' },
];
function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
function initials(name: string) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

// ─── Snackbar demo ────────────────────────────────────────────────────────────
function SnackbarDemo() {
  const { show } = useSnackbar();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Button size="sm" variant="primary" onClick={() => show({ message: 'Cambios guardados exitosamente.' })}>Simple</Button>
      <Button size="sm" variant="secondary" onClick={() => show({ message: 'Archivo eliminado.', action: { label: 'Deshacer', onClick: () => alert('Deshecho!') } })}>Con acción</Button>
      <Button size="sm" variant="ghost" onClick={() => show({ message: 'Procesando tu solicitud...', duration: 0 })}>Sin timeout</Button>
      <Button size="sm" variant="danger-outline" onClick={() => show({ message: 'No se pudo conectar al servidor.', duration: 6000 })}>Error (6s)</Button>
    </div>
  );
}

// ─── Form validation demo ─────────────────────────────────────────────────────
function FormValidationDemo() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirm: '', role: null as string | number | null,
    newsletter: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = useCallback((field: string, val: unknown) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => { const n = { ...e }; delete n[field]; return n; });
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'El nombre es requerido';
    else if (form.firstName.trim().length < 2) e.firstName = 'Mínimo 2 caracteres';
    if (!form.lastName.trim()) e.lastName = 'El apellido es requerido';
    if (!form.email.trim()) e.email = 'El email es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Formato de email inválido';
    if (!form.phone.trim()) e.phone = 'El teléfono es requerido';
    else if (!/^\+?[\d\s\-().]{7,}$/.test(form.phone)) e.phone = 'Teléfono inválido';
    if (!form.password) e.password = 'La contraseña es requerida';
    else if (form.password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (!form.confirm) e.confirm = 'Confirmá tu contraseña';
    else if (form.confirm !== form.password) e.confirm = 'Las contraseñas no coinciden';
    if (!form.role) e.role = 'Seleccioná un rol';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSuccess(true); }, 1200);
  };

  if (success) {
    return (
      <div className="ui-form-success">
        <div className="ui-form-success-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 16l7 7 13-13" />
          </svg>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ui-text)' }}>¡Registro exitoso!</div>
        <div style={{ fontSize: 14, color: 'var(--ui-text-dim)' }}>Bienvenido, {form.firstName}. Tu cuenta fue creada correctamente.</div>
        <Button size="sm" variant="ghost" onClick={() => { setSuccess(false); setForm({ firstName:'', lastName:'', email:'', phone:'', password:'', confirm:'', role: null, newsletter: false }); }}>
          Reiniciar formulario
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <Input label="Nombre" placeholder="Juan" value={form.firstName} onChange={v => set('firstName', v)} required error={errors.firstName} />
        <Input label="Apellido" placeholder="García" value={form.lastName} onChange={v => set('lastName', v)} required error={errors.lastName} />
        <Input label="Email" type="email" placeholder="juan@email.com" value={form.email} onChange={v => set('email', v)} required validate="email" error={errors.email} />
        <Input label="Teléfono" type="tel" placeholder="+54 11 1234-5678" value={form.phone} onChange={v => set('phone', v)} required validate="phone" error={errors.phone} />
        <Input label="Contraseña" type="password" placeholder="••••••••" value={form.password} onChange={v => set('password', v)} required validate={[{ type: 'minLength', value: 8 }]} error={errors.password} helperText="Mínimo 8 caracteres" />
        <Input
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          value={form.confirm}
          onChange={v => set('confirm', v)}
          required
          error={errors.confirm}
          onValidate={v => v && v !== form.password ? 'Las contraseñas no coinciden' : undefined}
        />
      </div>
      <div style={{ marginTop: 18 }}>
        <Select label="Rol" options={roleOptions} value={form.role} onChange={v => set('role', v)} required placeholder="Seleccioná tu rol..." error={errors.role} />
      </div>
      <label className="ui-checkbox" style={{ marginTop: 16, display: 'inline-flex', gap: 10 }}>
        <input type="checkbox" checked={form.newsletter} onChange={e => set('newsletter', e.target.checked)} />
        <span className="ui-checkbox-box">
          <span className="ui-checkbox-mark">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4l2.5 2.5L9 1" /></svg>
          </span>
        </span>
        <span style={{ fontSize: 13, color: 'var(--ui-text-dim)' }}>Quiero recibir novedades por email</span>
      </label>
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 20, borderTop: '1px solid var(--ui-border)' }}>
        <Button type="button" variant="ghost" onClick={() => setErrors({})}>Limpiar</Button>
        <Button type="submit" variant="primary" loading={submitting}>
          {submitting ? 'Enviando...' : 'Crear cuenta'}
        </Button>
      </div>
    </form>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const { theme, setTheme } = useTheme();

  const [inputVal, setInputVal] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [passVal, setPassVal] = useState('');
  const [textareaVal, setTextareaVal] = useState('');
  const [selectVal, setSelectVal] = useState<string | number | null>(null);
  const [autocompleteVal, setAutocompleteVal] = useState<string | number | null>(null);
  const [multiVals, setMultiVals] = useState<Array<string | number>>([]);
  const [dateVal, setDateVal] = useState<Date | null>(null);
  const [chips, setChips] = useState([
    { id: '1', label: 'React', variant: 'accent' as ChipVariant },
    { id: '2', label: 'TypeScript', variant: 'info' as ChipVariant },
    { id: '3', label: 'Vite', variant: 'success' as ChipVariant },
    { id: '4', label: 'Tailwind', variant: 'warning' as ChipVariant },
  ]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [activeNav, setActiveNav] = useState('Botones');
  const [checkboxVals, setCheckboxVals] = useState<string[]>(['react', 'typescript']);
  const [radioVal, setRadioVal] = useState('editor');
  const [radioCardVal, setRadioCardVal] = useState('monthly');
  const [stepperName, setStepperName] = useState('');
  const [stepperEmail, setStepperEmail] = useState('');
  const [stepperRole, setStepperRole] = useState<string | number | null>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveNav(id);
  };

  return (
    <SnackbarProvider>
    <NotificationProvider>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ui-bg)' }}>

        {/* Sidebar */}
        <aside style={{ width: 216, background: 'var(--ui-surface)', borderRight: '1px solid var(--ui-border)', padding: '0', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Logo */}
          <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--ui-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, var(--ui-accent), var(--ui-green))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="1" y="1" width="5" height="5" rx="1" />
                  <rect x="8" y="1" width="5" height="5" rx="1" />
                  <rect x="1" y="8" width="5" height="5" rx="1" />
                  <rect x="8" y="8" width="5" height="5" rx="1" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 16, fontWeight: 400, color: 'var(--ui-text)', lineHeight: 1.1 }}>UI Kit</div>
                <div style={{ fontSize: 10, color: 'var(--ui-text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 1 }}>Showcase</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '8px 8px' }} aria-label="Navegación de componentes">
            {NAV_SECTIONS.map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 10px',
                  fontSize: 13,
                  fontFamily: 'inherit',
                  background: activeNav === s ? 'var(--ui-accent-subtle)' : 'transparent',
                  color: activeNav === s ? 'var(--ui-accent)' : 'var(--ui-text-dim)',
                  border: 'none',
                  borderRadius: 'var(--ui-radius-sm)',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  fontWeight: activeNav === s ? 600 : 400,
                  marginBottom: 2,
                }}
                aria-current={activeNav === s ? 'page' : undefined}
              >
                {s}
              </button>
            ))}
          </nav>

          {/* Theme toggle */}
          <div style={{ padding: '12px 8px 16px', borderTop: '1px solid var(--ui-border)' }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ui-text-dim)', marginBottom: 8, paddingLeft: 2 }}>Tema</div>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: '40px 48px', maxWidth: 900, margin: '0 auto', width: '100%' }}>

          {/* Hero */}
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--ui-accent-subtle)', border: '1px solid var(--ui-accent-border)', borderRadius: 'var(--ui-radius-full)', padding: '3px 10px', marginBottom: 16 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ui-accent)', display: 'inline-block' }} aria-hidden="true" />
              <span style={{ fontSize: 11, color: 'var(--ui-accent)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Production Ready</span>
            </div>
            <h1 style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 52, fontWeight: 400, color: 'var(--ui-text)', margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Component<br /><span style={{ color: 'var(--ui-accent)' }}>Library</span>
            </h1>
            <p style={{ fontSize: 15, color: 'var(--ui-text-dim)', marginTop: 14, maxWidth: 480, lineHeight: 1.7 }}>
              Sistema de componentes React con design tokens, validaciones, modo oscuro y accesibilidad ARIA completa.
            </p>
            <div style={{ display: 'flex', gap: 7, marginTop: 18, flexWrap: 'wrap' }}>
              {['React 19', 'Vite 8', 'Tailwind v4', 'TypeScript', 'Dark Mode'].map((t) => (
                <Chip key={t} label={t} variant="default" size="sm" />
              ))}
            </div>
          </div>

          {/* Botones */}
          <Section id="Botones" title="Botones">
            <SubSection label="Variantes — Blue (primary)">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
            </SubSection>
            <SubSection label="Variantes — Green (success)">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                <Button variant="success">Success</Button>
                <Button variant="success-outline">Success Outline</Button>
              </div>
            </SubSection>
            <SubSection label="Variantes — Danger">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                <Button variant="danger">Danger</Button>
                <Button variant="danger-outline">Danger Outline</Button>
              </div>
            </SubSection>
            <SubSection label="Tamaños">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                <Button size="xs">XSmall</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </SubSection>
            <SubSection label="Estados">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                <Button loading>Cargando</Button>
                <Button disabled>Deshabilitado</Button>
                <Button icon={<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6.5 1v11M1 6.5h11" /></svg>}>Con ícono</Button>
                <Button variant="success" icon={<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 6.5l3 3 6-6" /></svg>} iconPosition="left">Guardado</Button>
              </div>
            </SubSection>
          </Section>

          {/* Inputs */}
          <Section id="Inputs" title="Inputs">
            <SubSection label="Auto-íconos — el ícono se detecta automáticamente por tipo, validate o label">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <Input label="Email" type="email" placeholder="tu@email.com" value={emailVal} onChange={setEmailVal} validate="email" required helperText="Ícono y validación automáticos por type=email" />
                <Input label="Contraseña" type="password" placeholder="••••••••" value={passVal} onChange={setPassVal} validate={[{ type: 'minLength', value: 8 }]} required helperText="Mínimo 8 caracteres" />
                <Input label="Teléfono" type="tel" placeholder="+54 11 1234-5678" value="" onChange={() => {}} validate="phone" helperText="Detectado por type=tel" />
                <Input label="Sitio web" type="url" placeholder="https://ejemplo.com" value="" onChange={() => {}} validate="url" helperText="Detectado por type=url" />
                <Input label="Nombre de usuario" placeholder="usuario_123" value="" onChange={() => {}} validate="username" helperText="Detectado por validate=username" />
                <Input label="Nombre completo" placeholder="Tu nombre..." value={inputVal} onChange={setInputVal} required helperText='Detectado por label "Nombre"' />
              </div>
            </SubSection>

            <SubSection label="Validaciones numéricas, rango y formatos especiales">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
                <Input label="Solo números" placeholder="42.5" value="" onChange={() => {}} validate="number" helperText="Entero o decimal" />
                <Input label="Edad" type="number" placeholder="25" value="" onChange={() => {}} validate={[{ type: 'integer' }, { type: 'min', value: 1 }, { type: 'max', value: 120 }]} helperText="Entre 1 y 120" />
                <Input label="Código postal" placeholder="1414" value="" onChange={() => {}} validate="postalcode" helperText="4-10 dígitos" />
                <Input label="Tarjeta de crédito" placeholder="4111 1111 1111 1111" value="" onChange={() => {}} validate="creditcard" helperText="16 dígitos" />
                <Input label="Dirección IP" placeholder="192.168.0.1" value="" onChange={() => {}} validate="ip" helperText="Formato IPv4" />
                <Input label="Solo alfanumérico" placeholder="abc123" value="" onChange={() => {}} validate="alphanumeric" helperText="Sin espacios ni símbolos" />
              </div>
            </SubSection>

            <SubSection label="Íconos manuales + estados">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <Input
                  label="Buscar"
                  placeholder="Buscar productos..."
                  value=""
                  onChange={() => {}}
                  startIcon={<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="6.5" cy="6.5" r="4.5" /><path d="M10 10l3 3" /></svg>}
                  endIcon={<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h11M3 6.5h7M5 10h3" /></svg>}
                  helperText="startIcon + endIcon manuales"
                />
                <Input label="Error personalizado" placeholder="Ingresá algo..." value="" onChange={() => {}} error="Error con color #7c3aed" colorScheme={{ error: '#7c3aed', focus: '#7c3aed' }} />
                <Input label="Campo válido" value="Contenido correcto" onChange={() => {}} success="¡Todo correcto!" />
                <Input label="Deshabilitado" value="Solo lectura" onChange={() => {}} disabled />
              </div>
            </SubSection>
          </Section>

          {/* Textarea */}
          <Section id="Textarea" title="Textarea">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <Textarea label="Descripción" placeholder="Escribí tu mensaje..." value={textareaVal} onChange={setTextareaVal} required helperText="Máximo 500 caracteres" rows={4} />
              <Textarea label="Con error" value="" onChange={() => {}} error="Este campo es requerido" required rows={4} />
              <Textarea label="Sin resize" value="" onChange={() => {}} resize="none" rows={3} helperText="No se puede redimensionar" />
              <Textarea label="Con éxito" value="Texto válido ingresado" onChange={() => {}} success="Descripción aceptada" rows={3} />
            </div>
          </Section>

          {/* Selects */}
          <Section id="Selects" title="Selects">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <Select label="Rol de usuario" options={roleOptions} value={selectVal} onChange={(v) => setSelectVal(v)} placeholder="Seleccionar rol..." required />
              <Select label="Con error" options={roleOptions} value={null} onChange={() => {}} error="Seleccioná una opción" placeholder="Seleccionar..." />
              <Select label="Deshabilitado" options={roleOptions} value="editor" onChange={() => {}} disabled />
              <Select label="Con íconos de estado" options={[
                { value: 'active', label: 'Activo', icon: <span style={{ color: 'var(--ui-success)', fontSize: 8 }} aria-hidden="true">●</span> },
                { value: 'inactive', label: 'Inactivo', icon: <span style={{ color: 'var(--ui-danger)', fontSize: 8 }} aria-hidden="true">●</span> },
                { value: 'pending', label: 'Pendiente', icon: <span style={{ color: 'var(--ui-warning)', fontSize: 8 }} aria-hidden="true">●</span> },
              ]} value={null} onChange={() => {}} placeholder="Estado..." />
            </div>
          </Section>

          {/* Autocomplete */}
          <Section id="Autocomplete" title="Autocomplete Select">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <AutocompleteSelect label="País (single)" options={countryOptions} value={autocompleteVal} onChange={(v) => setAutocompleteVal(v)} placeholder="Buscar país..." />
              <AutocompleteSelect multiple label="Países (multi-select)" options={countryOptions} value={multiVals} onChange={(vals) => setMultiVals(vals)} placeholder="Buscar y seleccionar..." helperText="Podés seleccionar varios" />
            </div>
          </Section>

          {/* Chips */}
          <Section id="Chips" title="Chips">
            <SubSection label="Variantes">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                <Chip label="Default" variant="default" />
                <Chip label="Accent (Blue)" variant="accent" />
                <Chip label="Success (Green)" variant="success" />
                <Chip label="Danger" variant="danger" />
                <Chip label="Info" variant="info" />
                <Chip label="Warning" variant="warning" />
              </div>
            </SubSection>
            <SubSection label="Removibles">
              <ChipGroup chips={chips} onRemove={(id) => setChips((c) => c.filter((x) => x.id !== id))} size="md" />
              {chips.length === 0 && (
                <Button size="sm" variant="ghost" style={{ marginTop: 8 }} onClick={() => setChips([{ id: '1', label: 'React', variant: 'accent' }, { id: '2', label: 'TypeScript', variant: 'info' }, { id: '3', label: 'Vite', variant: 'success' }, { id: '4', label: 'Tailwind', variant: 'warning' }])}>
                  Restaurar chips
                </Button>
              )}
            </SubSection>
            <SubSection label="Tamaños">
              <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap' }}>
                <Chip label="Small" variant="accent" size="sm" />
                <Chip label="Medium" variant="accent" size="md" />
                <Chip label="Large" variant="accent" size="lg" />
              </div>
            </SubSection>
          </Section>

          {/* Tabla */}
          <Section id="Tabla" title="Tabla">
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Button size="sm" variant="ghost" onClick={() => { setTableLoading(true); setTimeout(() => setTableLoading(false), 2000); }}>
                Simular carga (2s)
              </Button>
            </div>
            <Table
              data={USERS as unknown as Record<string, unknown>[]}
              rowKey="id"
              selectable
              globalSearch
              globalSearchPlaceholder="Buscar usuarios..."
              loading={tableLoading}
              onSelectionChange={(rows) => console.log('Seleccionados:', rows.length)}
              filters={[
                { id: 'role', label: 'Rol', options: [{ value: 'Admin', label: 'Admin' }, { value: 'Editor', label: 'Editor' }, { value: 'Viewer', label: 'Viewer' }] },
                { id: 'status', label: 'Estado', options: [{ value: 'Activo', label: 'Activo' }, { value: 'Inactivo', label: 'Inactivo' }] },
              ]}
              columns={[
                {
                  key: 'name', header: 'Nombre', sortable: true, searchable: true,
                  cell: (row) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--ui-accent-subtle)', border: '1px solid var(--ui-accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--ui-accent)', flexShrink: 0 }} aria-hidden="true">
                        {String(row.name).charAt(0)}
                      </div>
                      <span style={{ fontWeight: 500 }}>{String(row.name)}</span>
                    </div>
                  ),
                },
                { key: 'email', header: 'Email', searchable: true },
                {
                  key: 'role', header: 'Rol', sortable: true,
                  cell: (row) => {
                    const map: Record<string, ChipVariant> = { Admin: 'accent', Editor: 'info', Viewer: 'default' };
                    return <Chip label={String(row.role)} variant={map[String(row.role)] ?? 'default'} size="sm" />;
                  },
                },
                {
                  key: 'status', header: 'Estado', sortable: true,
                  cell: (row) => <Chip label={String(row.status)} variant={String(row.status) === 'Activo' ? 'success' : 'danger'} size="sm" />,
                },
                { key: 'joined', header: 'Alta', sortable: true },
              ]}
              pageSize={5}
              pageSizeOptions={[5, 10]}
              toolbar={<Button size="sm" variant="success-outline">Exportar CSV</Button>}
            />
          </Section>

          {/* Skeletons */}
          <Section id="Skeletons" title="Skeletons">
            <SubSection label="Elementos básicos">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Skeleton variant="heading" width="40%" />
                <Skeleton variant="text" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4 }}>
                  <Skeleton variant="circle" width={44} height={44} />
                  <Skeleton variant="button" width={96} height={36} />
                  <Skeleton variant="button" width={80} height={36} />
                </div>
              </div>
            </SubSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <div><SubSection label="Card skeleton"><SkeletonCard /></SubSection></div>
              <div><SubSection label="List skeleton"><SkeletonList items={3} /></SubSection></div>
            </div>
            <SubSection label="Table skeleton"><SkeletonTable rows={4} cols={4} /></SubSection>
          </Section>

          {/* Cards */}
          <Section id="Cards" title="Cards">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              <Card title="Card simple" description="Título y descripción básicos.">
                <p style={{ fontSize: 13, color: 'var(--ui-text-dim)', margin: 0 }}>Contenido de la card.</p>
              </Card>
              <Card title="Hoverable" description="Efecto hover al pasar el mouse." hoverable accent accentColor="var(--ui-accent)">
                <p style={{ fontSize: 13, color: 'var(--ui-text-dim)', margin: 0 }}>Border top azul.</p>
              </Card>
              <Card title="Clickable" description="Clickeá esta card." clickable onClick={() => alert('¡Card clickeada!')}>
                <p style={{ fontSize: 13, color: 'var(--ui-text-dim)', margin: 0 }}>Con onClick handler.</p>
              </Card>
            </div>
            <Card title="Con footer y accent verde" description="Header, body y footer independientes." accent accentColor="var(--ui-green)"
              footer={<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}><Button size="sm" variant="ghost">Cancelar</Button><Button size="sm" variant="success">Guardar</Button></div>}>
              <p style={{ fontSize: 13, color: 'var(--ui-text-dim)', margin: 0 }}>El accent puede ser azul o verde. El footer tiene background diferente.</p>
            </Card>
          </Section>

          {/* Bottom Sheet */}
          <Section id="Bottom Sheet" title="Bottom Sheet">
            <p style={{ fontSize: 13, color: 'var(--ui-text-dim)', marginTop: 0, lineHeight: 1.6 }}>
              Desliza desde abajo. Soporta modo oscuro automáticamente.
            </p>
            <Button onClick={() => setSheetOpen(true)}>Abrir Bottom Sheet</Button>
            <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Opciones de usuario">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {['Editar perfil', 'Cambiar contraseña', 'Notificaciones', 'Privacidad'].map((item) => (
                    <button key={item} style={{ padding: '11px 14px', background: 'var(--ui-surface)', border: '1px solid var(--ui-border)', borderRadius: 'var(--ui-radius-md)', color: 'var(--ui-text)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 150ms' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ui-accent-border)'; e.currentTarget.style.background = 'var(--ui-accent-subtle)'; e.currentTarget.style.color = 'var(--ui-accent)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--ui-border)'; e.currentTarget.style.background = 'var(--ui-surface)'; e.currentTarget.style.color = 'var(--ui-text)'; }}
                      onClick={() => setSheetOpen(false)}>
                      {item}
                    </button>
                  ))}
                </div>
                <Button fullWidth variant="ghost" onClick={() => setSheetOpen(false)}>Cancelar</Button>
              </div>
            </BottomSheet>
          </Section>

          {/* Dialogs */}
          <Section id="Dialogs" title="Dialogs">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button onClick={() => setDialogOpen(true)}>Dialog con formulario</Button>
              <Button variant="danger-outline" onClick={() => setConfirmOpen(true)}>Confirm dialog</Button>
            </div>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Editar perfil" description="Actualizá tu información personal"
              icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 1a4 4 0 100 8A4 4 0 009 1zM1 17c0-4 3.6-7 8-7s8 3 8 7" /></svg>}
              footer={<><Button variant="ghost" size="sm" onClick={() => setDialogOpen(false)}>Cancelar</Button><Button size="sm" onClick={() => setDialogOpen(false)}>Guardar cambios</Button></>}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Input label="Nombre completo" value="Valentina Gómez" onChange={() => {}} />
                <Input label="Email" type="email" value="vale@example.com" onChange={() => {}} />
                <Select label="Rol" options={roleOptions} value="admin" onChange={() => {}} />
              </div>
            </Dialog>
            <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={() => setConfirmOpen(false)} title="Eliminar usuario" message="¿Estás seguro que querés eliminar este usuario? Esta acción no se puede deshacer." confirmLabel="Eliminar" cancelLabel="Cancelar" variant="danger" />
          </Section>

          {/* DatePicker */}
          <Section id="DatePicker" title="DatePicker">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              <DatePicker label="Fecha de nacimiento" value={dateVal} onChange={setDateVal} placeholder="DD/MM/AAAA" required helperText="Seleccioná desde el calendario" />
              <DatePicker label="Solo fechas futuras" value={null} onChange={() => {}} minDate={new Date()} placeholder="A partir de hoy" helperText="No permite fechas pasadas" />
              <DatePicker label="Con error" value={null} onChange={() => {}} error="La fecha es requerida" required />
              <DatePicker label="Deshabilitado" value={new Date(2024, 5, 15)} onChange={() => {}} disabled />
            </div>
          </Section>

          {/* Expansion */}
          <Section id="Expansión" title="Expansion Panels">
            <SubSection label="Individual">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <ExpansionPanel title="Abierto por defecto" subtitle="defaultOpen=true" defaultOpen
                  icon={<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="7.5" cy="7.5" r="5.5" /><path d="M7.5 5v3l1.5 1.5" /></svg>}>
                  Este panel comienza abierto gracias a <code style={{ background: 'var(--ui-surface)', padding: '1px 5px', borderRadius: 3, fontSize: 12, color: 'var(--ui-accent)' }}>defaultOpen</code>. La animación usa transición de altura CSS.
                </ExpansionPanel>
                <ExpansionPanel title="Cerrado por defecto" subtitle="Click para abrir">
                  Contenido oculto hasta la interacción del usuario.
                </ExpansionPanel>
              </div>
            </SubSection>
            <SubSection label="Accordion (solo uno abierto)">
              <Accordion items={accordionItems.map(i => ({ ...i, content: <p style={{ margin: 0 }}>{i.content}</p> }))} defaultOpenId="1" />
            </SubSection>
          </Section>

          {/* Notificaciones */}
          <Section id="Notificaciones" title="Notificaciones">
            <p style={{ fontSize: 13, color: 'var(--ui-text-dim)', marginTop: 0, lineHeight: 1.6 }}>
              Usá el hook <code style={{ background: 'var(--ui-surface)', padding: '1px 5px', borderRadius: 3, fontSize: 12, color: 'var(--ui-accent)' }}>useNotification()</code> desde cualquier componente dentro del <code style={{ background: 'var(--ui-surface)', padding: '1px 5px', borderRadius: 3, fontSize: 12, color: 'var(--ui-accent)' }}>NotificationProvider</code>.
            </p>
            <NotificationDemo />
          </Section>

          {/* Stepper */}
          <Section id="Stepper" title="Stepper">
            <Stepper
              onComplete={() => alert('¡Registro completado!')}
              steps={[
                {
                  label: 'Información personal',
                  subtitle: 'Nombre y contacto',
                  validate: () => {
                    if (!stepperName.trim()) return 'El nombre es requerido';
                    if (!stepperEmail.trim()) return 'El email es requerido';
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stepperEmail)) return 'Ingresá un email válido';
                    return undefined;
                  },
                  content: (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Input label="Nombre completo" value={stepperName} onChange={setStepperName} required placeholder="Tu nombre completo" />
                      <Input label="Email" type="email" value={stepperEmail} onChange={setStepperEmail} required placeholder="tu@email.com" validate="email" />
                    </div>
                  ),
                },
                {
                  label: 'Rol y permisos',
                  subtitle: 'Nivel de acceso',
                  validate: () => !stepperRole ? 'Seleccioná un rol para continuar' : undefined,
                  content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <Select label="Rol de usuario" options={roleOptions} value={stepperRole} onChange={setStepperRole} required placeholder="Seleccionar rol..." />
                      <RadioGroup
                        label="Nivel de permisos"
                        options={[
                          { value: 'read',  label: 'Solo lectura',          description: 'Puede ver contenido' },
                          { value: 'write', label: 'Lectura y escritura',   description: 'Puede crear y editar' },
                          { value: 'admin', label: 'Administrador',          description: 'Acceso completo' },
                        ]}
                        value={radioVal}
                        onChange={setRadioVal}
                        orientation="horizontal"
                      />
                    </div>
                  ),
                },
                {
                  label: 'Confirmación',
                  subtitle: 'Revisá los datos',
                  optional: false,
                  content: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <p style={{ margin: '0 0 6px', fontSize: 13, color: 'var(--ui-text-dim)', lineHeight: 1.6 }}>
                        Revisá la información antes de finalizar. Podés hacer click en los pasos anteriores para editar.
                      </p>
                      {([
                        ['Nombre',     stepperName  || '—'],
                        ['Email',      stepperEmail || '—'],
                        ['Rol',        roleOptions.find(r => r.value === stepperRole)?.label || '—'],
                        ['Permisos',   { read: 'Solo lectura', write: 'Lectura y escritura', admin: 'Administrador' }[radioVal] || '—'],
                      ] as [string, string][]).map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--ui-surface)', borderRadius: 'var(--ui-radius-md)', border: '1px solid var(--ui-border)' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ui-text-placeholder)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-text)' }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  ),
                },
              ]}
            />
          </Section>

          {/* Tabs */}
          <Section id="Tabs" title="Tabs">
            <SubSection label="Line (default)">
              <Tabs
                variant="line"
                items={[
                  { id: 'overview', label: 'Overview', content: <p style={{ margin: 0, fontSize: 14, color: 'var(--ui-text-dim)' }}>Contenido del panel Overview. Los tabs con variante <strong>line</strong> usan un borde inferior como indicador activo.</p> },
                  { id: 'analytics', label: 'Analytics', badge: 3, content: <p style={{ margin: 0, fontSize: 14, color: 'var(--ui-text-dim)' }}>Datos de analytics. Este tab tiene un badge numérico.</p> },
                  { id: 'settings', label: 'Settings', content: <p style={{ margin: 0, fontSize: 14, color: 'var(--ui-text-dim)' }}>Configuración general del panel.</p> },
                  { id: 'disabled', label: 'Deshabilitado', disabled: true, content: null },
                ]}
              />
            </SubSection>
            <SubSection label="Pill">
              <Tabs
                variant="pill"
                items={[
                  { id: 'all', label: 'Todos', content: <p style={{ margin: 0, fontSize: 14, color: 'var(--ui-text-dim)' }}>Mostrando todos los elementos.</p> },
                  { id: 'active', label: 'Activos', badge: '12', content: <p style={{ margin: 0, fontSize: 14, color: 'var(--ui-text-dim)' }}>Elementos activos en el sistema.</p> },
                  { id: 'archived', label: 'Archivados', content: <p style={{ margin: 0, fontSize: 14, color: 'var(--ui-text-dim)' }}>Elementos archivados.</p> },
                ]}
              />
            </SubSection>
            <SubSection label="Toggle">
              <Tabs
                variant="toggle"
                items={[
                  { id: 'day', label: 'Día', content: <p style={{ margin: 0, fontSize: 14, color: 'var(--ui-text-dim)' }}>Vista por día.</p> },
                  { id: 'week', label: 'Semana', content: <p style={{ margin: 0, fontSize: 14, color: 'var(--ui-text-dim)' }}>Vista por semana.</p> },
                  { id: 'month', label: 'Mes', content: <p style={{ margin: 0, fontSize: 14, color: 'var(--ui-text-dim)' }}>Vista por mes.</p> },
                  { id: 'year', label: 'Año', content: <p style={{ margin: 0, fontSize: 14, color: 'var(--ui-text-dim)' }}>Vista por año.</p> },
                ]}
              />
            </SubSection>
          </Section>

          {/* Snackbar */}
          <Section id="Snackbar" title="Snackbar">
            <p style={{ fontSize: 13, color: 'var(--ui-text-dim)', marginTop: 0, lineHeight: 1.6 }}>
              Usá <code style={{ background: 'var(--ui-surface)', padding: '1px 5px', borderRadius: 3, fontSize: 12, color: 'var(--ui-accent)' }}>useSnackbar()</code> para mostrar mensajes efímeros en la parte inferior. A diferencia de las notificaciones, el Snackbar es único y no apilable.
            </p>
            <SnackbarDemo />
          </Section>

          {/* Checkboxes */}
          <Section id="Checkboxes" title="Checkbox Groups">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <SubSection label="Vertical con select all">
                  <CheckboxGroup
                    label="Tecnologías"
                    options={[
                      { value: 'react', label: 'React', description: 'Librería UI de Meta' },
                      { value: 'typescript', label: 'TypeScript', description: 'Tipado estático para JS' },
                      { value: 'vite', label: 'Vite', description: 'Build tool moderno' },
                      { value: 'tailwind', label: 'Tailwind CSS', description: 'Utility-first CSS' },
                      { value: 'node', label: 'Node.js', disabled: true, description: 'No disponible' },
                    ]}
                    value={checkboxVals}
                    onChange={setCheckboxVals}
                    helperText={`${checkboxVals.length} seleccionado(s)`}
                  />
                </SubSection>
              </div>
              <div>
                <SubSection label="Horizontal con error">
                  <CheckboxGroup
                    label="Permisos"
                    options={[
                      { value: 'read', label: 'Leer' },
                      { value: 'write', label: 'Escribir' },
                      { value: 'delete', label: 'Eliminar' },
                    ]}
                    value={[]}
                    onChange={() => {}}
                    orientation="horizontal"
                    error="Seleccioná al menos un permiso"
                    showSelectAll={false}
                  />
                </SubSection>
              </div>
            </div>
          </Section>

          {/* FAB */}
          <Section id="FAB" title="FAB — Floating Action Button">
            <SubSection label="Variantes y tamaños">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                <Fab variant="primary" size="sm" icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M8 2v12M2 8h12" /></svg>} tooltip="Agregar (sm)" />
                <Fab variant="primary" size="md" icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M10 3v14M3 10h14" /></svg>} tooltip="Agregar (md)" />
                <Fab variant="primary" size="lg" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 4v16M4 12h16" /></svg>} tooltip="Agregar (lg)" />
                <Fab variant="secondary" size="md" icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h14M10 3l7 7-7 7" /></svg>} tooltip="Secondary" />
                <Fab variant="success" size="md" icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10l5 5 9-9" /></svg>} tooltip="Success" />
                <Fab variant="danger" size="md" icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4l12 12M16 4L4 16" /></svg>} tooltip="Danger" />
                <Fab variant="surface" size="md" icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="8" /><path d="M10 6v4l2.5 2.5" /></svg>} tooltip="Surface" />
              </div>
            </SubSection>

            <SubSection label="Extended (con etiqueta)">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                <Fab variant="primary" size="md" label="Crear nuevo"
                  icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M9 2v14M2 9h14" /></svg>}
                />
                <Fab variant="success" size="md" label="Guardar cambios"
                  icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9l5 5 9-9" /></svg>}
                />
                <Fab variant="secondary" size="sm" label="Compartir"
                  icon={<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="2.5" r="1.5" /><circle cx="2.5" cy="7.5" r="1.5" /><circle cx="12" cy="12.5" r="1.5" /><path d="M4 7.5h5M4 3.5l4 3M4 11l4-3" /></svg>}
                />
                <Fab variant="danger" size="sm" label="Eliminar" disabled
                  icon={<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h9M6 4V2.5h3V4M5 4v7.5h5V4" /></svg>}
                />
              </div>
            </SubSection>

            <SubSection label="Posición fija — aparece en la pantalla">
              <p style={{ fontSize: 13, color: 'var(--ui-text-dim)', margin: '0 0 12px' }}>
                Usá <code style={{ background: 'var(--ui-surface)', padding: '1px 6px', borderRadius: 4, color: 'var(--ui-accent)', fontSize: 12 }}>position="bottom-right"</code> para fijar el FAB sobre el contenido.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <Fab variant="primary" size="md" label="Nuevo" position="static"
                  icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M9 2v14M2 9h14" /></svg>}
                  style={{ opacity: 0.5, cursor: 'default' }}
                />
                <span style={{ fontSize: 12, color: 'var(--ui-text-dim)', alignSelf: 'center' }}>← Este FAB vive en el DOM estático. Para posición fija, usá <code style={{ fontSize: 11 }}>position="bottom-right"</code></span>
              </div>
            </SubSection>
          </Section>

          {/* Radios */}
          <Section id="Radios" title="Radio Groups">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <SubSection label="Default vertical">
                  <RadioGroup
                    label="Rol de usuario"
                    options={roleOptions.map(r => ({ value: r.value, label: r.label, description: r.value === 'admin' ? 'Acceso completo al sistema' : r.value === 'editor' ? 'Puede crear y editar contenido' : 'Solo lectura' }))}
                    value={radioVal}
                    onChange={setRadioVal}
                    helperText={`Seleccionado: ${roleOptions.find(r => r.value === radioVal)?.label}`}
                  />
                </SubSection>
              </div>
              <div>
                <SubSection label="Card variant">
                  <RadioGroup
                    label="Plan de facturación"
                    variant="card"
                    options={[
                      { value: 'monthly', label: 'Mensual', description: '$9.99 / mes' },
                      { value: 'yearly', label: 'Anual', description: '$99 / año — ahorrás 17%' },
                      { value: 'lifetime', label: 'Lifetime', description: '$299 pago único' },
                    ]}
                    value={radioCardVal}
                    onChange={setRadioCardVal}
                  />
                </SubSection>
              </div>
            </div>
          </Section>

          {/* Avatar Cards */}
          <Section id="Avatar Cards" title="Avatar Cards">
            <SubSection label="Cards de usuario con avatar generado">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {USERS.slice(0, 6).map((user) => {
                  const { bg, color } = avatarColor(user.name);
                  const roleVariant: Record<string, string> = { Admin: 'var(--ui-accent)', Editor: 'var(--ui-warning)', Viewer: 'var(--ui-text-dim)' };
                  return (
                    <div
                      key={user.id}
                      style={{
                        background: 'var(--ui-surface)',
                        border: '1px solid var(--ui-border)',
                        borderRadius: 'var(--ui-radius-lg)',
                        padding: '20px 18px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                        transition: 'box-shadow 200ms ease, transform 200ms ease',
                        cursor: 'default',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                    >
                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color, flexShrink: 0, letterSpacing: '-0.02em' }} aria-hidden="true">
                          {initials(user.name)}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ui-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--ui-text-dim)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div style={{ height: 1, background: 'var(--ui-border)' }} />

                      {/* Meta */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: roleVariant[user.role] ?? 'var(--ui-text-dim)', display: 'inline-block' }} aria-hidden="true" />
                          <span style={{ fontSize: 12, fontWeight: 500, color: roleVariant[user.role] ?? 'var(--ui-text-dim)' }}>{user.role}</span>
                        </div>
                        <span style={{ fontSize: 11, color: user.status === 'Activo' ? 'var(--ui-success)' : 'var(--ui-danger)', fontWeight: 600, background: user.status === 'Activo' ? 'rgba(14,168,114,0.1)' : 'rgba(224,82,82,0.1)', padding: '2px 8px', borderRadius: 'var(--ui-radius-full)' }}>
                          {user.status}
                        </span>
                      </div>

                      {/* Footer */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, color: 'var(--ui-text-placeholder)' }}>
                          Alta: {new Date(user.joined).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <button
                          style={{ fontSize: 11, fontWeight: 600, color: 'var(--ui-accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
                          onClick={() => alert(`Ver perfil de ${user.name}`)}
                        >
                          Ver perfil →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SubSection>

            <SubSection label="Avatar group (stack)">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ display: 'flex' }}>
                  {USERS.slice(0, 5).map((user, i) => {
                    const { bg, color } = avatarColor(user.name);
                    return (
                      <div
                        key={user.id}
                        title={user.name}
                        style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: bg, color, border: '2px solid var(--ui-bg)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, letterSpacing: '-0.02em',
                          marginLeft: i === 0 ? 0 : -10,
                          zIndex: 5 - i, position: 'relative',
                          flexShrink: 0,
                        }}
                        aria-label={user.name}
                      >
                        {initials(user.name)}
                      </div>
                    );
                  })}
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--ui-surface)', border: '2px solid var(--ui-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--ui-text-dim)', marginLeft: -10, zIndex: 0, position: 'relative' }}>
                    +{USERS.length - 5}
                  </div>
                </div>
                <span style={{ fontSize: 13, color: 'var(--ui-text-dim)' }}>{USERS.length} usuarios en el equipo</span>
              </div>
            </SubSection>
          </Section>

          {/* Formulario */}
          <Section id="Formulario" title="Validación de Formularios">
            <p style={{ fontSize: 13, color: 'var(--ui-text-dim)', marginTop: 0, lineHeight: 1.6, marginBottom: 0 }}>
              Ejemplo de formulario con validaciones en tiempo real, mensajes de error por campo,
              estado de carga y pantalla de éxito. Usa el componente <code style={{ background: 'var(--ui-surface)', padding: '1px 5px', borderRadius: 3, fontSize: 12, color: 'var(--ui-accent)' }}>Input</code> con
              sus validadores integrados.
            </p>
            <FormValidationDemo />
          </Section>
        </main>
      </div>
    </NotificationProvider>
    </SnackbarProvider>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const ref = useScrollReveal();
  return (
    <section ref={ref as React.RefObject<HTMLElement>} id={id} className="ui-reveal" style={{ marginBottom: 60, scrollMarginTop: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, paddingBottom: 14, borderBottom: '1px solid var(--ui-border)' }}>
        <h2 style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 28, fontWeight: 400, color: 'var(--ui-text)', margin: 0, lineHeight: 1, letterSpacing: '-0.01em' }}>
          {title}
        </h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>{children}</div>
    </section>
  );
}

function SubSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ui-text-dim)', marginBottom: 10 }}>
        {label}
      </div>
      {children}
    </div>
  );
}
