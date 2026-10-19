import Legend from './Legend'
import Callout from './Callout'

const fmt = (n) => Number(n).toLocaleString('id-ID')

export default function PopulationPyramid({ data = [] }) {
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

      {rows.length === 0 ? (
        <p className="text-sm text-[#6E6857]">Data kelompok usia belum tersedia.</p>
      ) : (
        <div className="space-y-1">
          {rows.map((row) => (
            <div
              key={row.kategori}
              className="grid grid-cols-[minmax(0,1fr)_48px_minmax(0,1fr)] items-center gap-1 sm:gap-2"
            >
              <div className="flex h-6 justify-end">
                <div
                  title={`Laki-laki ${row.kategori}: ${fmt(row.laki_laki)}`}
                  className="flex h-full items-center justify-start overflow-hidden rounded-l-sm bg-[#1F5C57] pl-1 text-[9px] font-semibold text-white sm:pl-2 sm:text-[10px]"
                  style={{
                    width: `${(Number(row.laki_laki) / max) * 100}%`,
                    minWidth: 2,
                  }}
                >
                  {Number(row.laki_laki) / max > 0.10 && fmt(row.laki_laki)}
                </div>
              </div>

              <div className="text-center text-[10px] text-[#6E6857] sm:text-[11px]">
                {row.kategori}
              </div>

              <div className="flex h-6 justify-start">
                <div
                  title={`Perempuan ${row.kategori}: ${fmt(row.perempuan)}`}
                  className="flex h-full items-center justify-end overflow-hidden rounded-r-sm bg-[#C4633B] pr-1 text-[9px] font-semibold text-white sm:pr-2 sm:text-[10px]"
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