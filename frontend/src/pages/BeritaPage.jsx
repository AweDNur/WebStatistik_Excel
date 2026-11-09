import React from 'react'
import Footer from '../components/Footer'

export default function BeritaPage() {
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

        <section className="flex min-h-[280px] items-center justify-center px-6 py-16 text-center text-white">
          <p className="text-base font-semibold italic text-gray-300">
            Belum ada berita yang dimuat
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
