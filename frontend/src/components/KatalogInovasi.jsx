import React from 'react';

const KatalogInovasi = () => {
  // Replace these with your actual image paths from src/assets or public folder
  const catalogItems = [
    { id: 1, title: 'POSTING (POSYANDU STUNTING)', image: '/placeholder-stunting.jpg' },
    { id: 2, title: 'KAMPUNG HERBAL KEL. NGINDEN JANGKUNGAN', image: '/placeholder-herbal.jpg' },
  ];

  return (
    <div className="w-full flex flex-col font-sans">
      {/* Header Section */}
      <section className="bg-indigo-600 text-white py-16 px-6 text-center">
        <h3 className="text-yellow-400 font-bold text-lg mb-2">Inovasi</h3>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Kelurahan Nginden Jangkungan Surabaya</h1>
        <p className="max-w-3xl mx-auto text-sm md:text-base opacity-90 leading-relaxed">
          Temukan data inovasi lengkap Kelurahan Nginden Jangkungan Surabaya! Katalog inovasi dan lain-lain, 
          semua informasi disajikan secara jelas dan mudah diakses.
        </p>
      </section>

      {/* Catalog Grid Section */}
      <section className="bg-[#1f2328] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Katalog Inovasi</h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Jelajahi Katalog Inovasi Kelurahan kami! Temukan berbagai inisiatif kreatif dan solusi cerdas yang kami 
            terapkan untuk meningkatkan layanan, memperbaiki infrastruktur, dan memberdayakan masyarakat
          </p>
        </div>

        {/* Cards */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {catalogItems.map((item) => (
            <div key={item.id} className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-700/50 flex flex-col">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-56 object-cover" 
              />
              <div className="p-4 text-center bg-[#2d333b]">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default KatalogInovasi;