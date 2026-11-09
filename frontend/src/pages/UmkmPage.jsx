import Footer from '../components/Footer'
import KatalogUmkm from '../components/KatalogUmkm'

export default function UmkmPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-[#1f2328]">
        {/* This is your Lego brick for the catalog */}
        <KatalogUmkm /> 
      </div>
      
      {/* This is your Lego brick for the footer */}
      <Footer />
    </div>
  )
}