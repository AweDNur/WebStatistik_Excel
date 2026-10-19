import Legend from './Legend'
import Callout from './Callout'

const fmt = (n) => Number(n).toLocaleString('id-ID')

export default function EducationChart({ data = [] }) {
  const rows = data.filter(
    (row) => !row.kategori.trim().toUpperCase().startsWith('JUMLAH TOTAL'),
  )

  const max = Math.max(
    1,
    ...rows.map((row) =>
      Math.max(Number(row.laki_laki), Number(row.perempuan)),
    ),
  )

  return (
    <div className="rounded-xl border border-[#E1DACB] bg-white p-5 sm:p-6">
      <Legend />

      <div className="space-y-4">
        {rows.map((row) => (
          <div
            key={row.kategori}
            className="grid grid-cols-[105px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[155px_minmax(0,1fr)]"
          >
            <div className="text-right text-[10px] leading-tight text-[#6E6857] sm:text-xs">
              {row.kategori}
            </div>

            <div className="space-y-1">
              <div className="h-3">
                <div
                  className="h-3 rounded-sm bg-[#1F5C57]"
                  style={{
                    width: `${(Number(row.laki_laki) / max) * 100}%`,
                    minWidth: row.laki_laki ? 2 : 0,
                  }}
                  title={`Laki-laki: ${fmt(row.laki_laki)}`}
                />
              </div>

              <div className="h-3">
                <div
                  className="h-3 rounded-sm bg-[#C4633B]"
                  style={{
                    width: `${(Number(row.perempuan) / max) * 100}%`,
                    minWidth: row.perempuan ? 2 : 0,
                  }}
                  title={`Perempuan: ${fmt(row.perempuan)}`}
                />
              </div>

              <p className="text-[10px] text-[#6E6857]">
                L {fmt(row.laki_laki)} · P {fmt(row.perempuan)} · Total{' '}
                {fmt(row.jumlah)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Callout>
        Grafik memperlihatkan jumlah laki-laki dan perempuan pada setiap
        kategori pendidikan berdasarkan data Excel yang diunggah.
      </Callout>
    </div>
  )
}