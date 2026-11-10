export default function Legend({ isLight = false }) {
  return (
    <div
      className={`mb-4 flex flex-wrap gap-5 text-sm font-medium ${
        isLight ? 'text-slate-700' : 'text-[#DEE2E6]'
      }`}
    >
      <span className="flex items-center gap-2">
        <i className="h-3.5 w-3.5 rounded-sm bg-[#4379F2]" />
        Laki-laki
      </span>
      <span className="flex items-center gap-2">
        <i className="h-3.5 w-3.5 rounded-sm bg-[#E65C00]" />
        Perempuan
      </span>
    </div>
  )
}
