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
import Footer from '../components/Footer'
import { catalogItems, getCombinedNews } from '../data/portalData'
import logoSurabaya from '../assets/logo_surabaya.png'
import logoBps from '../assets/logo_bps.png'
import logoTelkom from '../assets/logo_telu_sby.png'

const API_URL = 'http://localhost:3000/api/excel/data'

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

export default function BerandaPage() {
  const [demografi, setDemografi] = useState(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  // Rolling carousel state (max 4 visible cards)
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

  // Rolling navigation handlers for UMKM
  const handlePrevUmkm = () => {
    setUmkmIndex((prev) => (prev - 1 + catalogItems.length) % catalogItems.length)
  }
  const handleNextUmkm = () => {
    setUmkmIndex((prev) => (prev + 1) % catalogItems.length)
  }

  // Rolling navigation handlers for Berita
  const handlePrevNews = () => {
    if (!newsItems.length) return
    setNewsIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length)
  }
  const handleNextNews = () => {
    if (!newsItems.length) return
    setNewsIndex((prev) => (prev + 1) % newsItems.length)
  }

  const visibleUmkm = getRollingWindow(catalogItems, umkmIndex, 4)
  const visibleNews = getRollingWindow(newsItems, newsIndex, 4)

  return (
    <div className="flex min-h-screen flex-col bg-[#1f2328] text-white font-sans">
      {/* ==========================================
          1. HERO SECTION (Gaya Portal Kelurahan Surabaya + Video YouTube)
      ========================================== */}
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
                  className="inline-flex items-center gap-2 rounded-full bg-[#FACC15] px-6 py-3.5 text-sm font-bold text-indigo-950 shadow-lg shadow-yellow-500/20 transition-all hover:-translate-y-0.5 hover:bg-yellow-300"
                >
                  {/* <BarChart3 size={18} /> */}
                  Eksplorasi Data Statistik
                </Link>
                <Link
                  to="/inovasi"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  {/* <Store size={18} /> */}
                  Katalog UMKM Warga
                </Link>
                <Link
                  to="/berita"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  {/* <Newspaper size={18} /> */}
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

      {/* ==========================================
          1B. FLOATING SUMMARY BAR (Ringkasan Wilayah)
      ========================================== */}
      <div className="relative z-20 mx-auto -mt-16 w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-700/80 bg-[#282d34]/95 p-5 shadow-2xl backdrop-blur-md sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:p-6">
          {/* Kolom 1: Identitas & Sinergi */}
          <div className="flex items-center gap-3.5 border-b border-gray-700/70 pb-4 sm:border-b-0 sm:pb-0 lg:border-r lg:pr-4">
            <img
              src={logoSurabaya}
              alt="Logo Surabaya"
              className="h-12 w-12 shrink-0 object-contain"
            />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#FACC15]">
                Ringkasan Wilayah
              </p>
              <h2 className="text-base font-bold text-white leading-snug">
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
          <div className="flex items-center gap-3.5 border-b border-gray-700/70 pb-4 sm:border-b-0 sm:pb-0 lg:border-r lg:pr-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 text-[#FACC15] border border-indigo-500/30">
              <Users size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Penduduk</p>
              <div className="text-2xl font-extrabold text-white">
                {totalPenduduk.toLocaleString('id-ID')}{' '}
                <span className="text-xs font-normal text-gray-400">Jiwa</span>
              </div>
              <p className="text-[11px] text-[#FDE68A]">
                DKB Semester I Tahun 2026
              </p>
            </div>
          </div>

          {/* Kolom 3: UMKM Terdaftar */}
          <div className="flex items-center gap-3.5 border-b border-gray-700/70 pb-4 sm:border-b-0 sm:pb-0 lg:border-r lg:pr-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 text-[#FACC15] border border-indigo-500/30">
              <Store size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-400">UMKM & Potensi Lokal</p>
              <div className="text-2xl font-extrabold text-white">
                {catalogItems.length}+{' '}
                <span className="text-xs font-normal text-gray-400">Usaha</span>
              </div>
              <p className="text-[11px] text-[#FDE68A]">
                Kuliner, Jasa & Produk Kreatif
              </p>
            </div>
          </div>

          {/* Kolom 4: Lokasi Kantor */}
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 text-[#FACC15] border border-indigo-500/30">
              <MapPin size={22} />
            </div>
            <div className="text-xs leading-relaxed text-gray-300">
              <strong className="block text-white font-semibold mb-0.5">
                Kantor Kelurahan
              </strong>
              Jl. Nginden Permata No. 1, Kec. Sukolilo, Surabaya · (031) 5940555
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          2. CUPLIKAN STATISTIK DEMOGRAFI
          (Persentase KPI, Struktur Usia, Tingkat Pendidikan)
      ========================================== */}
      <section className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-gray-700/70 pb-5">
          <div>
            <div className="mb-1.5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <BarChart3 size={15} />
              Statistik Kelurahan
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Potret Statistik Demografi Warga
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Ringkasan persentase demografi, struktur kelompok usia, dan
              tingkat pendidikan warga Kelurahan Nginden Jangkungan.
            </p>
          </div>

          <Link
            to="/statistik"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-500"
          >
            Lihat Statistik Lengkap
            <ArrowRight size={16} />
          </Link>
        </div>

        {usingFallback && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-4 py-3 text-xs text-indigo-200">
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-[#FACC15] shrink-0" />
              <span>
                Menampilkan data pratinjau demografi. Anda dapat memperbarui
                data melalui unggah file Excel di halaman{' '}
                <strong className="text-white">Statistik Demografi</strong>.
              </span>
            </div>
            <Link
              to="/statistik"
              className="font-semibold text-[#FACC15] underline hover:text-yellow-300"
            >
              Kelola Data Excel →
            </Link>
          </div>
        )}

        {loadingStats ? (
          <div className="rounded-2xl border border-[#495057] bg-[#343A40] p-12 text-center text-gray-300">
            Memuat ringkasan data demografi...
          </div>
        ) : (
          <div className="space-y-8">
            {/* A. Data Persentase (KPI Cards) */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-200">
                  1. Indikator & Persentase Demografi Utama
                </h3>
                <span className="text-xs text-gray-400">
                  Total: {totalPenduduk.toLocaleString('id-ID')} Jiwa
                </span>
              </div>
              <KpiCards data={demografi} />
            </div>

            {/* B & C. Struktur Usia Penduduk & Tingkat Pendidikan */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="flex flex-col">
                <div className="mb-3">
                  <h3 className="text-base font-semibold text-white">
                    2. Struktur Usia Penduduk
                  </h3>
                  <p className="text-xs text-[#ADB5BD]">
                    Piramida penduduk per kelompok usia dan jenis kelamin
                  </p>
                </div>
                <div className="flex-1">
                  <PopulationPyramid data={demografi?.['Kelompok Usia'] ?? []} />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="mb-3">
                  <h3 className="text-base font-semibold text-white">
                    3. Tingkat Pendidikan
                  </h3>
                  <p className="text-xs text-[#ADB5BD]">
                    Jenjang pendidikan tertinggi yang ditamatkan per jenis kelamin
                  </p>
                </div>
                <div className="flex-1">
                  <EducationChart data={demografi?.Pendidikan ?? []} />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ==========================================
          3. SHOW CARD KATALOG UMKM (Rolling Maksimal 4 Card)
      ========================================== */}
      <section className="border-t border-gray-800 bg-[#252a30] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-1.5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FACC15]">
                {/* <Store size={15} /> */}
                Ekonomi & Produk Lokal
              </div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Katalog UMKM Kelurahan
              </h2>
              <p className="mt-1 text-sm text-gray-400">
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-600 bg-[#1f2328] text-white transition-all hover:border-indigo-500 hover:bg-indigo-600 active:scale-95"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={handleNextUmkm}
                  aria-label="Geser UMKM ke kanan"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-600 bg-[#1f2328] text-white transition-all hover:border-indigo-500 hover:bg-indigo-600 active:scale-95"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <Link
                to="/inovasi"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-600 bg-[#1f2328] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:border-indigo-400 hover:text-indigo-300"
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
              className="hidden xl:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border border-gray-600 bg-[#1f2328]/90 text-white shadow-xl backdrop-blur transition-all hover:bg-indigo-600 hover:border-indigo-500"
            >
              <ChevronLeft size={22} />
            </button>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {visibleUmkm.map((item, idx) => (
                <Link
                  to="/inovasi"
                  key={`${item.id}-${idx}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-700/60 bg-[#1f2328] shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500 hover:shadow-2xl"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-[#2d333b]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {item.category && (
                      <span className="absolute left-3 top-3 rounded-full bg-indigo-600/90 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                        {item.category}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 text-base font-bold uppercase tracking-wide text-white transition-colors group-hover:text-indigo-400">
                      {item.title}
                    </h3>
                    <p className="mb-4 flex-1 text-xs leading-relaxed text-gray-400 line-clamp-3">
                      {item.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                      Lihat Detail Produk <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={handleNextUmkm}
              aria-label="Selanjutnya"
              className="hidden xl:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border border-gray-600 bg-[#1f2328]/90 text-white shadow-xl backdrop-blur transition-all hover:bg-indigo-600 hover:border-indigo-500"
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
                className={`h-2 rounded-full transition-all ${
                  umkmIndex === idx
                    ? 'w-7 bg-[#FACC15]'
                    : 'w-2 bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. SHOW CARD BERITA TERKINI (Rolling Maksimal 4 Card)
      ========================================== */}
      <section className="mx-auto w-full max-w-[1280px] py-16 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-1.5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
              {/* <Newspaper size={15} /> */}
              Kabar & Informasi Warga
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Berita & Kegiatan Kelurahan
            </h2>
            <p className="mt-1 text-sm text-gray-400">
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
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-600 bg-[#2d333b] text-white transition-all hover:border-indigo-500 hover:bg-indigo-600 active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={handleNextNews}
                aria-label="Geser Berita ke kanan"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-600 bg-[#2d333b] text-white transition-all hover:border-indigo-500 hover:bg-indigo-600 active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <Link
              to="/berita"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-600 bg-[#2d333b] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:border-indigo-400 hover:text-indigo-300"
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
            className="hidden xl:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border border-gray-600 bg-[#2d333b]/90 text-white shadow-xl backdrop-blur transition-all hover:bg-indigo-600 hover:border-indigo-500"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleNews.map((item, idx) => (
              <Link
                to="/berita"
                key={`${item.id}-${idx}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-700/60 bg-gray-800/90 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500 hover:shadow-2xl"
              >
                {item.cover ? (
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {item.category && (
                      <span className="absolute left-3 top-3 rounded-full bg-indigo-600/90 px-3 py-1 text-[11px] font-semibold text-white">
                        {item.category}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="relative flex h-44 w-full items-center justify-center bg-gradient-to-br from-[#2d333b] to-[#1f2328] text-5xl">
                    <span>📰</span>
                    {item.category && (
                      <span className="absolute left-3 top-3 rounded-full bg-indigo-600/90 px-3 py-1 text-[11px] font-semibold text-white">
                        {item.category}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  <p className="mb-2 text-xs font-medium text-indigo-400">
                    {item.date}
                  </p>
                  <h3 className="mb-2 text-base font-bold text-gray-100 line-clamp-2 group-hover:text-[#FACC15] transition-colors">
                    {item.title}
                  </h3>
                  <p className="mb-4 flex-1 text-xs leading-relaxed text-gray-400 line-clamp-3">
                    {item.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                    Baca Selengkapnya <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNextNews}
            aria-label="Berita Selanjutnya"
            className="hidden xl:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full border border-gray-600 bg-[#2d333b]/90 text-white shadow-xl backdrop-blur transition-all hover:bg-indigo-600 hover:border-indigo-500"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Rolling Indicator Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {newsItems.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setNewsIndex(idx)}
              aria-label={`Pilih slide berita ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${
                newsIndex === idx
                  ? 'w-7 bg-indigo-500'
                  : 'w-2 bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ==========================================
          5. FOOTER KELURAHAN
      ========================================== */}
      <Footer />
    </div>
  )
}
