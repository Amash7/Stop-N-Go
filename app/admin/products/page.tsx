'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiPackage } from 'react-icons/fi';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  quantity: number;
  category: string;
  imageUrl: string;
  isActive: boolean;
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user.role === 'admin') {
      fetchProducts();
    }
  }, [session]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin"
            className="text-gray-600 hover:text-gray-800 transition"
          >
            <FiArrowLeft className="text-2xl" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Product Management</h1>
            <p className="text-gray-600 mt-1">Add, edit, or remove products from your inventory</p>
          </div>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition shadow-lg"
        >
          <FiPlus />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Products List */}
      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FiPackage className="text-8xl text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Products Yet</h2>
          <p className="text-gray-600 mb-8">Start by adding your first product</p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition"
          >
            <FiPlus />
            <span>Add Product</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 right-3 bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.category}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(parseFloat(product.price))}
                  </span>
                  <span className={`text-sm font-semibold ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Stock: {product.quantity}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="flex-1 flex items-center justify-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-600 transition"
                  >
                    <FiEdit2 />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={deletingId === product.id}
                    className="flex items-center justify-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

