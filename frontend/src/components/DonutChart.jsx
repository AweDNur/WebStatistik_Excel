import Callout from './Callout'

const colors = ['#7FA79D', '#1F5C57', '#D8A34B', '#C4633B']
const fmt = (n) => Number(n).toLocaleString('id-ID')

export default function DonutChart({ data = [] }) {
  const rows = data.filter(
    (row) => !row.kategori.trim().toUpperCase().startsWith('JUMLAH TOTAL'),
  )

  const total = rows.reduce((sum, row) => sum + Number(row.jumlah), 0)
  const radius = 65
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="rounded-xl border border-[#E1DACB] bg-white p-5 sm:p-6">
      <h3 className="mb-1 text-sm font-semibold">Komposisi total</h3>

      <p className="mb-4 text-xs text-[#6E6857]">
        Proporsi berdasarkan data status perkawinan
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <svg
          viewBox="0 0 180 180"
          className="w-full max-w-[180px]"
          role="img"
          aria-label="Diagram donat status perkawinan"
        >
          {rows.map((row, index) => {
            const value = Number(row.jumlah)
            const length = total ? (value / total) * circumference : 0

            const circle = (
              <circle
                key={row.kategori}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={colors[index % colors.length]}
                strokeWidth="27"
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 90 90)"
              />
            )

            offset += length
            return circle
          })}

          <text
            x="90"
            y="87"
            textAnchor="middle"
            fontSize="19"
            fontWeight="800"
            fill="#132A2E"
          >
            {fmt(total)}
          </text>

          <text
            x="90"
            y="104"
            textAnchor="middle"
            fontSize="10"
            fill="#6E6857"
          >
            total jiwa
          </text>
        </svg>

        <div className="space-y-3">
          {rows.map((row, index) => (
            <div key={row.kategori} className="flex items-start gap-2 text-xs">
              <span
                className="mt-0.5 h-3 w-3 shrink-0 rounded-sm"
                style={{ background: colors[index % colors.length] }}
              />

              <span>
                {row.kategori}
                <span className="block text-[#6E6857]">
                  {fmt(row.jumlah)} (
                  {total
                    ? (Number(row.jumlah) / total * 100).toLocaleString(
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

      <Callout>
        Diagram memperlihatkan proporsi setiap kategori status perkawinan
        berdasarkan data Excel yang diunggah.
      </Callout>
    </div>
  )
}