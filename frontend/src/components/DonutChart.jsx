import Callout from './Callout'

const defaultColors = ['#4379F2', '#E65C00']
const fmt = (n) => Number(n).toLocaleString('id-ID')

export default function DonutChart({
  data = [],
  title = 'Komposisi total',
  subtitle = 'Proporsi berdasarkan data status perkawinan',
  calloutText = 'Diagram memperlihatkan proporsi setiap kategori status perkawinan berdasarkan data Excel yang diunggah.',
  palette = defaultColors,
  isLight = false,
}) {
  const rows = data.filter(
    (row) => !row.kategori.trim().toUpperCase().startsWith('JUMLAH TOTAL'),
  )

  const total = rows.reduce((sum, row) => sum + Number(row.jumlah), 0)
  const radius = 65
  const circumference = 2 * Math.PI * radius

  const segments = rows.reduce((acc, row, index) => {
    const value = Number(row.jumlah)
    const length = total ? (value / total) * circumference : 0
    const prevOffset = acc.length > 0 ? acc[acc.length - 1].nextOffset : 0
    acc.push({
      kategori: row.kategori,
      length,
      offset: prevOffset,
      nextOffset: prevOffset + length,
      color: palette[index % palette.length],
    })
    return acc
  }, [])

  return (
    <div
      className={`flex h-full flex-col justify-between rounded-xl border p-5 transition-all sm:p-6 ${
        isLight
          ? 'border-slate-300 bg-white text-slate-900 ring-1 ring-indigo-950/5 shadow-[0_8px_24px_-6px_rgba(30,27,75,0.12)]'
          : 'border-[#495057] bg-[#343A40] text-white'
      }`}
    >
      <div>
        <h3 className="mb-1 text-base font-bold sm:text-lg">{title}</h3>

        <p
          className={`mb-5 text-sm ${
            isLight ? 'text-slate-500' : 'text-[#CED4DA]'
          }`}
        >
          {subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 py-2">
          <svg
            viewBox="0 0 180 180"
            className="w-full max-w-[200px] shrink-0"
            role="img"
            aria-label={title}
          >
            {segments.map((seg) => (
              <circle
                key={seg.kategori}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="27"
                strokeDasharray={`${seg.length} ${circumference - seg.length}`}
                strokeDashoffset={-seg.offset}
                transform="rotate(-90 90 90)"
              />
            ))}

            <text
              x="90"
              y="86"
              textAnchor="middle"
              fontSize="20"
              fontWeight="800"
              fill={isLight ? '#1E1B4B' : '#FFFFFF'}
            >
              {fmt(total)}
            </text>

            <text
              x="90"
              y="105"
              textAnchor="middle"
              fontSize="11"
              fill={isLight ? '#64748B' : '#CED4DA'}
            >
              total jiwa
            </text>
          </svg>

          <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {rows.map((row, index) => (
              <div key={row.kategori} className="flex items-start gap-2.5 text-sm">
                <span
                  className="mt-1 h-3.5 w-3.5 shrink-0 rounded-sm border border-black/10"
                  style={{ background: palette[index % palette.length] }}
                />

                <span
                  className={`font-medium leading-snug ${
                    isLight ? 'text-slate-800' : 'text-white'
                  }`}
                >
                  {row.kategori}
                  <span
                    className={`block text-xs font-normal ${
                      isLight ? 'text-slate-500' : 'text-[#CED4DA]'
                    }`}
                  >
                    {fmt(row.jumlah)} (
                    {total
                      ? ((Number(row.jumlah) / total) * 100).toLocaleString(
                          'id-ID',
                          { maximumFractionDigits: 1 },
                        )
                      : '0'}
                    %)
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Callout>{calloutText}</Callout>
    </div>
  )
}
