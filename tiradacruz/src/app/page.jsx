import Hero from "@/components/landing/Hero"
import FAQ from "@/components/landing/FAQ"
import Footer from "@/components/landing/Footer"
import SeoContent from "@/components/landing/SeoContent"
import ModoApp from "@/components/ModoApp"

export default function Page() {
  return (
    <div className="min-h-screen bg-[#050509]">
      <Hero />
      <main className="max-w-lg mx-auto px-4 py-10">
        <ModoApp />
        <SeoContent />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
