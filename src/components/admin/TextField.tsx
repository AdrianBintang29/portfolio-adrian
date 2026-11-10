export const inputClass =
  'mt-2 w-full border border-navy/30 bg-white px-4 py-3 text-navy focus:border-navy focus:outline-none';

type TextFieldProps = {
  name: string;
  label: string;
  defaultValue: string;
  maxLength: number;
  type?: string;
  required?: boolean;
  hint?: string;
  multiline?: boolean;
  rows?: number;
};

export function TextField({
  name,
  label,
  defaultValue,
  maxLength,
  type = 'text',
  required = false,
  hint,
  multiline = false,
  rows = 4,
}: TextFieldProps) {
  const describedBy = hint ? `${name}-hint` : undefined;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-bold text-navy">
        {label}
      </label>

      {multiline ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          defaultValue={defaultValue}
          maxLength={maxLength}
          required={required}
          aria-describedby={describedBy}
          className={inputClass}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          maxLength={maxLength}
          required={required}
          aria-describedby={describedBy}
          className={inputClass}
        />
      )}

      {hint && (
        <p id={`${name}-hint`} className="mt-1 text-xs text-gray-blue">
          {hint}
        </p>
      )}
    </div>
  );
}
