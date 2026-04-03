import clsx from 'clsx';

export default function DataTable({ columns, data, onRowClick, emptyText }) {
  if (!data || data.length === 0) {
    return (
      <div className='py-12 text-center text-gray-400'>
        {emptyText || 'No data to display'}
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full'>
        <thead>
          <tr className='border-b border-gray-100'>
            {columns.map((col) => (
              <th
                key={col.key}
                className='px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500'
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-50'>
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick && onRowClick(row)}
              className={clsx(
                'transition-colors',
                onRowClick && 'cursor-pointer hover:bg-gray-50'
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className='px-4 py-3 text-sm text-gray-700'>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
