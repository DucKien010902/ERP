export function DataTable({ columns, rows, keyField = 'id', emptyMessage = 'Chưa có dữ liệu.', showIndex = true }) {
  const totalColumns = columns.length + (showIndex ? 1 : 0);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {showIndex ? (
                <th className="w-14 whitespace-nowrap px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  STT
                </th>
              ) : null}
              {columns.map((column) => (
                <th key={column.key || column.label} className={`whitespace-nowrap px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 ${column.headerClassName || ''}`}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.length ? (
              rows.map((row, rowIndex) => (
                <tr key={row[keyField] || rowIndex} className="align-top transition hover:bg-teal-50/40">
                  {showIndex ? <td className="px-3 py-2.5 text-slate-500">{rowIndex + 1}</td> : null}
                  {columns.map((column) => (
                    <td key={column.key || column.label} className={`px-3 py-2.5 text-slate-700 ${column.className || ''}`}>
                      {column.render ? column.render(row, rowIndex) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={totalColumns} className="px-4 py-10 text-center text-sm text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
