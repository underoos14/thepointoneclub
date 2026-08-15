import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, required, children, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function TextField({ label, required, hint, className = '', ...props }: TextFieldProps) {
  return (
    <Field label={label} htmlFor={props.id} required={required} hint={hint}>
      <input
        className={`w-full rounded-sm border border-ink/15 bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-green-700 focus:ring-2 focus:ring-green-700/20 ${className}`}
        {...props}
      />
    </Field>
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

export function TextArea({ label, required, hint, rows = 4, className = '', ...props }: TextAreaProps) {
  return (
    <Field label={label} htmlFor={props.id} required={required} hint={hint}>
      <textarea
        rows={rows}
        className={`w-full resize-y rounded-sm border border-ink/15 bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-green-700 focus:ring-2 focus:ring-green-700/20 ${className}`}
        {...props}
      />
    </Field>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export function Select({ label, required, children, className = '', ...props }: SelectProps) {
  return (
    <Field label={label} htmlFor={props.id} required={required}>
      <select
        className={`w-full rounded-sm border border-ink/15 bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-green-700 focus:ring-2 focus:ring-green-700/20 ${className}`}
        {...props}
      >
        {children}
      </select>
    </Field>
  );
}

export function FieldList({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const update = (idx: number, value: string) => {
    const next = [...values];
    next[idx] = value;
    onChange(next);
  };

  const remove = (idx: number) => {
    onChange(values.filter((_, i) => i !== idx));
  };

  return (
    <Field label={label}>
      <div className="flex flex-col gap-2">
        {values.map((value, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              value={value}
              placeholder={placeholder}
              onChange={(e) => update(idx, e.target.value)}
              className="w-full rounded-sm border border-ink/15 bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
            />
            <button
              type="button"
              onClick={() => remove(idx)}
              aria-label={`Remove ${label.toLowerCase()} item`}
              className="shrink-0 rounded-sm border border-red-500 px-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500 hover:text-white"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...values, ''])}
          className="self-start rounded-sm border border-green-700 px-3 py-1.5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-100"
        >
          + Add item
        </button>
      </div>
    </Field>
  );
}
