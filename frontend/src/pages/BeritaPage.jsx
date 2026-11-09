import { useEffect, useState } from 'react'
import Footer from '../components/Footer'

const STORAGE_KEY = 'desa-cantik-berita'
const dummyNews = [
  ['Kegiatan Warga Kelurahan Nginden Jangkungan', 'Informasi kegiatan dan kabar terbaru dari lingkungan kelurahan.'],
  ['Pengumuman Pelayanan Kelurahan', 'Simak informasi pelayanan publik dan pengumuman penting lainnya.'],
  ['Kolaborasi untuk Warga yang Lebih Baik', 'Berita kolaborasi dan program yang bermanfaat bagi masyarakat.'],
]

export default function BeritaPage() {
  const [publishedNews, setPublishedNews] = useState([])

  useEffect(() => {
    setPublishedNews(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow bg-[#1f2328] font-sans">
        <section className="bg-indigo-600 px-6 py-16 text-center text-white">
          <h3 className="mb-2 text-lg font-bold text-yellow-400">
            Berita Terkini
          </h3>
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">
            Kelurahan Nginden Jangkungan Surabaya
          </h1>
          <p className="mx-auto max-w-3xl text-sm leading-relaxed opacity-90 md:text-base">
            Ikuti kabar terkini seputar Kelurahan Nginden Jangkungan Surabaya.
            Dapatkan update berita, kegiatan warga, pengumuman penting, dan
            peristiwa menarik lainnya yang informatif, aktual, dan mudah
            diakses.
          </p>
        </section>

        <section className="px-6 py-16 text-white">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2 className="mb-3 text-2xl font-bold md:text-3xl">Berita Kelurahan</h2>
              <p className="text-sm leading-relaxed text-gray-400 md:text-base">
                Temukan berita, kegiatan, dan informasi terbaru untuk warga.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[...publishedNews, ...dummyNews.map(([title, excerpt], index) => ({
                id: `dummy-${index}`,
                title,
                excerpt,
                date: `${9 - index} November 2026`,
              }))].map((item) => (
                <article key={item.id} className="flex min-h-[270px] flex-col overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-800 shadow-xl">
                  {item.cover ? <img src={item.cover} alt="" className="h-44 w-full object-cover" /> : <div className="flex h-44 items-center justify-center bg-[#2d333b] text-5xl text-gray-500">📰</div>}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="mb-2 text-xs text-gray-400">{item.date}</p>
                    <h3 className="mb-2 text-lg font-semibold text-gray-100">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-400">{item.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
