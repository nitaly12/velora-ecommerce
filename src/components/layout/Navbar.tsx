'use client'

import Link from 'next/link'
import { ShoppingCart, Search, Menu, X, User, Heart } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/context/auth-context'
import { useCart } from '@/context/cart-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function Navbar() {
    const { user } = useAuth()
    const { cartCount } = useCart()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900">
                    <div className="h-6 w-6 rounded-full bg-slate-900" />
                    Velora
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                    <Link href="/products" className="hover:text-slate-900 transition-colors">
                        Shop
                    </Link>
                    <Link href="/categories" className="hover:text-slate-900 transition-colors">
                        Categories
                    </Link>
                    <Link href="/about" className="hover:text-slate-900 transition-colors">
                        About
                    </Link>
                </div>

                {/* Search Bar - Desktop */}
                <div className="hidden md:flex items-center relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        type="search"
                        placeholder="Search products..."
                        className="pl-9 bg-slate-50 border-transparent focus:bg-white transition-all duration-200"
                    />
                </div>

                {/* Icons */}
                <div className="flex items-center gap-2">
                    {user && (
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/wishlist">
                                <Heart className="h-5 w-5" />
                            </Link>
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="relative" asChild>
                        <Link href="/cart">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </Button>

                    {user ? (
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/profile">
                                <User className="h-5 w-5" />
                            </Link>
                        </Button>
                    ) : (
                        <Button variant="default" size="sm" className="hidden md:flex" asChild>
                            <Link href="/login">
                                Sign In
                            </Link>
                        </Button>
                    )}

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-4">
                    <form className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="pl-9 bg-slate-50"
                        />
                    </form>
                    <div className="flex flex-col gap-2 text-sm font-medium">
                        <Link
                            href="/products"
                            className="px-2 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Shop
                        </Link>
                        <Link
                            href="/products"
                            className="px-2 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Categories
                        </Link>
                        {user && (
                            <Link
                                href="/wishlist"
                                className="px-2 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Wishlist
                            </Link>
                        )}
                        {!user && (
                            <Link
                                href="/login"
                                className="px-2 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
