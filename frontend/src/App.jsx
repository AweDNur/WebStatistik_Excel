import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import StatistikPage from './pages/StatistikPage'
import InovasiPage from './pages/InovasiPage'

export default function App() {
  return (
    <BrowserRouter>
      {/* 
        This is a temporary navigation bar so you can click between the pages easily. 
        You can remove or style this later!
      */}
      <nav className="bg-[#132A2E] text-white p-4 flex gap-6 justify-center">
        <Link to="/statistik" className="hover:text-yellow-400">Beranda Statistik</Link>
        <Link to="/inovasi" className="hover:text-yellow-400">Katalog Inovasi</Link>
      </nav>

      {/* This is where the magic happens: mapping URLs to your Pages */}
      <Routes>
        <Route path="/statistik" element={<StatistikPage />} />
        <Route path="/inovasi" element={<InovasiPage />} />
      </Routes>
    </BrowserRouter>
  )
}