const sectionTitle = 'text-lg font-bold text-[#0E3B38]'
const mutedClass = 'text-xs text-[#6E6857]'

export default function Section({ title, description, children }) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className={sectionTitle}>{title}</h2>
        <p className={mutedClass}>{description}</p>
      </div>
      {children}
    </section>
  )
}