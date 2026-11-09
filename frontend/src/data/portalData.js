import fotoumkm1 from '../assets/fotoumkm1.jpg'
import fotomadura1 from '../assets/fotomadura1.jpg'
import fotomadura2 from '../assets/fotomadura2.jpeg'

import fotohaircut1 from '../assets/fotohaircut1.png'
import fotohaircut2 from '../assets/fotohaircut2.jpg'
import fotohaircut3 from '../assets/fotohaircut3.jpg'

import fotoumkmaksesoris1 from '../assets/fotoumkmaksesoris1.jpg'
import fotoumkmaksesoris2 from '../assets/fotoumkmaksesoris2.jpg'
import fotoumkmaksesoris3 from '../assets/fotoumkmaksesoris3.jpg'
import fotoumkm3 from '../assets/fotoumkm3.jpg'

export const catalogItems = [
  {
    id: 1,
    title: 'Warung Madura',
    category: 'Sembako & Kebutuhan Harian',
    description:
      'Warung Madura menyediakan berbagai kebutuhan sehari-hari, mulai dari sembako, makanan ringan, minuman, hingga kebutuhan rumah tangga dengan harga terjangkau dan pelayanan ramah. Praktis, lengkap, dan siap melayani kebutuhan Anda setiap hari.',
    image: fotoumkm1,
    images: [fotoumkm1, fotomadura1, fotomadura2],
  },
  {
    id: 2,
    title: 'Barber',
    category: 'Jasa & Pangkas Rambut',
    description:
      'UMKM Barber menyediakan layanan pangkas rambut untuk pria dan anak-anak dengan berbagai pilihan model sesuai keinginan. Mengutamakan hasil rapi, pelayanan ramah, dan harga terjangkau.',
    image: fotohaircut1,
    images: [fotohaircut1, fotohaircut2, fotohaircut3],
  },
  {
    id: 3,
    title: 'Toko Aksesoris',
    category: 'Kerajinan & Aksesoris',
    description:
      'UMKM Aksesoris menyediakan berbagai pilihan aksesoris menarik, mulai dari gelang, kalung, cincin, hingga pernak-pernik unik dengan desain beragam dan harga terjangkau. Cocok untuk melengkapi penampilan maupun dijadikan hadiah.',
    image: fotoumkmaksesoris1,
    images: [fotoumkmaksesoris1, fotoumkmaksesoris2, fotoumkmaksesoris3],
  },
  {
    id: 4,
    title: 'Kuliner & Jajanan Nusantara',
    category: 'Kuliner Warga',
    description:
      'Aneka olahan makanan tradisional, kue basah, dan jajanan pasar khas karya warga Kelurahan Nginden Jangkungan. Dibuat dengan bahan segar pilihan dan cita rasa autentik yang cocok untuk acara keluarga maupun rapat.',
    image: fotoumkm3,
    images: [fotoumkm3, fotoumkm1],
  },
  {
    id: 5,
    title: 'Kriya & Produk Kreatif',
    category: 'Produk Unggulan',
    description:
      'Kumpulan karya kerajinan tangan dan suvenir hasil kreasi warga setempat. Menghadirkan produk bernilai seni tinggi dan ramah lingkungan sebagai buah tangan khas Kelurahan Nginden Jangkungan.',
    image: fotoumkmaksesoris2,
    images: [fotoumkmaksesoris2, fotoumkmaksesoris3, fotoumkmaksesoris1],
  },
  {
    id: 6,
    title: 'Kedai Minuman Segar',
    category: 'Minuman & Kafe',
    description:
      'Menyajikan aneka minuman tradisional seperti sinom, beras kencur, hingga minuman kekinian yang menyegarkan dengan harga bersahabat untuk warga sekitar.',
    image: fotomadura1,
    images: [fotomadura1, fotomadura2],
  },
]

export const STORAGE_KEY = 'desa-cantik-berita'

export const dummyNews = [
  [
    'Kegiatan Warga Kelurahan Nginden Jangkungan',
    'Informasi kegiatan gotong royong, kerja bakti, dan kabar terbaru dari lingkungan warga kelurahan.',
    '9 November 2026',
    'Kegiatan Warga',
  ],
  [
    'Pengumuman Pelayanan Administrasi Kelurahan',
    'Simak informasi jadwal pelayanan publik, kependudukan, dan pengumuman penting lainnya bagi masyarakat.',
    '8 November 2026',
    'Pelayanan Publik',
  ],
  [
    'Kolaborasi Desa Cantik bersama BPS & Perguruan Tinggi',
    'Program pembinaan Kelurahan Cinta Statistik untuk meningkatkan literasi dan kualitas data kelurahan.',
    '7 November 2026',
    'Kelurahan Cantik',
  ],
  [
    'Pemberdayaan UMKM Lokal Nginden Jangkungan',
    'Pelatihan pemasaran digital dan pendampingan usaha mikro guna mendorong ekonomi kreatif warga.',
    '6 November 2026',
    'Ekonomi & UMKM',
  ],
  [
    'Posyandu & Layanan Kesehatan Masyarakat Rutin',
    'Pelaksanaan pemeriksaan kesehatan balita, lansia, serta penyuluhan gizi keluarga di balai RW.',
    '5 November 2026',
    'Kesehatan',
  ],
  [
    'Sosialisasi Ketertiban dan Keamanan Lingkungan',
    'Sinergi perangkat kelurahan bersama warga dalam menjaga kenyamanan dan ketertiban lingkungan.',
    '4 November 2026',
    'Lingkungan',
  ],
]

export function getCombinedNews() {
  let publishedNews
  try {
    publishedNews = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    publishedNews = []
  }

  const defaults = dummyNews.map(([title, excerpt, date, category], index) => ({
    id: `dummy-${index}`,
    title,
    excerpt,
    date,
    category,
  }))

  return [...publishedNews, ...defaults]
}
