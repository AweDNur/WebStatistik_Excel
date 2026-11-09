import { useState } from 'react';
import { catalogItems } from '../data/portalData';

const KatalogUmkm = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setActiveImage(item.image); 
    window.scrollTo(0, 0); 
  };

  // ==========================================
  // VIEW 1: DETAIL PAGE (Dark Theme)
  // ==========================================
  if (selectedItem) {
    return (
      <div className="w-full min-h-screen bg-[#1f2328] text-gray-100 font-sans py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Breadcrumb / Back Button */}
          <button 
            onClick={() => setSelectedItem(null)}
            className="flex items-center text-indigo-400 hover:text-indigo-300 font-semibold mb-8 transition-colors"
          >
            ← Kembali ke Katalog
          </button>

          <div className="flex flex-col md:flex-row gap-10">
            
            {/* Left Side: Images */}
            <div className="w-full md:w-5/12 flex flex-col gap-4">
              {/* Main Active Image */}
              <div className="w-full aspect-square bg-[#2d333b] rounded-xl overflow-hidden border border-gray-700/50 shadow-sm">
                <img 
                  src={activeImage} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail List */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {selectedItem.images.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === img ? 'border-indigo-500 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side: Title and Description */}
            <div className="w-full md:w-7/12 flex flex-col pt-2">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                {selectedItem.title}
              </h1>
              
              <div className="w-full h-px bg-gray-700 mb-6"></div> {/* Divider line */}
              
              <div className="max-w-none">
                <h3 className="text-lg font-semibold text-gray-200 mb-2">Detail UMKM</h3>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                  {selectedItem.description}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: CATALOG GRID (Default View)
  // ==========================================
  return (
    <div className="w-full flex flex-col font-sans">
      {/* Header Section */}
      <section className="bg-indigo-600 text-white py-16 px-6 text-center">
        <h3 className="text-yellow-400 font-bold text-lg mb-2">UMKM</h3>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Kelurahan Nginden Jangkungan Surabaya</h1>
        <p className="max-w-3xl mx-auto text-sm md:text-base opacity-90 leading-relaxed">
          Temukan informasi lengkap mengenai UMKM di Kelurahan Nginden Jangkungan Surabaya! 
          Jelajahi berbagai usaha lokal, produk unggulan, dan potensi ekonomi masyarakat yang 
          tersedia secara jelas dan mudah diakses.
        </p>
      </section>

      {/* Catalog Grid Section */}
      <section className="bg-[#1f2328] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Katalog UMKM</h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Jelajahi Katalog UMKM Kelurahan kami! Temukan berbagai usaha masyarakat, mulai dari kuliner, toko, hingga produk kreatif lokal. 
            Dukung perkembangan UMKM dan kenali produk unggulan warga Kelurahan Nginden Jangkungan.
          </p>
        </div>

        {/* Cards */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {catalogItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleCardClick(item)}
              className="group flex flex-col bg-[#2d333b] rounded-2xl overflow-hidden shadow-lg border border-gray-700/50 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-indigo-500"
            >
              {/* Image Container with Zoom effect on hover */}
              <div className="w-full h-56 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              
              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h4 className="text-base font-bold uppercase tracking-wide text-gray-100 mb-3 group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default KatalogUmkm;