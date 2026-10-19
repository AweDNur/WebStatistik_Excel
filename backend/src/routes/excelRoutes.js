
const express = require('express')
const multer = require('multer')
const excelController = require('../controllers/excelController')

const router = express.Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/\.(xlsx|xls)$/i.test(file.originalname)) {
      return cb(null, true)
    }

    cb(new Error('File harus berformat .xlsx atau .xls'))
  },
})

router.post(
  '/preview',
  upload.single('file'),
  excelController.previewExcel
)

router.post(
  '/import',
  upload.single('file'),
  excelController.importExcel
)

router.get('/data', excelController.getDemografi)

module.exports = router