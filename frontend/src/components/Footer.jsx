// Import the logos from your assets folder
import logoSurabaya from '../assets/logo_surabaya.png';
import logoBps from '../assets/logo_bps.png';
import logoTelkom from '../assets/logo_telu_sby.png';

const Footer = () => {
  return (
    <footer className="bg-indigo-600 text-white pt-16 pb-8 px-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-indigo-400 pb-12 mb-8">
        
        {/* Column 1: Branding & Description */}
        <div>
          <div className="flex space-x-4 mb-6 items-center">
            {/* The actual logos replacing the placeholder divs */}
            <img src={logoSurabaya} alt="Logo Pemkot Surabaya" className="h-12 w-auto object-contain" />
            <img src={logoBps} alt="Logo BPS" className="h-12 w-auto object-contain" />
            {/* Added a slight white background to Telkom logo just in case it has dark text that gets lost on the purple footer */}
            <img src={logoTelkom} alt="Logo Telkom University Surabaya" className="h-10 w-auto object-contain bg-white rounded px-1" />
          </div>
          <p className="text-sm mb-1">Program Kelurahan Cinta Statistik Surabaya</p>
          <h2 className="text-3xl font-bold mb-4">
            Kelurahan <span className="text-yellow-400">Nginden Jangkungan</span>
          </h2>
          <p className="text-sm opacity-90 leading-relaxed pr-4">
            Temukan data statistik dan berbagai konten bermanfaat lainnya yang siap memenuhi kebutuhan informasi Anda secara transparan, mudah dan terpercaya.
          </p>
        </div>

        {/* Column 2: Sinergi Program */}
        <div>
          <h3 className="text-xl font-semibold mb-6 border-b border-indigo-400 pb-2 inline-block">Sinergi Program</h3>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-yellow-400 transition-colors">Kementerian Desa PDTT</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition-colors">Pemprov Jatim</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition-colors">Pemkot Surabaya</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition-colors">BPS Kota Surabaya</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition-colors">Telkom University Surabaya</a></li>
          </ul>
        </div>

        {/* Column 3: Info Kontak */}
        <div>
          <h3 className="text-xl font-semibold mb-6 border-b border-indigo-400 pb-2 inline-block">Info Kontak</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start space-x-3">
              <span className="mt-0.5">📍</span>
              <span className="leading-relaxed">Jl. Nginden Permata No. 1 Surabaya, Surabaya, Jawa Timur, Indonesia.</span>
            </li>
            <li className="flex items-center space-x-3">
              <span>✉️</span>
              <span>jangkungannginden@gmail.com</span>
            </li>
            <li className="flex items-center space-x-3">
              <span>📞</span>
              <span>(031) 5940555</span>
            </li>
          </ul>
          
          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-8">
            <a href="#" className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-indigo-600 transition-colors">F</a>
            <a href="#" className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-indigo-600 transition-colors">IG</a>
            <a href="#" className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-indigo-600 transition-colors">TK</a>
            <a href="#" className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-indigo-600 transition-colors">TW</a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm opacity-90">
        <p>Copyright © 2026 Kelurahan Cantik Surabaya | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;