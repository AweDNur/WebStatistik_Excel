export default function Hero({ total = 0 }) {
  return (
    <header className="mb-[-36px] bg-[#4F46E5] px-6 pb-[60px] pt-[52px] text-[#F4F0E6]">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-[#FAC206]">
            KELURAHAN NGINDEN JANGKUNGAN · KEC. SUKOLILO · KOTA SURABAYA
          </p>

          <h1 className="mb-2 max-w-sm text-3xl font-bold sm:text-[42px]">
            Potret Demografi Warga
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-[#E5E7EB]">
            Data DKB Semester I Tahun 2026, Dispendukcapil Kota Surabaya —
            pendidikan, status perkawinan, dan struktur usia penduduk.
          </p>
        </div>

        <div className="sm:text-right">
          <div className="text-5xl font-extrabold leading-none text-[#F4F0E6] sm:text-[64px]">
            {total.toLocaleString('id-ID')}
          </div>

          <div className="mt-1 text-[13px] text-[#FDE68A]">
            total penduduk tercatat
          </div>
        </div>
      </div>
    </header>
  )
}
