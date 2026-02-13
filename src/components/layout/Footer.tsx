import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Footer() {
    return (
        <footer className="border-t border-slate-100 bg-slate-50 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900">
                            <div className="h-6 w-6 rounded-full bg-slate-900" />
                            Velora
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Experience the future of shopping with our curated collection of premium products.
                            Designed for quality and style.
                        </p>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Shop</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link href="/products" className="hover:text-slate-900">All Products</Link></li>
                            <li><Link href="/categories/new" className="hover:text-slate-900">New Arrivals</Link></li>
                            <li><Link href="/categories/featured" className="hover:text-slate-900">Featured</Link></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li><Link href="/faq" className="hover:text-slate-900">FAQ</Link></li>
                            <li><Link href="/shipping" className="hover:text-slate-900">Shipping</Link></li>
                            <li><Link href="/returns" className="hover:text-slate-900">Returns</Link></li>
                            <li><Link href="/contact" className="hover:text-slate-900">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4">Subscribe</h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Join our newsletter for exclusive offers and updates.
                        </p>
                        <div className="flex gap-2">
                            <Input placeholder="Enter your email" className="bg-white" />
                            <Button>Join</Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
                    <p>&copy; {new Date().getFullYear()} Velora Inc. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/terms" className="hover:text-slate-600">Terms</Link>
                        <Link href="/privacy" className="hover:text-slate-600">Privacy</Link>
                        <Link href="/cookies" className="hover:text-slate-600">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
