import Hero from "@/components/landing/Hero"
import FAQ from "@/components/landing/FAQ"
import Footer from "@/components/landing/Footer"
import SeoContent from "@/components/landing/SeoContent"
import ModoApp from "@/components/ModoApp"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Hero />
      <main className="max-w-6xl mx-auto p-4 py-10">
        <ModoApp />
        <SeoContent />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
