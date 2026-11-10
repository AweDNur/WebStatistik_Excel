import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import {
  ChevronDown,
  Moon,
  Sun,
  Music2,
} from 'lucide-react'
import BerandaPage from './pages/BerandaPage'
import StatistikPage from './pages/StatistikPage'
import BeritaPage from './pages/BeritaPage'
import BeritaAdminPage from './pages/BeritaAdminPage'
import logoSurabaya from './assets/logo_surabaya.png'
import UmkmPage from './pages/UmkmPage'

const THEME_STORAGE_KEY = 'beranda-theme-mode'

const menuItems = [
  { label: 'Beranda', to: '/' },
  { label: 'Profil', dropdown: true },
  { label: 'Bidang', dropdown: true },
  { label: 'Statistik Demografi', to: '/statistik' },
  { label: 'Inovasi & Prestasi', to: '/inovasi', dropdown: true },
  { label: 'Kemitraan', dropdown: true },
  { label: 'Kelurahan Cantik', to: '/statistik', dropdown: true },
  { label: 'Kontak', dropdown: true },
  { label: 'Berita', to: '/berita' },
]

function Navbar({ isLight, onToggleTheme }) {
  const location = useLocation()
  const isBeranda = location.pathname === '/' || location.pathname === '/beranda'

  return (
    <nav className="sticky top-0 z-50 h-20 bg-[#4F46E5] text-white shadow-md">
      <div className="mx-auto flex h-full max-w-[1380px] items-center gap-6 px-5 lg:px-8">
        <Link to="/" className="shrink-0" aria-label="Beranda">
          <img
            src={logoSurabaya}
            alt="Logo Surabaya"
            className="h-14 w-14 object-contain"
          />
        </Link>

        <div className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto whitespace-nowrap text-[15px] font-medium">
          {menuItems.map((item) => {
            const isActive =
              item.to &&
              (item.to === '/'
                ? isBeranda
                : location.pathname.startsWith(item.to))

            return (
              <Link
                key={item.label}
                to={item.to || '#'}
                className={`flex shrink-0 items-center gap-1 transition-colors hover:text-[#FACC15] ${
                  isActive ? 'font-bold text-[#FACC15]' : 'text-white'
                }`}
              >
                {item.label}
                {item.dropdown && <ChevronDown size={14} strokeWidth={2.5} />}
              </Link>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden items-center gap-4 md:flex">
            <a href="#" aria-label="Facebook" className="text-lg font-bold leading-none hover:text-[#FACC15]">f</a>
            <a href="#" aria-label="Instagram" className="text-lg font-bold leading-none hover:text-[#FACC15]">◎</a>
            <a href="#" aria-label="TikTok" className="hover:text-[#FACC15]"><Music2 size={19} /></a>
            <a href="#" aria-label="Twitter" className="text-lg font-bold leading-none hover:text-[#FACC15]">♥</a>
            {isBeranda && <span className="mx-1 h-6 w-px bg-white/25" />}
          </div>

          {isBeranda && (
            <button
              type="button"
              onClick={onToggleTheme}
              title={isLight ? 'Beralih ke Mode Gelap' : 'Beralih ke Mode Terang'}
              aria-label={isLight ? 'Beralih ke Mode Gelap' : 'Beralih ke Mode Terang'}
              className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:border-[#FACC15] hover:text-[#FACC15]"
            >
              {isLight ? (
                <>
                  <Sun size={16} className="text-[#FACC15]" />
                  <span className="hidden sm:inline">Terang</span>
                </>
              ) : (
                <>
                  <Moon size={16} fill="currentColor" />
                  <span className="hidden sm:inline">Gelap</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}


export default function App() {
  const [isBerandaLight, setIsBerandaLight] = useState(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) === 'light'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isBerandaLight ? 'light' : 'dark')
    } catch {
      // ignore storage errors
    }
  }, [isBerandaLight])

  const toggleBerandaTheme = () => {
    setIsBerandaLight((prev) => !prev)
  }

  return (
    <BrowserRouter>
      <Navbar isLight={isBerandaLight} onToggleTheme={toggleBerandaTheme} />

      {/* This is where the magic happens: mapping URLs to your Pages */}
      <Routes>
        <Route path="/" element={<BerandaPage isLight={isBerandaLight} />} />
        <Route path="/beranda" element={<BerandaPage isLight={isBerandaLight} />} />
        <Route path="/statistik" element={<StatistikPage />} />
        <Route path="/berita" element={<BeritaPage />} />
        <Route path="/berita-admin" element={<BeritaAdminPage />} />
        <Route path="/inovasi" element={<UmkmPage />} />
      </Routes>
    </BrowserRouter>
  )
}
