'use client';

import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/fields';
import { formatCurrency } from '@/lib/format';

function emptyRow(fields) {
  return fields.reduce((row, field) => {
    row[field.key] = field.defaultValue ?? (field.type === 'number' ? '0' : '');
    return row;
  }, {});
}

export function LineItemsEditor({ title = 'Chi tiết dòng hàng', description, fields, rows, onChange, references = {} }) {
  function updateRow(index, key, value) {
    const next = rows.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row));
    onChange(next);
  }

  function removeRow(index) {
    onChange(rows.filter((_, rowIndex) => rowIndex !== index));
  }

  function addRow() {
    onChange([...(rows || []), emptyRow(fields)]);
  }

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          {description ? <div className="mt-1 text-sm text-slate-500">{description}</div> : null}
        </div>
        <Button variant="secondary" onClick={addRow}>Thêm dòng</Button>
      </div>

      <div className="space-y-4">
        {rows?.length ? (
          rows.map((row, index) => {
            const amount = Number(row.qty || row.requestedQty || 0) * Number(row.unitPrice || row.unitCost || 0);
            return (
              <div key={index} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-700">Dòng #{index + 1}</div>
                  <Button variant="ghost" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => removeRow(index)}>
                    Xóa
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {fields.map((field) => {
                    const options = typeof field.options === 'function' ? field.options(references) : references?.[field.optionsKey] || field.options || [];
                    if (field.type === 'select') {
                      return (
                        <Select
                          key={field.key}
                          label={field.label}
                          value={row[field.key] ?? ''}
                          onChange={(event) => updateRow(index, field.key, event.target.value)}
                        >
                          <option value="">{field.placeholder || 'Chọn dữ liệu'}</option>
                          {options.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </Select>
                      );
                    }
                    return (
                      <Input
                        key={field.key}
                        label={field.label}
                        type={field.type || 'text'}
                        value={row[field.key] ?? ''}
                        step={field.step}
                        placeholder={field.placeholder}
                        onChange={(event) => updateRow(index, field.key, event.target.value)}
                      />
                    );
                  })}
                </div>
                {amount > 0 ? (
                  <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-right text-sm text-slate-500">
                    Thành tiền dự kiến: <span className="font-semibold text-slate-900">{formatCurrency(amount)}</span>
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
            Chưa có dòng dữ liệu nào. Hãy thêm ít nhất một dòng trước khi lưu.
          </div>
        )}
      </div>
    </div>
  );
}
