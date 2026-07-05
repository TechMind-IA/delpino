import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { GalleryWrapper } from "@/components/gallery-wrapper"
import { Footer } from "@/components/footer"
import { getGalleryItems } from "@/app/actions/gallery"

export default async function HomePage() {
  const items = await getGalleryItems()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <GalleryWrapper items={items} />
      </main>
      <Footer />
    </div>
  )
}
