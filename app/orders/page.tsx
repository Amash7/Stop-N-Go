'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import { FiPackage, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'approved' | 'discarded';
  totalAmount: string;
  adminNote: string | null;
  createdAt: string;
  items: {
    id: string;
    productName: string;
    productPrice: string;
    quantity: number;
    subtotal: string;
  }[];
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'approved':
        return <FiCheckCircle className="text-green-500" />;
      case 'discarded':
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiPackage />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'discarded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <FiPackage className="text-8xl text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
          <p className="text-gray-600 mb-8">Start shopping to place your first order!</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Order #{order.orderNumber}</h3>
                    <p className="text-primary-100">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(order.status)}
                    <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <h4 className="font-semibold text-lg mb-4">Order Items</h4>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-3 border-b">
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800">{item.productName}</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(parseFloat(item.productPrice))} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-primary-600">
                        {formatCurrency(parseFloat(item.subtotal))}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t flex justify-between items-center">
                  <span className="text-xl font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(parseFloat(order.totalAmount))}
                  </span>
                </div>

                {order.adminNote && (
                  <div className="mt-6 bg-accent-yellow/20 border-l-4 border-accent-yellow p-4 rounded">
                    <p className="font-semibold text-gray-800 mb-1">📝 Note from Admin:</p>
                    <p className="text-gray-700">{order.adminNote}</p>
                  </div>
                )}

                {order.status === 'pending' && (
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      ⏳ Your order is pending. Please visit our store to complete the pickup and payment.
                    </p>
                  </div>
                )}

                {order.status === 'approved' && (
                  <div className="mt-6 bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✅ Order completed! Thank you for shopping with us.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

