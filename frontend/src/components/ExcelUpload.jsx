import { useState } from 'react'

export default function ExcelUpload({ onSuccess }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  async function handleUpload(e) {
    e.preventDefault()

    if (!file) {
      setIsError(true)
      setMessage('Pilih file Excel terlebih dahulu.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    setMessage('')
    setIsError(false)

    try {
      const response = await fetch(
        'http://localhost:3000/api/excel/import',
        {
          method: 'POST',
          body: formData,
        },
      )

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Upload gagal.')
      }

      setIsError(false)
      setMessage(
        `Berhasil mengimpor ${result.totalRecords} baris data.`,
      )

      setFile(null)
      e.target.reset()

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      setIsError(true)
      setMessage(error.message || 'Gagal mengunggah Excel.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleUpload}
      className="mb-8 rounded-xl border border-[#E1DACB] bg-white p-5 sm:p-6"
    >
      <h2 className="mb-2 text-lg font-bold text-[#0E3B38]">
        Upload Data Excel
      </h2>

      <p className="mb-4 text-sm text-[#6E6857]">
        Pilih file Excel (.xlsx atau .xls) untuk memperbarui data demografi.
      </p>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 block w-full rounded-lg border border-[#E1DACB] p-2 text-sm"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-[#245B50] px-5 py-2.5 font-medium text-white hover:bg-[#19483F] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Mengunggah...' : 'Upload Excel'}
      </button>

      {message && (
        <p
          className={`mt-3 text-sm ${
            isError ? 'text-red-600' : 'text-[#1F5C57]'
          }`}
          role="status"
        >
          {message}
        </p>
      )}
    </form>
  )
}