import React from 'react'
import KatalogInovasi from '../components/KatalogInovasi'
import Footer from '../components/Footer'

export default function InovasiPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow bg-[#1f2328]">
        {/* This is your Lego brick for the catalog */}
        <KatalogInovasi /> 
      </div>
      
      {/* This is your Lego brick for the footer */}
      <Footer />
    </div>
  )
}