'use client';

import { Checkbox, Input, Select, Textarea } from '@/components/ui/fields';

function resolveOptions(field, references) {
  if (typeof field.options === 'function') return field.options(references);
  if (field.optionsKey) return references?.[field.optionsKey] || [];
  return field.options || [];
}

export function FieldRenderer({ field, value, onChange, references = {} }) {
  const common = {
    label: field.label,
    required: field.required,
    hint: field.hint,
  };

  if (field.type === 'textarea') {
    return <Textarea {...common} value={value || ''} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} />;
  }

  if (field.type === 'select') {
    const options = resolveOptions(field, references);
    return (
      <Select {...common} value={value ?? ''} onChange={(event) => onChange(event.target.value)}>
        <option value="">{field.placeholder || 'Chọn dữ liệu'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );
  }

  if (field.type === 'multiselect') {
    const options = resolveOptions(field, references);
    const current = Array.isArray(value) ? value : [];
    return (
      <div>
        <div className="mb-2 text-sm font-medium text-slate-700">
          {field.label}
          {field.required ? <span className="text-rose-500"> *</span> : null}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {options.map((option) => {
            const checked = current.includes(option.value);
            return (
              <Checkbox
                key={option.value}
                label={option.label}
                description={option.description}
                checked={checked}
                onChange={(next) => {
                  if (next) {
                    onChange([...current, option.value]);
                  } else {
                    onChange(current.filter((item) => item !== option.value));
                  }
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  if (field.type === 'checkbox') {
    return <Checkbox label={field.label} description={field.description} checked={Boolean(value)} onChange={onChange} />;
  }

  return (
    <Input
      {...common}
      type={field.type || 'text'}
      value={value ?? ''}
      step={field.step}
      min={field.min}
      placeholder={field.placeholder}
      onChange={(event) => onChange(field.type === 'number' ? event.target.value : event.target.value)}
    />
  );
}
