'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useCartStore } from '@/lib/store/cart-store';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-primary-600 via-accent-purple to-secondary-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition">
            <Image 
              src="/stopNgo.png" 
              alt="Stop N Go" 
              width={60} 
              height={60}
              className="rounded-lg"
            />
            <div className="hidden sm:block">
              <span className="text-2xl font-bold">Stop N Go</span>
              <p className="text-xs opacity-90">Smoke & Convenience</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="hover:text-accent-yellow transition font-medium">
              Products
            </Link>
            
            {session ? (
              <>
                {session.user.role === 'customer' && (
                  <>
                    <Link href="/orders" className="hover:text-accent-yellow transition font-medium">
                      My Orders
                    </Link>
                    <Link href="/vip" className="hover:text-accent-yellow transition font-medium flex items-center">
                      <span className="mr-1">⭐</span> VIP Circle
                    </Link>
                  </>
                )}
                
                {session.user.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="bg-accent-yellow text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
                  >
                    Admin Dashboard
                  </Link>
                )}

                {session.user.role === 'customer' && (
                  <Link href="/cart" className="relative hover:text-accent-yellow transition">
                    <FiShoppingCart className="text-2xl" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent-pink text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}

                <div className="flex items-center space-x-2">
                  <FiUser className="text-xl" />
                  <span className="text-sm">{session.user.name}</span>
                </div>

                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 hover:text-accent-yellow transition"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signin" 
                  className="bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-2xl"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link 
              href="/products" 
              className="block py-2 hover:text-accent-yellow transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            
            {session ? (
              <>
                {session.user.role === 'customer' && (
                  <>
                    <Link 
                      href="/orders" 
                      className="block py-2 hover:text-accent-yellow transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link 
                      href="/vip" 
                      className="block py-2 hover:text-accent-yellow transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ⭐ VIP Circle
                    </Link>
                  </>
                )}
                
                {session.user.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="block py-2 bg-accent-yellow text-gray-900 px-4 rounded-lg font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}

                {session.user.role === 'customer' && (
                  <Link 
                    href="/cart" 
                    className="block py-2 hover:text-accent-yellow transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cart ({totalItems})
                  </Link>
                )}

                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 hover:text-accent-yellow transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/cart" 
                  className="block py-2 hover:text-accent-yellow transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cart ({totalItems})
                </Link>
                
                <Link 
                  href="/auth/signin" 
                  className="block py-2 bg-white text-primary-600 px-4 rounded-lg font-semibold text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

