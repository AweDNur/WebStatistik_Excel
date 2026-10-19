import MiniTable from './MiniTable'

const fmt = (n) => Number(n).toLocaleString('id-ID')

const validRows = (rows = []) =>
  rows.filter(
    (row) => !row.kategori.trim().toUpperCase().startsWith('JUMLAH TOTAL'),
  )

function toRows(rows, total) {
  return rows.map((row) => [
    row.kategori,
    fmt(row.jumlah),
    `${total ? (Number(row.jumlah) / total * 100).toLocaleString('id-ID', { maximumFractionDigits: 1 }) : '0'}%`,
  ])
}

export default function SummaryTables({ data }) {
  const marital = validRows(data?.['Status Kawin'])
  const education = validRows(data?.Pendidikan)
  const ages = validRows(data?.['Kelompok Usia'])

  const maritalTotal = marital.reduce(
    (sum, row) => sum + Number(row.jumlah),
    0,
  )

  const educationTotal = education.reduce(
    (sum, row) => sum + Number(row.jumlah),
    0,
  )

  const ageTotal = ages.reduce(
    (sum, row) => sum + Number(row.jumlah),
    0,
  )

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <MiniTable
        title="Status Kawin"
        headers={['Kategori', 'L', 'P', 'Jml']}
        rows={[
          ...marital.map((row) => [
            row.kategori,
            fmt(row.laki_laki),
            fmt(row.perempuan),
            fmt(row.jumlah),
          ]),
          [
            'Total',
            fmt(marital.reduce((sum, row) => sum + Number(row.laki_laki), 0)),
            fmt(marital.reduce((sum, row) => sum + Number(row.perempuan), 0)),
            fmt(maritalTotal),
          ],
        ]}
      />

      <MiniTable
        title="Pendidikan"
        headers={['Jenjang', 'Jml', '%']}
        rows={toRows(education, educationTotal)}
      />

      <MiniTable
        title="Kelompok Usia"
        headers={['Kategori', 'Jml', '%']}
        rows={toRows(ages, ageTotal)}
      />
    </div>
  )
}