import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X, AlertTriangle, CheckCircle2, Info, AlertCircle, Inbox, Loader2 } from 'lucide-react';

// Kit d'interface partagé par toutes les vues du back-office.
// Toute page admin doit composer ces éléments plutôt que de redéfinir ses propres styles.

const cx = (...classes) => classes.filter(Boolean).join(' ');

/* ------------------------------------------------------------------ */
/* Classes réutilisables (pour les champs gérés à la main)            */
/* ------------------------------------------------------------------ */

export const inputClass =
  'block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm ' +
  'transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ' +
  'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500';

export const inputErrorClass = 'border-red-400 focus:border-red-500 focus:ring-red-500/20';

export const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700';

export const fileInputClass =
  'block w-full text-sm text-gray-600 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 ' +
  'file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100';

export const checkboxClass =
  'h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-2 focus:ring-brand-500/30';

/* ------------------------------------------------------------------ */
/* Mise en page                                                        */
/* ------------------------------------------------------------------ */

// En-tête de page : titre, description et actions principales.
export const PageHeader = ({ icon: Icon, title, description, actions }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Icon size={20} />
        </div>
      )}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 md:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

// Conteneur blanc standard.
export const Card = ({ title, description, icon: Icon, actions, children, className, bodyClassName, padded = true }) => (
  <section className={cx('rounded-xl border border-gray-200 bg-white shadow-sm', className)}>
    {(title || actions) && (
      <header className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon size={18} className="text-brand-600" />}
          <div>
            {title && <h2 className="text-base font-semibold text-gray-900">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </header>
    )}
    <div className={cx(padded && 'p-5', bodyClassName)}>{children}</div>
  </section>
);

// Carte d'indicateur (statistiques en haut de page).
const statTones = {
  brand: 'bg-brand-50 text-brand-700',
  green: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-700',
  gray: 'bg-gray-100 text-gray-600',
};

export const StatCard = ({ label, value, icon: Icon, tone = 'brand', hint }) => (
  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
    {Icon && (
      <div className={cx('flex h-11 w-11 items-center justify-center rounded-xl', statTones[tone] || statTones.brand)}>
        <Icon size={20} />
      </div>
    )}
  </div>
);

/* ------------------------------------------------------------------ */
/* Boutons                                                             */
/* ------------------------------------------------------------------ */

const buttonVariants = {
  primary: 'bg-brand-700 text-white shadow-sm hover:bg-brand-800 focus-visible:ring-brand-500/40',
  secondary: 'border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:ring-brand-500/30',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500/40',
  success: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:ring-emerald-500/40',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-brand-500/30',
  link: 'text-brand-700 hover:text-brand-800 hover:underline focus-visible:ring-brand-500/30',
};

const buttonSizes = {
  sm: 'h-8 gap-1.5 px-3 text-xs',
  md: 'h-10 gap-2 px-4 text-sm',
  lg: 'h-11 gap-2 px-5 text-sm',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  className,
  children,
  type = 'button',
  disabled,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={cx(
      'inline-flex shrink-0 items-center justify-center rounded-lg font-medium transition',
      'focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60',
      buttonVariants[variant] || buttonVariants.primary,
      variant === 'link' ? 'gap-1.5 text-sm' : buttonSizes[size],
      className
    )}
    {...props}
  >
    {loading ? <Loader2 size={16} className="animate-spin" /> : Icon && <Icon size={16} />}
    {children}
    {IconRight && <IconRight size={16} />}
  </button>
);

// Bouton icône pour les actions de ligne (modifier, supprimer, voir...).
const iconButtonTones = {
  neutral: 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
  brand: 'text-brand-600 hover:bg-brand-50 hover:text-brand-800',
  danger: 'text-red-500 hover:bg-red-50 hover:text-red-700',
  success: 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700',
};

export const IconButton = ({ icon: Icon, label, tone = 'neutral', size = 16, className, type = 'button', ...props }) => (
  <button
    type={type}
    title={label}
    aria-label={label}
    className={cx(
      'inline-flex h-8 w-8 items-center justify-center rounded-lg transition',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 disabled:opacity-50',
      iconButtonTones[tone] || iconButtonTones.neutral,
      className
    )}
    {...props}
  >
    <Icon size={size} />
  </button>
);

/* ------------------------------------------------------------------ */
/* Formulaires                                                         */
/* ------------------------------------------------------------------ */

export const Field = ({ label, htmlFor, required, error, hint, className, children }) => (
  <div className={className}>
    {label && (
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
    )}
    {children}
    {hint && !error && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
    {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
  </div>
);

export const Input = React.forwardRef(({ className, error, ...props }, ref) => (
  <input ref={ref} className={cx(inputClass, error && inputErrorClass, className)} {...props} />
));

export const Textarea = React.forwardRef(({ className, error, rows = 4, ...props }, ref) => (
  <textarea ref={ref} rows={rows} className={cx(inputClass, error && inputErrorClass, className)} {...props} />
));

export const Select = React.forwardRef(({ className, error, children, ...props }, ref) => (
  <select ref={ref} className={cx(inputClass, 'pr-8', error && inputErrorClass, className)} {...props}>
    {children}
  </select>
));

export const FileInput = React.forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} type="file" className={cx(fileInputClass, className)} {...props} />
));

export const Checkbox = ({ label, className, ...props }) => (
  <label className={cx('inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700', className)}>
    <input type="checkbox" className={checkboxClass} {...props} />
    {label}
  </label>
);

// Pied de formulaire : actions alignées à droite.
export const FormActions = ({ children, className }) => (
  <div className={cx('mt-6 flex flex-col-reverse gap-2 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end', className)}>
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* Tableaux                                                            */
/* ------------------------------------------------------------------ */

export const Table = ({ children, className }) => (
  <div className="overflow-x-auto">
    <table className={cx('min-w-full divide-y divide-gray-200 text-sm', className)}>{children}</table>
  </div>
);

export const THead = ({ children }) => <thead className="bg-gray-50">{children}</thead>;

export const TBody = ({ children }) => <tbody className="divide-y divide-gray-100 bg-white">{children}</tbody>;

export const Th = ({ children, align = 'left', className, ...props }) => (
  <th
    scope="col"
    className={cx(
      'whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500',
      align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left',
      className
    )}
    {...props}
  >
    {children}
  </th>
);

export const Tr = ({ children, className, selected, ...props }) => (
  <tr className={cx('transition-colors hover:bg-gray-50/70', selected && 'bg-brand-50/60', className)} {...props}>
    {children}
  </tr>
);

export const Td = ({ children, align = 'left', className, ...props }) => (
  <td
    className={cx(
      'px-5 py-3.5 align-middle text-gray-700',
      align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left',
      className
    )}
    {...props}
  >
    {children}
  </td>
);

// Ligne vide à l'intérieur d'un tableau.
export const TableEmpty = ({ colSpan, message = 'Aucune donnée disponible', icon }) => (
  <tr>
    <td colSpan={colSpan} className="px-5 py-12">
      <EmptyState icon={icon} title={message} compact />
    </td>
  </tr>
);

// Groupe d'actions de ligne, aligné à droite.
export const RowActions = ({ children }) => <div className="flex items-center justify-end gap-1">{children}</div>;

/* ------------------------------------------------------------------ */
/* Retours d'état                                                      */
/* ------------------------------------------------------------------ */

const badgeTones = {
  gray: 'bg-gray-100 text-gray-700 ring-gray-200',
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  purple: 'bg-violet-50 text-violet-700 ring-violet-200',
};

export const Badge = ({ tone = 'gray', children, className }) => (
  <span
    className={cx(
      'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
      badgeTones[tone] || badgeTones.gray,
      className
    )}
  >
    {children}
  </span>
);

const alertTones = {
  error: { box: 'border-red-200 bg-red-50 text-red-800', Icon: AlertCircle, icon: 'text-red-500' },
  success: { box: 'border-emerald-200 bg-emerald-50 text-emerald-800', Icon: CheckCircle2, icon: 'text-emerald-500' },
  warning: { box: 'border-amber-200 bg-amber-50 text-amber-800', Icon: AlertTriangle, icon: 'text-amber-500' },
  info: { box: 'border-brand-200 bg-brand-50 text-brand-800', Icon: Info, icon: 'text-brand-500' },
};

export const Alert = ({ tone = 'info', title, children, onClose, className }) => {
  const t = alertTones[tone] || alertTones.info;
  return (
    <div className={cx('mb-4 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm', t.box, className)} role="alert">
      <t.Icon size={18} className={cx('mt-0.5 shrink-0', t.icon)} />
      <div className="flex-1">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={title ? 'mt-0.5' : ''}>{children}</div>}
      </div>
      {onClose && (
        <button type="button" onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100" aria-label="Fermer">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export const Spinner = ({ className }) => (
  <Loader2 className={cx('animate-spin text-brand-600', className)} size={28} />
);

export const LoadingState = ({ label = 'Chargement...' }) => (
  <div className="flex h-64 flex-col items-center justify-center gap-3 text-sm text-gray-500">
    <Spinner />
    <span>{label}</span>
  </div>
);

export const EmptyState = ({ icon: Icon = Inbox, title, description, action, compact = false }) => (
  <div className={cx('flex flex-col items-center justify-center text-center', compact ? 'py-2' : 'py-14')}>
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
      <Icon size={22} />
    </div>
    {title && <p className="text-sm font-medium text-gray-700">{title}</p>}
    {description && <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

/* ------------------------------------------------------------------ */
/* Fenêtres modales                                                    */
/* ------------------------------------------------------------------ */

const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-6xl',
};

export const Modal = ({ open = true, onClose, title, description, icon: Icon, size = 'md', footer, children }) => {
  useEffect(() => {
    if (!open || !onClose) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-[1px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cx('relative flex max-h-[90vh] w-full flex-col rounded-xl bg-white shadow-xl', modalSizes[size] || modalSizes.md)}
      >
        {(title || onClose) && (
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
            <div className="flex items-start gap-3">
              {Icon && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon size={18} />
                </div>
              )}
              <div>
                {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
                {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
              </div>
            </div>
            {onClose && <IconButton icon={X} label="Fermer" onClick={onClose} className="-mr-2" />}
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-2 rounded-b-xl border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Confirmation de suppression / action irréversible.
export const ConfirmDialog = ({
  open = true,
  title = 'Confirmer la suppression',
  message = 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.',
  confirmLabel = 'Supprimer',
  cancelLabel = 'Annuler',
  tone = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <Modal
      open
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className={cx(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          tone === 'danger' ? 'bg-red-100 text-red-600' : 'bg-brand-100 text-brand-700'
        )}>
          <AlertTriangle size={20} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <div className="mt-1 text-sm text-gray-600">{message}</div>
        </div>
      </div>
    </Modal>
  );
};

// Confirmation sous forme de promesse :
//   const { confirm, confirmDialog } = useConfirm();
//   if (!(await confirm({ message: '...' }))) return;
//   ...render {confirmDialog}
export const useConfirm = () => {
  const [options, setOptions] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback((opts = {}) => new Promise((resolve) => {
    resolver.current = resolve;
    setOptions(opts);
  }), []);

  const close = (result) => {
    setOptions(null);
    if (resolver.current) resolver.current(result);
    resolver.current = null;
  };

  const confirmDialog = (
    <ConfirmDialog
      open={!!options}
      {...(options || {})}
      onConfirm={() => close(true)}
      onCancel={() => close(false)}
    />
  );

  return { confirm, confirmDialog };
};

/* ------------------------------------------------------------------ */
/* Onglets                                                             */
/* ------------------------------------------------------------------ */

// tabs: [{ id, label, icon }]
export const Tabs = ({ tabs, active, onChange, className }) => (
  <div className={cx('border-b border-gray-200', className)}>
    <nav className="-mb-px flex gap-1 overflow-x-auto">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cx(
            'inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition',
            active === id
              ? 'border-brand-700 text-brand-700'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          )}
        >
          {Icon && <Icon size={16} />}
          {label}
        </button>
      ))}
    </nav>
  </div>
);

// Barre de recherche / filtres au-dessus d'une liste.
export const Toolbar = ({ children, className }) => (
  <div className={cx('flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center', className)}>
    {children}
  </div>
);
