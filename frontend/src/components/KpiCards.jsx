const fmt = (n) => n.toLocaleString('id-ID')

const validRows = (rows = []) =>
  rows.filter(
    (row) => !row.kategori.trim().toUpperCase().startsWith('JUMLAH TOTAL'),
  )

export default function KpiCards({ data }) {
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
          className="rounded-[10px] border border-[#495057] bg-[#343A40] p-5 text-white"
        >
          <div className="text-2xl font-extrabold text-white">
            {item.value}
          </div>

          <div className="mt-1 text-[12px] text-[#ADB5BD]">
            {item.label}
          </div>

          <span className="mt-2 inline-block rounded-full bg-[#F4E3DA] px-2 py-0.5 text-[11px] font-bold text-[#E65C00]">
            {item.tag}
          </span>
        </div>
      ))}
    </div>
  )
}
