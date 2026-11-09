const sectionTitle = 'text-lg font-bold text-white'
const mutedClass = 'text-xs text-[#ADB5BD]'

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
