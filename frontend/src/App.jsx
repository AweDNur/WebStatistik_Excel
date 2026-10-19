import { useCallback, useEffect, useState } from 'react'

import Hero from './components/Hero'
import Section from './components/Section'
import KpiCards from './components/KpiCards'
import PopulationPyramid from './components/PopulationPyramid'
import MaritalBarChart from './components/MaritalBarChart'
import DonutChart from './components/DonutChart'
import EducationChart from './components/EducationChart'
import InsightSection from './components/InsightSection'
import SummaryTables from './components/SummaryTables'
import ExcelUpload from './components/ExcelUpload'

const API_URL = 'http://localhost:3000/api/excel/data'

export default function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    try {
      setError('')

      const response = await fetch(API_URL)
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal mengambil data.')
      }

      setData(result.data)
    } catch (err) {
      setError(err.message || 'Backend tidak dapat dihubungi.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F0E6] text-[#132A2E]">
        Memuat data demografi...
      </div>
    )
  }

  return (
    <>
      <Hero total={data?.Ringkasan?.[0]?.jumlah ?? 0} />

      <main className="mx-auto max-w-[1180px] px-4 pb-16 sm:px-6">
        <ExcelUpload onSuccess={loadData} />

        {error ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
            <button
              onClick={loadData}
              className="ml-3 font-semibold underline"
            >
              Coba lagi
            </button>
          </div>
        ) : !data || Object.values(data).every((rows) => rows.length === 0) ? (
          <div className="mb-6 rounded-lg border border-[#E1DACB] bg-white p-4 text-sm">
            Belum ada data. Silakan upload file Excel terlebih dahulu.
          </div>
        ) : (
          <>
            <KpiCards data={data} />

            <Section
              title="Struktur Usia Penduduk"
              description="Piramida penduduk per kelompok usia dan jenis kelamin"
            >
              <PopulationPyramid data={data['Kelompok Usia'] ?? []} />
            </Section>

            <Section
              title="Status Perkawinan"
              description="Distribusi status perkawinan, total dan per jenis kelamin"
            >
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <MaritalBarChart data={data['Status Kawin'] ?? []} />
                <DonutChart data={data['Status Kawin'] ?? []} />
              </div>
            </Section>

            <Section
              title="Tingkat Pendidikan"
              description="Jenjang pendidikan tertinggi yang ditamatkan, per jenis kelamin"
            >
              <EducationChart data={data.Pendidikan ?? []} />
            </Section>

            <Section
              title="Usia Berapa yang Kawin? Pendidikan Apa yang Kawin?"
              description="Batasan data agregat"
            >
              <InsightSection />
            </Section>

            <Section
              title="Ringkasan Angka"
              description="Tabel berdasarkan data Excel"
            >
              <SummaryTables data={data} />
            </Section>
          </>
        )}

        <footer className="border-t border-[#E1DACB] pt-5 text-center text-[11px] text-[#6E6857]">
          Sumber data: Data DKB Semester I Tahun 2026, Dispendukcapil Kota
          Surabaya — Kelurahan Nginden Jangkungan, Kec. Sukolilo.
        </footer>
      </main>
    </>
  )
}