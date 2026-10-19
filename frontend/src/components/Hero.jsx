export default function Hero({ total = 0 }) {
  return (
    <header className="mb-[-36px] bg-gradient-to-br from-[#0E3B38] via-[#1F5C57] to-[#2B7368] px-6 pb-[60px] pt-[52px] text-[#F4F0E6]">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-end justify-between gap-6">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-[#C9E4DE]">
            KELURAHAN NGINDEN JANGKUNGAN · KEC. SUKOLILO · KOTA SURABAYA
          </p>

          <h1 className="mb-2 max-w-sm text-3xl font-bold sm:text-[42px]">
            Potret Demografi Warga
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-[#D7E9E4]">
            Data DKB Semester I Tahun 2026, Dispendukcapil Kota Surabaya —
            pendidikan, status perkawinan, dan struktur usia penduduk.
          </p>
        </div>

        <div className="sm:text-right">
          <div className="text-5xl font-extrabold leading-none text-white sm:text-[64px]">
            {total.toLocaleString('id-ID')}
          </div>

          <div className="mt-1 text-[13px] text-[#C9E4DE]">
            total penduduk tercatat
          </div>
        </div>
      </div>
    </header>
  )
}