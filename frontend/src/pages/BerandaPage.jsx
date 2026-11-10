import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  BarChart3,
  Store,
  // Newspaper,
  Users,
  MapPin,
  FileSpreadsheet,
} from 'lucide-react'
import KpiCards from '../components/KpiCards'
import PopulationPyramid from '../components/PopulationPyramid'
import EducationChart from '../components/EducationChart'
import DonutChart from '../components/DonutChart'
import Footer from '../components/Footer'
import { catalogItems, getCombinedNews } from '../data/portalData'
import logoSurabaya from '../assets/logo_surabaya.png'
import logoBps from '../assets/logo_bps.png'
import logoTelkom from '../assets/logo_telu_sby.png'

const API_URL = 'http://localhost:3000/api/excel/data'
const MAX_PREVIEW_ITEMS = 8

const EDUCATION_PIE_COLORS = [
  '#3B82F6',
  '#F97316',
  '#10B981',
  '#A855F7',
  '#FACC15',
  '#EF4444',
  '#06B6D4',
  '#EC4899',
  '#84CC16',
  '#F43F5E',
]

const FALLBACK_DEMOGRAFI = {
  Ringkasan: [
    { kategori: 'Penduduk', laki_laki: 9842, perempuan: 10126, jumlah: 19968 },
  ],
  'Kelompok Usia': [
    { kategori: '0-4', laki_laki: 620, perempuan: 590, jumlah: 1210 },
    { kategori: '5-9', laki_laki: 710, perempuan: 685, jumlah: 1395 },
    { kategori: '10-14', laki_laki: 780, perempuan: 745, jumlah: 1525 },
    { kategori: '15-19', laki_laki: 830, perempuan: 810, jumlah: 1640 },
    { kategori: '20-24', laki_laki: 890, perempuan: 875, jumlah: 1765 },
    { kategori: '25-29', laki_laki: 860, perempuan: 895, jumlah: 1755 },
    { kategori: '30-34', laki_laki: 820, perempuan: 850, jumlah: 1670 },
    { kategori: '35-39', laki_laki: 790, perempuan: 815, jumlah: 1605 },
    { kategori: '40-44', laki_laki: 750, perempuan: 780, jumlah: 1530 },
    { kategori: '45-49', laki_laki: 690, perempuan: 720, jumlah: 1410 },
    { kategori: '50-54', laki_laki: 610, perempuan: 650, jumlah: 1260 },
    { kategori: '55-59', laki_laki: 520, perempuan: 560, jumlah: 1080 },
    { kategori: '60-64', laki_laki: 430, perempuan: 475, jumlah: 905 },
    { kategori: '65-69', laki_laki: 290, perempuan: 340, jumlah: 630 },
    { kategori: '70-74', laki_laki: 160, perempuan: 205, jumlah: 365 },
    { kategori: '75+', laki_laki: 92, perempuan: 131, jumlah: 223 },
  ],
  'Status Kawin': [
    { kategori: 'Belum Kawin', laki_laki: 4520, perempuan: 4180, jumlah: 8700 },
    { kategori: 'Kawin', laki_laki: 4890, perempuan: 4960, jumlah: 9850 },
    { kategori: 'Cerai Hidup', laki_laki: 182, perempuan: 316, jumlah: 498 },
    { kategori: 'Cerai Mati', laki_laki: 250, perempuan: 670, jumlah: 920 },
  ],
  Pendidikan: [
    { kategori: 'Tidak/Belum Sekolah', laki_laki: 1120, perempuan: 1080, jumlah: 2200 },
    { kategori: 'Belum Tamat SD/Sederajat', laki_laki: 640, perempuan: 620, jumlah: 1260 },
    { kategori: 'Tamat SD/Sederajat', laki_laki: 980, perempuan: 1150, jumlah: 2130 },
    { kategori: 'SLTP/Sederajat', laki_laki: 1340, perempuan: 1420, jumlah: 2760 },
    { kategori: 'SLTA/Sederajat', laki_laki: 3820, perempuan: 3790, jumlah: 7610 },
    { kategori: 'Diploma I/II', laki_laki: 120, perempuan: 150, jumlah: 270 },
    { kategori: 'Akademi/Diploma III', laki_laki: 380, perempuan: 460, jumlah: 840 },
    { kategori: 'Diploma IV/Strata I', laki_laki: 1290, perempuan: 1320, jumlah: 2610 },
    { kategori: 'Strata II', laki_laki: 132, perempuan: 120, jumlah: 252 },
    { kategori: 'Strata III', laki_laki: 20, perempuan: 16, jumlah: 36 },
  ],
}

function getRollingWindow(items, startIndex, maxCount = 4) {
  if (!items || items.length === 0) return []
  const count = Math.min(maxCount, items.length)
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(items[(startIndex + i) % items.length])
  }
  return result
}

export default function BerandaPage({ isLight = false }) {
  const [demografi, setDemografi] = useState(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  const [umkmIndex, setUmkmIndex] = useState(0)
  const [newsIndex, setNewsIndex] = useState(0)
  const [newsItems] = useState(() => getCombinedNews())

  useEffect(() => {
    let ignore = false

    async function fetchDemografi() {
      try {
        const response = await fetch(API_URL)
        const result = await response.json()

        if (ignore) return

        if (
          response.ok &&
          result.success &&
          result.data &&
          Object.values(result.data).some((rows) => rows.length > 0)
        ) {
          setDemografi(result.data)
          setUsingFallback(false)
        } else {
          setDemografi(FALLBACK_DEMOGRAFI)
          setUsingFallback(true)
        }
      } catch {
        if (!ignore) {
          setDemografi(FALLBACK_DEMOGRAFI)
          setUsingFallback(true)
        }
      } finally {
        if (!ignore) {
          setLoadingStats(false)
        }
      }
    }

    fetchDemografi()
    return () => {
      ignore = true
    }
  }, [])

  const totalPenduduk = demografi?.Ringkasan?.[0]?.jumlah ?? 0
  const latestNews = newsItems.slice(0, MAX_PREVIEW_ITEMS)

  const handlePrevUmkm = () => {
    if (!catalogItems.length) return
    setUmkmIndex((prev) => (prev - 1 + catalogItems.length) % catalogItems.length)
  }
  const handleNextUmkm = () => {
    if (!catalogItems.length) return
    setUmkmIndex((prev) => (prev + 1) % catalogItems.length)
  }

  const handlePrevNews = () => {
    if (!latestNews.length) return
    setNewsIndex((prev) => (prev - 1 + latestNews.length) % latestNews.length)
  }
  const handleNextNews = () => {
    if (!latestNews.length) return
    setNewsIndex((prev) => (prev + 1) % latestNews.length)
  }

  const visibleUmkm = getRollingWindow(catalogItems, umkmIndex, 4)
  const visibleNews = getRollingWindow(latestNews, newsIndex, 4)

  return (
    <div
      className={`flex min-h-screen flex-col font-sans transition-colors duration-300 ${
        isLight ? 'bg-[#EEF2F6] text-slate-900' : 'bg-[#1f2328] text-white'
      }`}
    >
      <section className="relative overflow-hidden bg-gradient-to-br from-[#312E81] via-[#3730A3] to-[#1E1B4B] px-6 pb-28 pt-16 lg:pb-32 lg:pt-20">
        {/* Decorative Background Accents */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* Left Column: Welcome & Quick Actions */}
            <div className="lg:col-span-7">
              <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-[54px]">
                Kelurahan Nginden{' '}
                <span className="text-[#FACC15]">Jangkungan</span>
              </h1>

              <p className="mb-8 max-w-2xl text-base leading-relaxed text-indigo-100 sm:text-lg">
                Selamat datang di website Kelurahan Nginden Jangkungan Surabaya!
                Temukan data statistik lengkap, direktori UMKM warga, dan
                berbagai informasi kegiatan kelurahan yang siap memenuhi
                kebutuhan informasi Anda secara mudah, transparan, dan
                terpercaya.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/statistik"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#FACC15] px-6 py-3.5 text-sm font-bold text-indigo-950 shadow-lg shadow-yellow-500/20 transition-all hover:-translate-y-0.5 hover:bg-yellow-300"
                >
                  Eksplorasi Data Statistik
                </Link>
                <Link
                  to="/inovasi"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  Katalog UMKM Warga
                </Link>
                <Link
                  to="/berita"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  Berita Terkini
                </Link>
              </div>
            </div>

            {/* Right Column: YouTube Video Preview */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-3xl border-[3px] border-white/80 bg-[#1f2328] shadow-2xl">
                <div className="aspect-video w-full">
                  <iframe
                    className="h-full w-full"
                    src="https://www.youtube.com/embed/Ip23IR36M7o?si=4lmLkMhAc2JeCbYB"
                    title="Profil Kelurahan Nginden Jangkungan Surabaya"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-20 mx-auto -mt-16 w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 gap-4 rounded-2xl border p-5 backdrop-blur-md transition-all sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:p-6 ${
            isLight
              ? 'border-slate-300 bg-white/95 text-slate-900 ring-1 ring-indigo-950/10 shadow-[0_14px_34px_-8px_rgba(30,27,75,0.18)]'
              : 'border-gray-700/80 bg-[#282d34]/95 text-white shadow-2xl'
          }`}
        >
          {/* Kolom 1: Identitas & Sinergi */}
          <div
            className={`flex items-center gap-3.5 border-b pb-4 sm:border-b-0 sm:pb-0 lg:border-r lg:pr-4 ${
              isLight ? 'border-slate-300' : 'border-gray-700/70'
            }`}
          >
            <img
              src={logoSurabaya}
              alt="Logo Surabaya"
              className="h-12 w-12 shrink-0 object-contain"
            />
            <div>
              <p
                className={`text-xs font-bold uppercase tracking-wider ${
                  isLight ? 'text-indigo-600' : 'text-[#FACC15]'
                }`}
              >
                Ringkasan Wilayah
              </p>
              <h2
                className={`text-lg font-bold leading-snug ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Kel. Nginden Jangkungan
              </h2>
              <div className="mt-1.5 flex items-center gap-2">
                <img
                  src={logoBps}
                  alt="Logo BPS"
                  className="h-5 w-auto object-contain"
                />
                <img
                  src={logoTelkom}
                  alt="Logo Telkom University"
                  className="h-5 w-auto rounded bg-white px-1 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Kolom 2: Total Penduduk */}
          <div
            className={`flex items-center gap-3.5 border-b pb-4 sm:border-b-0 sm:pb-0 lg:border-r lg:pr-4 ${
              isLight ? 'border-slate-300' : 'border-gray-700/70'
            }`}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                isLight
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                  : 'border-indigo-500/30 bg-indigo-600/20 text-[#FACC15]'
              }`}
            >
              <Users size={22} />
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  isLight ? 'text-slate-600' : 'text-gray-300'
                }`}
              >
                Total Penduduk
              </p>
              <div
                className={`text-2xl font-extrabold sm:text-3xl ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {totalPenduduk.toLocaleString('id-ID')}{' '}
                <span
                  className={`text-sm font-normal ${
                    isLight ? 'text-slate-500' : 'text-gray-300'
                  }`}
                >
                  Jiwa
                </span>
              </div>
              <p
                className={`text-xs font-medium ${
                  isLight ? 'text-indigo-600' : 'text-[#FDE68A]'
                }`}
              >
                DKB Semester I Tahun 2026
              </p>
            </div>
          </div>

          {/* Kolom 3: UMKM Terdaftar */}
          <div
            className={`flex items-center gap-3.5 border-b pb-4 sm:border-b-0 sm:pb-0 lg:border-r lg:pr-4 ${
              isLight ? 'border-slate-300' : 'border-gray-700/70'
            }`}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                isLight
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                  : 'border-indigo-500/30 bg-indigo-600/20 text-[#FACC15]'
              }`}
            >
              <Store size={22} />
            </div>
            <div>
              <p
                className={`text-sm font-medium ${
                  isLight ? 'text-slate-600' : 'text-gray-300'
                }`}
              >
                UMKM & Potensi Lokal
              </p>
              <div
                className={`text-2xl font-extrabold sm:text-3xl ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {catalogItems.length}+{' '}
                <span
                  className={`text-sm font-normal ${
                    isLight ? 'text-slate-500' : 'text-gray-300'
                  }`}
                >
                  Usaha
                </span>
              </div>
              <p
                className={`text-xs font-medium ${
                  isLight ? 'text-indigo-600' : 'text-[#FDE68A]'
                }`}
              >
                Kuliner, Jasa & Produk Kreatif
              </p>
            </div>
          </div>

          {/* Kolom 4: Lokasi Kantor */}
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                isLight
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                  : 'border-indigo-500/30 bg-indigo-600/20 text-[#FACC15]'
              }`}
            >
              <MapPin size={22} />
            </div>
            <div
              className={`text-sm leading-relaxed ${
                isLight ? 'text-slate-600' : 'text-gray-300'
              }`}
            >
              <strong
                className={`block font-semibold mb-0.5 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Kantor Kelurahan
              </strong>
              Jl. Nginden Permata No. 1, Kec. Sukolilo, Surabaya · (031) 5940555
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
        <div
          className={`mb-8 flex flex-wrap items-end justify-between gap-4 border-b pb-5 ${
            isLight ? 'border-slate-300' : 'border-gray-700/70'
          }`}
        >
          <div>
            <div
              className={`mb-1.5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${
                isLight ? 'text-indigo-600' : 'text-indigo-400'
              }`}
            >
              <BarChart3 size={16} />
              Statistik Kelurahan
            </div>
            <h2
              className={`text-2xl font-bold sm:text-3xl ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Potret Statistik Demografi Warga
            </h2>
            <p
              className={`mt-1.5 text-base ${
                isLight ? 'text-slate-600' : 'text-gray-300'
              }`}
            >
              Ringkasan persentase demografi, struktur kelompok usia, dan
              tingkat pendidikan warga Kelurahan Nginden Jangkungan.
            </p>
          </div>

          <Link
            to="/statistik"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-500 sm:text-base"
          >
            Lihat Statistik Lengkap
            <ArrowRight size={17} />
          </Link>
        </div>

        {usingFallback && (
          <div
            className={`mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-sm ${
              isLight
                ? 'border-indigo-200 bg-indigo-50 text-indigo-900'
                : 'border-indigo-500/30 bg-indigo-950/40 text-indigo-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileSpreadsheet
                size={18}
                className={`shrink-0 ${
                  isLight ? 'text-indigo-600' : 'text-[#FACC15]'
                }`}
              />
              <span>
                Menampilkan data pratinjau demografi. Anda dapat memperbarui
                data melalui unggah file Excel di halaman{' '}
                <strong className={isLight ? 'text-indigo-950' : 'text-white'}>
                  Statistik Demografi
                </strong>
                .
              </span>
            </div>
            <Link
              to="/statistik"
              className={`font-semibold underline ${
                isLight
                  ? 'text-indigo-700 hover:text-indigo-900'
                  : 'text-[#FACC15] hover:text-yellow-300'
              }`}
            >
              Kelola Data Excel →
            </Link>
          </div>
        )}

        {loadingStats ? (
          <div
            className={`rounded-2xl border p-12 text-center text-base ${
              isLight
                ? 'border-slate-200 bg-white text-slate-600'
                : 'border-[#495057] bg-[#343A40] text-gray-300'
            }`}
          >
            Memuat ringkasan data demografi...
          </div>
        ) : (
          <div className="space-y-10">
            {/* A. Data Persentase (KPI Cards) */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3
                  className={`text-lg font-bold sm:text-xl ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Indikator & Persentase Demografi Utama
                </h3>
                <span
                  className={`text-sm font-medium ${
                    isLight ? 'text-slate-600' : 'text-gray-300'
                  }`}
                >
                  Total: {totalPenduduk.toLocaleString('id-ID')} Jiwa
                </span>
              </div>
              <KpiCards data={demografi} isLight={isLight} />
            </div>

            {/* B. Struktur Usia Penduduk (Di Atas) */}
            <div>
              <div className="mb-3">
                <h3
                  className={`text-lg font-bold sm:text-xl ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Struktur Usia Penduduk
                </h3>
                <p
                  className={`mt-0.5 text-sm ${
                    isLight ? 'text-slate-600' : 'text-[#CED4DA]'
                  }`}
                >
                  Piramida penduduk per kelompok usia dan jenis kelamin
                </p>
              </div>
              <PopulationPyramid
                data={demografi?.['Kelompok Usia'] ?? []}
                isLight={isLight}
              />
            </div>

            {/* C. Tingkat Pendidikan (Di Bawah, dengan Diagram Circle / Donut di Sampingnya) */}
            <div>
              <div className="mb-3">
                <h3
                  className={`text-lg font-bold sm:text-xl ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  Tingkat Pendidikan
                </h3>
                <p
                  className={`mt-0.5 text-sm ${
                    isLight ? 'text-slate-600' : 'text-[#CED4DA]'
                  }`}
                >
                  Jenjang pendidikan tertinggi yang ditamatkan, total dan per jenis kelamin
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <EducationChart
                  data={demografi?.Pendidikan ?? []}
                  isLight={isLight}
                />
                <DonutChart
                  data={demografi?.Pendidikan ?? []}
                  title="Komposisi total"
                  subtitle="Proporsi berdasarkan data tingkat pendidikan"
                  calloutText="Diagram memperlihatkan proporsi setiap kategori tingkat pendidikan berdasarkan data Excel yang diunggah."
                  palette={EDUCATION_PIE_COLORS}
                  isLight={isLight}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      <section
        className={`border-y py-16 px-4 transition-all sm:px-6 lg:px-8 ${
          isLight
            ? 'border-indigo-200/80 bg-[#E0E7FF]/70 shadow-[inset_0_6px_16px_-6px_rgba(30,27,75,0.08),inset_0_-6px_16px_-6px_rgba(30,27,75,0.08)]'
            : 'border-gray-800 bg-[#252a30]'
        }`}
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div
                className={`mb-1.5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${
                  isLight ? 'text-indigo-600' : 'text-[#FACC15]'
                }`}
              >
                Ekonomi & Produk Lokal
              </div>
              <h2
                className={`text-2xl font-bold sm:text-3xl ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Katalog UMKM Kelurahan
              </h2>
              <p
                className={`mt-1.5 text-base ${
                  isLight ? 'text-slate-600' : 'text-gray-300'
                }`}
              >
                Dukung usaha mikro dan produk kreatif unggulan warga Kelurahan
                Nginden Jangkungan.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Left / Right Arrow Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevUmkm}
                  aria-label="Geser UMKM ke kiri"
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all active:scale-95 ${
                    isLight
                      ? 'border-slate-300 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white shadow-sm'
                      : 'border-gray-600 bg-[#1f2328] text-white hover:border-indigo-500 hover:bg-indigo-600'
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={handleNextUmkm}
                  aria-label="Geser UMKM ke kanan"
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all active:scale-95 ${
                    isLight
                      ? 'border-slate-300 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white shadow-sm'
                      : 'border-gray-600 bg-[#1f2328] text-white hover:border-indigo-500 hover:bg-indigo-600'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <Link
                to="/inovasi"
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all sm:text-base ${
                  isLight
                    ? 'border-slate-300 bg-white text-slate-800 hover:border-indigo-500 hover:text-indigo-600 shadow-sm'
                    : 'border-gray-600 bg-[#1f2328] text-white hover:border-indigo-400 hover:text-indigo-300'
                }`}
              >
                Semua UMKM
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Carousel Container with Left/Right Side Arrows on Desktop */}
          <div className="relative">
            <button
              type="button"
              onClick={handlePrevUmkm}
              aria-label="Sebelumnya"
              className={`hidden xl:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border shadow-xl backdrop-blur transition-all ${
                isLight
                  ? 'border-slate-300 bg-white/95 text-slate-700 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white'
                  : 'border-gray-600 bg-[#1f2328]/90 text-white hover:bg-indigo-600 hover:border-indigo-500'
              }`}
            >
              <ChevronLeft size={22} />
            </button>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {visibleUmkm.map((item, idx) => (
                <Link
                  to="/inovasi"
                  key={`${item.id}-${idx}`}
                  className={`group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500 hover:shadow-2xl ${
                    isLight
                      ? 'border-slate-300 bg-white ring-1 ring-indigo-950/5 shadow-[0_10px_28px_-6px_rgba(30,27,75,0.14)]'
                      : 'border-gray-700/60 bg-[#1f2328] shadow-lg'
                  }`}
                >
                  <div className="relative h-48 w-full overflow-hidden bg-[#2d333b]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {item.category && (
                      <span className="absolute left-3 top-3 rounded-full bg-indigo-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                        {item.category}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3
                      className={`mb-2 text-lg font-bold uppercase tracking-wide transition-colors group-hover:text-indigo-600 ${
                        isLight ? 'text-slate-900' : 'text-white group-hover:text-indigo-400'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`mb-4 flex-1 text-sm leading-relaxed line-clamp-3 ${
                        isLight ? 'text-slate-600' : 'text-gray-300'
                      }`}
                    >
                      {item.description}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-semibold ${
                        isLight
                          ? 'text-indigo-600 group-hover:text-indigo-800'
                          : 'text-indigo-400 group-hover:text-indigo-300'
                      }`}
                    >
                      Lihat Detail Produk <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={handleNextUmkm}
              aria-label="Selanjutnya"
              className={`hidden xl:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border shadow-xl backdrop-blur transition-all ${
                isLight
                  ? 'border-slate-300 bg-white/95 text-slate-700 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white'
                  : 'border-gray-600 bg-[#1f2328]/90 text-white hover:bg-indigo-600 hover:border-indigo-500'
              }`}
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Rolling Indicator Dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {catalogItems.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setUmkmIndex(idx)}
                aria-label={`Pilih slide UMKM ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  umkmIndex === idx
                    ? isLight
                      ? 'w-8 bg-indigo-600'
                      : 'w-8 bg-[#FACC15]'
                    : isLight
                      ? 'w-2.5 bg-slate-300 hover:bg-slate-400'
                      : 'w-2.5 bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div
              className={`mb-1.5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${
                isLight ? 'text-indigo-600' : 'text-indigo-400'
              }`}
            >
              Kabar & Informasi Warga
            </div>
            <h2
              className={`text-2xl font-bold sm:text-3xl ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Berita & Kegiatan Kelurahan
            </h2>
            <p
              className={`mt-1.5 text-base ${
                isLight ? 'text-slate-600' : 'text-gray-300'
              }`}
            >
              Ikuti kabar terbaru, pengumuman pelayanan publik, dan agenda warga
              Kelurahan Nginden Jangkungan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Left / Right Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevNews}
                aria-label="Geser Berita ke kiri"
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all active:scale-95 ${
                  isLight
                    ? 'border-slate-300 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white shadow-sm'
                    : 'border-gray-600 bg-[#2d333b] text-white hover:border-indigo-500 hover:bg-indigo-600'
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={handleNextNews}
                aria-label="Geser Berita ke kanan"
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all active:scale-95 ${
                  isLight
                    ? 'border-slate-300 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-600 hover:text-white shadow-sm'
                    : 'border-gray-600 bg-[#2d333b] text-white hover:border-indigo-500 hover:bg-indigo-600'
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <Link
              to="/berita"
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all sm:text-base ${
                isLight
                  ? 'border-slate-300 bg-white text-slate-800 hover:border-indigo-500 hover:text-indigo-600 shadow-sm'
                  : 'border-gray-600 bg-[#2d333b] text-white hover:border-indigo-400 hover:text-indigo-300'
              }`}
            >
              Semua Berita
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Carousel Container with Left/Right Side Arrows on Desktop */}
        <div className="relative">
          <button
            type="button"
            onClick={handlePrevNews}
            aria-label="Berita Sebelumnya"
            className={`hidden xl:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border shadow-xl backdrop-blur transition-all ${
              isLight
                ? 'border-slate-300 bg-white/95 text-slate-700 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white'
                : 'border-gray-600 bg-[#2d333b]/90 text-white hover:bg-indigo-600 hover:border-indigo-500'
            }`}
          >
            <ChevronLeft size={22} />
          </button>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleNews.map((item, idx) => (
              <Link
                to="/berita"
                key={`${item.id}-${idx}`}
                className={`group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500 hover:shadow-2xl ${
                  isLight
                    ? 'border-slate-300 bg-white ring-1 ring-indigo-950/5 shadow-[0_10px_28px_-6px_rgba(30,27,75,0.14)]'
                    : 'border-gray-700/60 bg-gray-800/90 shadow-lg'
                }`}
              >
                {item.cover ? (
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {item.category && (
                      <span className="absolute left-3 top-3 rounded-full bg-indigo-600/90 px-3 py-1 text-xs font-semibold text-white">
                        {item.category}
                      </span>
                    )}
                  </div>
                ) : (
                  <div
                    className={`relative flex h-44 w-full items-center justify-center text-5xl ${
                      isLight
                        ? 'bg-gradient-to-br from-indigo-50 to-slate-100'
                        : 'bg-gradient-to-br from-[#2d333b] to-[#1f2328]'
                    }`}
                  >
                    <span>📰</span>
                    {item.category && (
                      <span className="absolute left-3 top-3 rounded-full bg-indigo-600/90 px-3 py-1 text-xs font-semibold text-white">
                        {item.category}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  <p
                    className={`mb-2 text-xs font-semibold ${
                      isLight ? 'text-indigo-600' : 'text-indigo-400'
                    }`}
                  >
                    {item.date}
                  </p>
                  <h3
                    className={`mb-2 text-lg font-bold line-clamp-2 transition-colors ${
                      isLight
                        ? 'text-slate-900 group-hover:text-indigo-600'
                        : 'text-gray-100 group-hover:text-[#FACC15]'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`mb-4 flex-1 text-sm leading-relaxed line-clamp-3 ${
                      isLight ? 'text-slate-600' : 'text-gray-300'
                    }`}
                  >
                    {item.excerpt}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 text-sm font-semibold ${
                      isLight
                        ? 'text-indigo-600 group-hover:text-indigo-800'
                        : 'text-indigo-400 group-hover:text-indigo-300'
                    }`}
                  >
                    Baca Selengkapnya <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNextNews}
            aria-label="Berita Selanjutnya"
            className={`hidden xl:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border shadow-xl backdrop-blur transition-all ${
              isLight
                ? 'border-slate-300 bg-white/95 text-slate-700 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white'
                : 'border-gray-600 bg-[#2d333b]/90 text-white hover:bg-indigo-600 hover:border-indigo-500'
            }`}
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Rolling Indicator Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {latestNews.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setNewsIndex(idx)}
              aria-label={`Pilih slide berita ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                newsIndex === idx
                  ? 'w-8 bg-indigo-600'
                  : isLight
                    ? 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    : 'w-2.5 bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
