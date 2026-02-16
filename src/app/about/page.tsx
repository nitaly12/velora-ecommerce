import { Logo } from '@/components/ui/logo'

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441984969813-91c79a1e3bb3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
                <div className="relative max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Our Story
                    </h1>
                    <p className="mt-6 text-xl text-slate-300">
                        Velora was born from a simple idea: that premium quality and modern design should be accessible to everyone who values elegance and functionality.
                    </p>
                </div>
            </section>

            {/* Content Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
                {/* Quality & Craftsmanship */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Quality & Craftsmanship</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            We believe that the products you surround yourself with should be built to last. That's why we partner with artisans and manufacturers who share our obsession with detail and durability.
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Every item in the Velora collection undergoes rigorous quality checks. From the stitching on our leather goods to the components in our electronics, we don't settle for "good enough."
                        </p>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-2xl skew-y-1">
                        <img
                            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
                            alt="Craftsmanship"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>

                {/* Minimalist Design */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse">
                    <div className="lg:order-last space-y-6">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Minimalist Philosophy</h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            In a world of noise, we choose clarity. Our design philosophy is rooted in minimalism—stripping away the unnecessary to reveal the essential.
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            We create products that don't just fill space, but enhance it. Clean lines, neutral palettes, and thoughtful functionality are the hallmarks of everything we do.
                        </p>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-2xl -skew-y-1">
                        <img
                            src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop"
                            alt="Minimalist Interior"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>

                {/* Sustainability */}
                <div className="bg-slate-50 rounded-3xl p-8 md:p-12 lg:p-16 text-center space-y-8">
                    <Logo size="lg" className="justify-center" iconOnly />
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Commitment to the Planet</h2>
                    <p className="max-w-2xl mx-auto text-lg text-slate-600">
                        Being premium shouldn't come at the cost of the environment. We are constantly working to reduce our carbon footprint, using recyclable packaging and sourcing materials responsibly.
                    </p>
                </div>
            </div>
        </div>
    )
}
