import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/features/ProductCard'

export default async function Home() {
  const supabase = await createClient()

  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('is_featured', true)
    .limit(4)

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, image_url')
    .order('name')

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-slate-900 px-4 py-24 sm:px-6 lg:px-8 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-2xl mx-auto space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Redefining Modern Elegance
          </h1>
          <p className="mx-auto max-w-xl text-lg text-slate-300">
            Discover our curated collection of premium products designed to elevate your lifestyle.
            Minimalist, functional, and timeless.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100" asChild>
              <Link href="/products">Shop Collection</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 hover:text-white" asChild>
              <Link href="/about">Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 md:px-6 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Featured Products</h2>
          <Button variant="link" asChild>
            <Link href="/products">View All</Link>
          </Button>
        </div>

        {featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500">No featured products found. Check back soon!</p>
            <p className="text-xs text-slate-400 mt-2">(Admins: Add products marked as 'is_featured')</p>
          </div>
        )}
      </section>

      {/* Categories from DB */}
      <section className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="relative h-64 overflow-hidden rounded-2xl bg-slate-100 group"
              >
                {cat.image_url ? (
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundImage: `url(${cat.image_url})` }} />
                ) : (
                  <div className="absolute inset-0 bg-slate-200" />
                )}
                <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/40 transition-colors" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="font-bold text-xl text-white drop-shadow">{cat.name}</h3>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500">
              No categories yet. Admins can add them in the dashboard.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
