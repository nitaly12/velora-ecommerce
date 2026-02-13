export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    role: 'USER' | 'ADMIN'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'USER' | 'ADMIN'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'USER' | 'ADMIN'
                    created_at?: string
                    updated_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    image_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    image_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    image_url?: string | null
                    created_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    category_id: string | null
                    name: string
                    slug: string
                    description: string | null
                    price: number
                    stock: number
                    images: string[] | null
                    is_featured: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    category_id?: string | null
                    name: string
                    slug: string
                    description?: string | null
                    price: number
                    stock?: number
                    images?: string[] | null
                    is_featured?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    category_id?: string | null
                    name?: string
                    slug?: string
                    description?: string | null
                    price?: number
                    stock?: number
                    images?: string[] | null
                    is_featured?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string
                    stripe_payment_id: string | null
                    status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
                    total_amount: number
                    shipping_address: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    stripe_payment_id?: string | null
                    status?: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
                    total_amount: number
                    shipping_address?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    stripe_payment_id?: string | null
                    status?: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
                    total_amount?: number
                    shipping_address?: Json | null
                    created_at?: string
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    product_id: string | null
                    quantity: number
                    price_at_purchase: number
                }
                Insert: {
                    id?: string
                    order_id: string
                    product_id?: string | null
                    quantity: number
                    price_at_purchase: number
                }
                Update: {
                    id?: string
                    order_id?: string
                    product_id?: string | null
                    quantity?: number
                    price_at_purchase?: number
                }
            }
            cart: {
                Row: {
                    id: string
                    user_id: string | null
                    session_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    session_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    session_id?: string | null
                    created_at?: string
                }
            }
            cart_items: {
                Row: {
                    id: string
                    cart_id: string
                    product_id: string
                    quantity: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    cart_id: string
                    product_id: string
                    quantity?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    cart_id?: string
                    product_id?: string
                    quantity?: number
                    created_at?: string
                }
            }
            wishlist: {
                Row: {
                    id: string
                    user_id: string
                    product_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    product_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    product_id?: string
                    created_at?: string
                }
            }
        }
    }
}
