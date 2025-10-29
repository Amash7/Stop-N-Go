'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart-store';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiPackage } from 'react-icons/fi';
import { useSession } from 'next-auth/react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  quantity: number;
  category: string;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { data: session, status } = useSession();
  const addItem = useCartStore((state) => state.addItem);
  const inStock = product.quantity > 0;
  const isAdmin = status === 'authenticated' && session?.user?.role === 'admin';

  const handleAddToCart = () => {
    if (!inStock) {
      toast.error('This product is out of stock');
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1,
      maxQuantity: product.quantity,
      imageUrl: product.imageUrl,
    });

    toast.success('Added to cart!', {
      icon: '🛒',
      style: {
        background: '#00bcd4',
        color: '#fff',
      },
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative h-64 bg-gray-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white text-xl font-bold">OUT OF STOCK</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          {product.category}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Stock Info */}
        <div className="flex items-center space-x-2 mb-4">
          <FiPackage className={inStock ? 'text-green-600' : 'text-red-600'} />
          <span className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
            {inStock ? `${product.quantity} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Price and Action */}
        <div className="space-y-3">
          <div className="text-3xl font-bold text-primary-600">
            {formatCurrency(parseFloat(product.price))}
          </div>
          
          {/* Show Add to Cart button only for authenticated customers */}
          {status === 'loading' ? (
            <button
              disabled
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold bg-gray-200 text-gray-400 cursor-not-allowed"
            >
              <FiShoppingCart className="text-lg" />
              <span>Loading...</span>
            </button>
          ) : status === 'unauthenticated' ? (
            <Link href="/auth/signin" className="w-full">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 shadow-md hover:shadow-lg transition-all">
                <FiShoppingCart className="text-lg" />
                <span>Sign In to Add</span>
              </button>
            </Link>
          ) : isAdmin ? (
            <div className="w-full text-center py-3 bg-accent-yellow/20 rounded-lg border-2 border-accent-yellow/40">
              <p className="text-sm font-semibold text-gray-700">
                👔 Admin View Only
              </p>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                inStock
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FiShoppingCart className="text-lg" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

