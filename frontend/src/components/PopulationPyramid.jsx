import Legend from './Legend'
import Callout from './Callout'

const fmt = (n) => Number(n).toLocaleString('id-ID')

export default function PopulationPyramid({ data = [], isLight = false }) {
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

      {rows.length === 0 ? (
        <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-[#ADB5BD]'}`}>
          Data kelompok usia belum tersedia.
        </p>
      ) : (
        <div className="space-y-1.5">
          {rows.map((row) => (
            <div
              key={row.kategori}
              className="grid grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] items-center gap-1.5 sm:gap-2.5"
            >
              <div className="flex h-7 justify-end">
                <div
                  title={`Laki-laki ${row.kategori}: ${fmt(row.laki_laki)}`}
                  className="flex h-full items-center justify-start overflow-hidden rounded-l-sm bg-[#4379F2] pl-1.5 text-[11px] font-semibold text-white sm:pl-2 sm:text-xs"
                  style={{
                    width: `${(Number(row.laki_laki) / max) * 100}%`,
                    minWidth: 2,
                  }}
                >
                  {Number(row.laki_laki) / max > 0.10 && fmt(row.laki_laki)}
                </div>
              </div>

              <div
                className={`text-center text-xs font-medium sm:text-[13px] ${
                  isLight ? 'text-slate-700' : 'text-[#DEE2E6]'
                }`}
              >
                {row.kategori}
              </div>

              <div className="flex h-7 justify-start">
                <div
                  title={`Perempuan ${row.kategori}: ${fmt(row.perempuan)}`}
                  className="flex h-full items-center justify-end overflow-hidden rounded-r-sm bg-[#E65C00] pr-1.5 text-[11px] font-semibold text-white sm:pr-2 sm:text-xs"
                  style={{
                    width: `${(Number(row.perempuan) / max) * 100}%`,
                    minWidth: 2,
                  }}
                >
                  {Number(row.perempuan) / max > 0.10 && fmt(row.perempuan)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Callout>
        Grafik menunjukkan jumlah penduduk pada setiap kelompok usia menurut
        jenis kelamin berdasarkan data Excel yang diunggah.
      </Callout>
    </div>
  )
}
