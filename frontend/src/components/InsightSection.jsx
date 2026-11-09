export default function InsightSection() {
  const indicators = [
    ['18,0%', 'Diploma–S3 (angka dari narasi sumber)'],
    ['31,5%', 'SLTA/Sederajat'],
    ['40,7%', 'SD ke bawah atau tidak/belum sekolah'],
  ]

  return (
    <div className="rounded-xl bg-[#1f2328] p-6 text-[#EFF6F3] sm:p-7">
      <h3 className="mb-2 text-base font-bold text-white">
        Data kelurahan ini secara struktural tidak mencatat itu
      </h3>

      <p className="mb-3 text-[13px] leading-relaxed text-[#E5E7EB]">
        Data agregat status kawin, kelompok usia, dan pendidikan disajikan
        terpisah. Tidak tersedia informasi silang yang menghubungkan usia,
        pendidikan, dan status perkawinan pada individu yang sama. Karena itu,
        dashboard ini tidak dapat menentukan usia atau pendidikan penduduk
        yang sudah kawin secara langsung.
      </p>

      <div className="rounded-r-lg border-l-[3px] border-[#E65C00] bg-[#FBF3EE] p-4 text-[13px] leading-relaxed text-[#5C4534]">
        Untuk menjawabnya, diperlukan tabel silang resmi usia × status kawin ×
        pendidikan dari Kelurahan/Dispendukcapil, atau data survei BPS yang
        sesuai. Data individual tidak boleh disimpulkan dari rekap terpisah.
      </div>

      <h3 className="mb-2 mt-6 text-base font-bold text-white">
        Indikator pendidikan penduduk
      </h3>

      <p className="text-[13px] leading-relaxed text-[#E5E7EB]">
        Komposisi pendidikan dapat menjadi gambaran umum modal manusia
        wilayah, tetapi bukan ukuran langsung pendapatan atau kondisi ekonomi
        setiap keluarga.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {indicators.map(([value, label]) => (
          <div key={value}>
            <div className="text-2xl font-extrabold text-[#4379F2]">
              {value}
            </div>

            <div className="text-xs leading-relaxed text-[#D1D5DB]">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
