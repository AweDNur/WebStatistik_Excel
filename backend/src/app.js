
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const pool = require('./config/database')
const excelRoutes = require('./routes/excelRoutes')

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
}))

app.use(express.json())

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')

    res.json({
      success: true,
      message: 'Backend dan MySQL terhubung',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Koneksi MySQL gagal',
    })
  }
})

app.use('/api/excel', excelRoutes)

app.use((error, req, res, next) => {
  res.status(400).json({
    success: false,
    message: error.message || 'Terjadi kesalahan',
  })
})

module.exports = app
