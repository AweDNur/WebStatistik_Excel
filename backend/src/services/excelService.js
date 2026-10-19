
const XLSX = require('xlsx')
const pool = require('../config/database')

const SHEETS = [
  { name: 'Ringkasan', start: 5, end: 8 },
  { name: 'Pendidikan', start: 5, end: 16 },
  { name: 'Status Kawin', start: 5, end: 10 },
  { name: 'Kelompok Usia', start: 5, end: 22 },
]

function parseNumber(value) {
  if (typeof value === 'number') {
    return Math.round(value)
  }

  if (value === null || value === undefined || value === '') {
    return 0
  }

  const parsed = Number(String(value).replace(/[.\s,]/g, ''))
  if (!Number.isFinite(parsed)) {
    throw new Error(`Nilai angka tidak valid: ${value}`)
  }

  return parsed
}

function readSheet(workbook, config) {
  const worksheet = workbook.Sheets[config.name]

  if (!worksheet) {
    throw new Error(`Sheet "${config.name}" tidak ditemukan`)
  }

  const rows = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    range: `A${config.start}:D${config.end}`,
    defval: null,
    raw: true,
  })

  // Baris pertama adalah header kolom.
  return rows.slice(1).map((row, index) => {
    const kategori = String(row[0] ?? '').trim()

    if (!kategori) {
      throw new Error(
        `Kategori kosong pada sheet "${config.name}", baris ${config.start + index + 1}`
      )
    }

    return {
      sheet_name: config.name,
      kategori,
      laki_laki: parseNumber(row[1]),
      perempuan: parseNumber(row[2]),
      jumlah: parseNumber(row[3]),
      urutan: index + 1,
    }
  })
}

async function importExcel(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' })

  const records = SHEETS.flatMap(config =>
    readSheet(workbook, config)
  )

  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    await connection.query('DELETE FROM demografi_data')

    const sql = `
      INSERT INTO demografi_data
      (sheet_name, kategori, laki_laki, perempuan, jumlah, urutan)
      VALUES ?
    `

    const values = records.map(row => [
      row.sheet_name,
      row.kategori,
      row.laki_laki,
      row.perempuan,
      row.jumlah,
      row.urutan,
    ])

    await connection.query(sql, [values])
    await connection.commit()

    return {
      totalRecords: records.length,
      sheets: SHEETS.map(sheet => sheet.name),
    }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

async function getDemografi() {
  const [rows] = await pool.query(`
    SELECT sheet_name, kategori, laki_laki, perempuan, jumlah, urutan
    FROM demografi_data
    ORDER BY FIELD(
      sheet_name,
      'Ringkasan',
      'Pendidikan',
      'Status Kawin',
      'Kelompok Usia'
    ), urutan ASC
  `)

  return rows
}

module.exports = {
  importExcel,
  getDemografi,
}
