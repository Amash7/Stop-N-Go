'use client';

import { useCartStore } from '@/lib/store/cart-store';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();

  // Redirect non-logged-in users to sign in
  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Please sign in to view your cart');
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Redirect admins to dashboard
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      toast.error('Admins cannot access the shopping cart');
      router.push('/admin');
    }
  }, [status, session, router]);

  const handleCheckout = async () => {
    if (!session) {
      toast.error('Please sign in to place an order');
      router.push('/auth/signin');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      toast.success('Order placed successfully!', {
        duration: 5000,
        icon: '✅',
      });
      
      clearCart();
      router.push('/orders');
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <FiShoppingBag className="text-8xl text-gray-300 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
        <p className="text-xl text-gray-600 mb-8">
          Start shopping and add some products to your cart!
        </p>
        <Link
          href="/products"
          className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row gap-4"
            >
              {/* Product Image */}
              <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              {/* Product Details */}
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-2xl font-bold text-primary-600 mb-4">
                  {formatCurrency(item.price)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100 rounded-l-lg transition"
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span className="px-4 font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100 rounded-r-lg transition"
                      disabled={item.quantity >= item.maxQuantity}
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    (Max: {item.maxQuantity})
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col justify-between items-end">
                <p className="text-2xl font-bold text-gray-800">
                  {formatCurrency(item.price * item.quantity)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 transition flex items-center space-x-1 mt-4"
                >
                  <FiTrash2 />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatCurrency(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">Calculated in store</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">{formatCurrency(getTotalPrice())}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">+ applicable taxes</p>
              </div>
            </div>

            <div className="bg-accent-yellow/20 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-center">
                💳 No payment required online<br />
                Pay when you pick up in store
              </p>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-lg font-bold text-lg hover:from-primary-600 hover:to-primary-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Reserve for Pickup'}
            </button>

            <Link
              href="/products"
              className="block text-center text-primary-600 hover:text-primary-700 font-semibold mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

