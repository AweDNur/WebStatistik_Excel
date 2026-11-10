const fmt = (n) => n.toLocaleString('id-ID')

const validRows = (rows = []) =>
  rows.filter(
    (row) => !row.kategori.trim().toUpperCase().startsWith('JUMLAH TOTAL'),
  )

export default function KpiCards({ data, isLight = false }) {
  const summary = data?.Ringkasan?.[0] ?? {}
  const ageRows = validRows(data?.['Kelompok Usia'])
  const maritalRows = validRows(data?.['Status Kawin'])
  const educationRows = validRows(data?.Pendidikan)

  const male = Number(summary.laki_laki ?? 0)
  const female = Number(summary.perempuan ?? 0)
  const total = Number(summary.jumlah ?? male + female)

  const productive = ageRows.reduce((sum, row) => {
    const match = row.kategori.match(/^\s*(\d+)/)
    const startAge = match ? Number(match[1]) : -1

    return startAge >= 15 && startAge < 65
      ? sum + Number(row.jumlah ?? 0)
      : sum
  }, 0)

  const married = maritalRows.find(
    (row) => row.kategori.trim().toLowerCase() === 'kawin',
  )

  const highSchool = educationRows.find((row) =>
    row.kategori.toLowerCase().includes('slta'),
  )

  const items = [
    {
      value: `${total ? (male / total * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 }) : '0'}% / ${total ? (female / total * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 }) : '0'}%`,
      label: 'Laki-laki / Perempuan',
      tag: `${fmt(male)} vs ${fmt(female)}`,
    },
    {
      value: `${total ? (productive / total * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 }) : '0'}%`,
      label: 'Penduduk usia produktif (15–64 th)',
      tag: `${fmt(productive)} jiwa`,
    },
    {
      value: `${total ? (Number(married?.jumlah ?? 0) / total * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 }) : '0'}%`,
      label: 'Berstatus Kawin',
      tag: `${fmt(Number(married?.jumlah ?? 0))} jiwa`,
    },
    {
      value: `${total ? (Number(highSchool?.jumlah ?? 0) / total * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 }) : '0'}%`,
      label: 'Pendidikan SLTA/Sederajat',
      tag: `${fmt(Number(highSchool?.jumlah ?? 0))} jiwa`,
    },
  ]

  return (
    <div className="mb-9 mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-xl border p-5 transition-all sm:p-6 ${
            isLight
              ? 'border-slate-300 bg-white text-slate-900 ring-1 ring-indigo-950/5 shadow-[0_8px_24px_-6px_rgba(30,27,75,0.12)]'
              : 'border-[#495057] bg-[#343A40] text-white'
          }`}
        >
          <div
            className={`text-2xl font-extrabold sm:text-3xl ${
              isLight ? 'text-indigo-950' : 'text-white'
            }`}
          >
            {item.value}
          </div>

          <div
            className={`mt-1.5 text-sm font-medium ${
              isLight ? 'text-slate-600' : 'text-[#DEE2E6]'
            }`}
          >
            {item.label}
          </div>

          <span className="mt-3 inline-block rounded-full bg-[#F4E3DA] px-3 py-1 text-xs font-bold text-[#E65C00]">
            {item.tag}
          </span>
        </div>
      ))}
    </div>
  )
}
