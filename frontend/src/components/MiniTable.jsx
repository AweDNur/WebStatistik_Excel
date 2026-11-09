export default function MiniTable({ title, headers, rows }) {
  const cardClass = 'rounded-xl border border-[#495057] bg-[#343A40] p-5 text-white sm:p-6'

  return (
    <div className={cardClass}>
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="border-b border-[#495057] px-2 py-2 text-left font-semibold text-[#ADB5BD]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr
                key={`${title}-${i}`}
                className={i === rows.length - 1 ? 'font-bold' : ''}
              >
                {row.map((cell, j) => (
                  <td
                    key={`${i}-${j}`}
                  className="border-b border-[#495057] px-2 py-2 last:whitespace-nowrap"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
