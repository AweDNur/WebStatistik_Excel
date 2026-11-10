import Legend from './Legend'
import Callout from './Callout'

const fmt = (n) => Number(n).toLocaleString('id-ID')

export default function EducationChart({ data = [], isLight = false }) {
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
    <div
      className={`rounded-xl border p-5 transition-all sm:p-6 ${
        isLight
          ? 'border-slate-300 bg-white text-slate-900 ring-1 ring-indigo-950/5 shadow-[0_8px_24px_-6px_rgba(30,27,75,0.12)]'
          : 'border-[#495057] bg-[#343A40] text-white'
      }`}
    >
      <Legend isLight={isLight} />

      <div className="space-y-4">
        {rows.map((row) => (
          <div
            key={row.kategori}
            className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[175px_minmax(0,1fr)]"
          >
            <div
              className={`text-right text-xs font-medium leading-snug sm:text-sm ${
                isLight ? 'text-slate-700' : 'text-[#DEE2E6]'
              }`}
            >
              {row.kategori}
            </div>

            <div className="space-y-1.5">
              <div className="h-3.5">
                <div
                  className="h-3.5 rounded-sm bg-[#4379F2]"
                  style={{
                    width: `${(Number(row.laki_laki) / max) * 100}%`,
                    minWidth: row.laki_laki ? 2 : 0,
                  }}
                  title={`Laki-laki: ${fmt(row.laki_laki)}`}
                />
              </div>

              <div className="h-3.5">
                <div
                  className="h-3.5 rounded-sm bg-[#E65C00]"
                  style={{
                    width: `${(Number(row.perempuan) / max) * 100}%`,
                    minWidth: row.perempuan ? 2 : 0,
                  }}
                  title={`Perempuan: ${fmt(row.perempuan)}`}
                />
              </div>

              <p
                className={`text-xs ${
                  isLight ? 'text-slate-500' : 'text-[#CED4DA]'
                }`}
              >
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
