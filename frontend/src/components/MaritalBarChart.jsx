import Legend from './Legend'

const fmt = (n) => Number(n).toLocaleString('id-ID')

export default function MaritalBarChart({ data = [] }) {
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
    <div className="rounded-xl border border-[#495057] bg-[#343A40] p-5 text-white sm:p-6">
      <h3 className="mb-1 text-sm font-semibold">Perbandingan antar status</h3>

      <p className="mb-3 text-xs text-[#ADB5BD]">
        Jumlah jiwa per kategori, dipilah laki-laki dan perempuan
      </p>

      <Legend />

      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.kategori}>
            <div className="mb-1 flex justify-between gap-2 text-xs">
              <span>{row.kategori}</span>
              <span className="font-semibold">{fmt(row.jumlah)}</span>
            </div>

            <div className="flex h-5 overflow-hidden rounded">
              <div
                className="flex items-center justify-center bg-[#4379F2] text-[10px] text-white"
                style={{ width: `${(Number(row.laki_laki) / max) * 100}%` }}
                title={`Laki-laki: ${fmt(row.laki_laki)}`}
              >
                {Number(row.laki_laki) / max > 0.005 && fmt(row.laki_laki)}
              </div>

              <div
                className="flex items-center justify-center bg-[#E65C00] text-[10px] text-white"
                style={{ width: `${(Number(row.perempuan) / max) * 100}%` }}
                title={`Perempuan: ${fmt(row.perempuan)}`}
              >
                {Number(row.perempuan) / max > 0.005 && fmt(row.perempuan)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
