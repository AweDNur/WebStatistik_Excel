import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import {
  ChevronDown,
  Moon,
  Music2,
} from 'lucide-react'
import StatistikPage from './pages/StatistikPage'
import BeritaPage from './pages/BeritaPage'
import BeritaAdminPage from './pages/BeritaAdminPage'
import logoSurabaya from './assets/logo_surabaya.png'
import UmkmPage from './pages/UmkmPage'

const menuItems = [
  { label: 'Beranda', to: '/statistik' },
  { label: 'Profil', dropdown: true },
  { label: 'Bidang', dropdown: true },
  { label: 'Inovasi & Prestasi', to: '/inovasi', dropdown: true },
  { label: 'Kemitraan', dropdown: true },
  { label: 'Kelurahan Cantik', dropdown: true },
  { label: 'Kontak', dropdown: true },
  { label: 'Berita', to: '/berita' },
]

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 h-20 bg-[#4F46E5] text-white shadow-md">
      <div className="mx-auto flex h-full max-w-[1380px] items-center gap-6 px-5 lg:px-8">
        <Link to="/statistik" className="shrink-0" aria-label="Beranda">
          <img
            src={logoSurabaya}
            alt="Logo Surabaya"
            className="h-14 w-14 object-contain"
          />
        </Link>

        <div className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto whitespace-nowrap text-[16px]">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.to || '#'}
              className="flex shrink-0 items-center gap-1 transition-colors hover:text-[#FACC15]"
            >
              {item.label}
              {item.dropdown && <ChevronDown size={14} strokeWidth={2.5} />}
            </Link>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-4 md:flex">
          <a href="#" aria-label="Facebook" className="text-lg font-bold leading-none hover:text-[#FACC15]">f</a>
          <a href="#" aria-label="Instagram" className="text-lg font-bold leading-none hover:text-[#FACC15]">◎</a>
          <a href="#" aria-label="TikTok" className="hover:text-[#FACC15]"><Music2 size={19} /></a>
          <a href="#" aria-label="Twitter" className="text-lg font-bold leading-none hover:text-[#FACC15]">♥</a>
          <span className="mx-1 h-6 w-px bg-white/25" />
          <button type="button" aria-label="Mode gelap" className="flex items-center gap-1 hover:text-[#FACC15]">
            <Moon size={18} fill="currentColor" />
            <ChevronDown size={13} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </nav>
  )
}


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      {/* This is where the magic happens: mapping URLs to your Pages */}
      <Routes>
        <Route path="/statistik" element={<StatistikPage />} />
        <Route path="/berita" element={<BeritaPage />} />
        <Route path="/berita-admin" element={<BeritaAdminPage />} />
        <Route path="/inovasi" element={<UmkmPage />} />
      </Routes>
    </BrowserRouter>
  )
}
