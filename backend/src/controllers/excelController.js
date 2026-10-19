const excelService = require('../services/excelService')

exports.importExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File Excel belum dipilih',
      })
    }

    const result = await excelService.importExcel(req.file.buffer)

    res.json({
      success: true,
      message: 'Data Excel berhasil diimpor ke MySQL',
      ...result,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Gagal mengimpor Excel',
    })
  }
}

exports.previewExcel = (req, res) => {
  const XLSX = require('xlsx')

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File Excel belum dipilih',
      })
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })

    res.json({
      success: true,
      fileName: req.file.originalname,
      sheets: workbook.SheetNames,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal membaca file Excel',
    })
  }
}

exports.getDemografi = async (req, res) => {
  try {
    const rows = await excelService.getDemografi()

    const data = {
      Ringkasan: [],
      Pendidikan: [],
      'Status Kawin': [],
      'Kelompok Usia': [],
    }

    for (const row of rows) {
      if (data[row.sheet_name]) {
        data[row.sheet_name].push(row)
      }
    }

    res.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Gagal mengambil data demografi:', error)

    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data demografi dari database.',
    })
  }
}