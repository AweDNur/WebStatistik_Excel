import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const STORAGE_KEY = 'desa-cantik-berita'

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function BeritaAdminPage() {
  const navigate = useNavigate()
  const editorRef = useRef(null)
  const [title, setTitle] = useState('')
  const [cover, setCover] = useState('')
  const [link, setLink] = useState('')
  const [documentName, setDocumentName] = useState('')
  const [message, setMessage] = useState('')

  const formatText = (command, value = null) => {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
  }

  async function handleCover(event) {
    const file = event.target.files?.[0]
    if (file) setCover(await fileToDataUrl(file))
  }

  function publish(event) {
    event.preventDefault()
    const content = editorRef.current?.innerHTML || ''
    const excerpt = editorRef.current?.innerText?.slice(0, 140) || ''
    if (!title.trim() || !excerpt.trim()) {
      setMessage('Judul dan isi berita wajib diisi.')
      return
    }

    const articles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    articles.unshift({
      id: `news-${Date.now()}`,
      title: title.trim(),
      content,
      excerpt,
      cover,
      link,
      documentName,
      date: new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date()),
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
    navigate('/berita')
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] px-4 py-8 text-[#1F2937] sm:px-8 lg:px-12">
      <form onSubmit={publish} className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div className="flex items-center gap-4">
            <Link to="/berita" className="text-2xl text-gray-500 hover:text-indigo-600" aria-label="Kembali">←</Link>
            <div><h1 className="text-xl font-bold sm:text-2xl">Tulis Berita Baru</h1><p className="text-sm text-gray-500">Bagikan cerita kepada publik.</p></div>
          </div>
          <div className="flex gap-3">
            <Link to="/berita" className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold">Batal</Link>
            <button type="submit" className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700">▣&nbsp; Publish</button>
          </div>
        </header>

        {message && <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{message}</p>}

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_345px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Judul Berita yang Menarik..." className="w-full border-0 text-2xl font-bold text-indigo-950 outline-none placeholder:text-gray-400 sm:text-3xl" />
              <p className="mt-4 inline-block rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">slug: otomatis</p>
            </section>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                <button type="button" onClick={() => formatText('bold')} className="rounded px-2 py-1 font-bold hover:bg-gray-200">B</button>
                <button type="button" onClick={() => formatText('italic')} className="rounded px-2 py-1 italic hover:bg-gray-200">I</button>
                <button type="button" onClick={() => formatText('underline')} className="rounded px-2 py-1 underline hover:bg-gray-200">U</button>
                <span className="mx-1 h-5 w-px bg-gray-300" />
                <button type="button" onClick={() => formatText('formatBlock', 'h2')} className="rounded px-2 py-1 hover:bg-gray-200">H2</button>
                <button type="button" onClick={() => formatText('formatBlock', 'h3')} className="rounded px-2 py-1 hover:bg-gray-200">H3</button>
                <button type="button" onClick={() => formatText('insertUnorderedList')} className="rounded px-2 py-1 hover:bg-gray-200">☷</button>
                <button type="button" onClick={() => formatText('createLink', window.prompt('Masukkan URL'))} className="rounded px-2 py-1 hover:bg-gray-200">🔗</button>
              </div>
              <div ref={editorRef} contentEditable suppressContentEditableWarning className="min-h-[430px] p-6 text-gray-700 outline-none empty:before:text-gray-400 empty:before:content-['Mulai_menulis_cerita_di_sini...']" />
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-bold">Cover Image</h2>
              <label className="flex h-44 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center hover:bg-indigo-50">
                {cover ? <img src={cover} alt="Preview cover" className="h-full w-full rounded-xl object-cover" /> : <><span className="mb-2 text-3xl text-indigo-500">⇧</span><span className="text-sm font-semibold text-gray-600">Upload Gambar</span><span className="text-xs text-gray-400">JPG/PNG Maks 2MB</span></>}
                <input type="file" accept="image/png,image/jpeg" onChange={handleCover} className="hidden" />
              </label>
              <div className="my-4 border-t border-gray-100" />
              <label className="text-sm font-semibold">Atau via Link</label>
              <input value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://..." className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500" />
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-2 font-bold">▧&nbsp; File Dokumentasi</h2>
              <p className="mb-4 text-xs text-gray-400">Opsional — PDF, Docs, atau file pendukung.</p>
              <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm font-semibold text-gray-600 hover:bg-indigo-50">⇧&nbsp; {documentName || 'Upload File'}<input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setDocumentName(event.target.files?.[0]?.name || '')} className="hidden" /></label>
            </section>
          </aside>
        </div>
      </form>
    </main>
  )
}
