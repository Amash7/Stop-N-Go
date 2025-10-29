'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'approved' | 'discarded';
  totalAmount: string;
  adminNote: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
    vipNumber: string | null;
    vipApprovedOrders: number;
  };
  items: {
    id: string;
    productName: string;
    productPrice: string;
    quantity: number;
    subtotal: string;
  }[];
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'discarded'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user.role === 'admin') {
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
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (orderId: string) => {
    if (!confirm('Are you sure you want to approve this order?')) {
      return;
    }

    setProcessingId(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminNote: adminNotes[orderId] || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve order');
      }

      toast.success('Order approved successfully!');
      fetchOrders();
      setAdminNotes({ ...adminNotes, [orderId]: '' });
    } catch (error) {
      toast.error('Failed to approve order');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDiscard = async (orderId: string) => {
    if (!confirm('Are you sure you want to discard this order? Inventory will be restored.')) {
      return;
    }

    setProcessingId(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}/discard`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to discard order');
      }

      toast.success('Order discarded and inventory restored');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to discard order');
    } finally {
      setProcessingId(null);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'approved':
        return <FiCheckCircle className="text-green-500" />;
      case 'discarded':
        return <FiXCircle className="text-red-500" />;
      default:
        return null;
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
            <h1 className="text-4xl font-bold text-gray-800">Order Management</h1>
            <p className="text-gray-600 mt-1">Review and process customer orders</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 bg-white rounded-lg p-2 shadow">
        {(['all', 'pending', 'approved', 'discarded'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
              filter === f
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No {filter !== 'all' ? filter : ''} Orders</h2>
          <p className="text-gray-600">There are no {filter !== 'all' ? filter : ''} orders at this time</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
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

              {/* Order Content */}
              <div className="p-6">
                {/* Customer Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold">{order.user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold">{order.user.email}</p>
                    </div>
                    {order.user.vipNumber && (
                      <>
                        <div>
                          <p className="text-sm text-gray-600">VIP Number</p>
                          <p className="font-semibold text-accent-yellow">⭐ {order.user.vipNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">VIP Orders</p>
                          <p className="font-semibold">{order.user.vipApprovedOrders} approved orders</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <h4 className="font-semibold text-lg mb-4">Order Items</h4>
                <div className="space-y-3 mb-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-3 border-b">
                      <div>
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

                <div className="flex justify-between items-center pt-4 border-t mb-6">
                  <span className="text-xl font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(parseFloat(order.totalAmount))}
                  </span>
                </div>

                {/* Admin Actions */}
                {order.status === 'pending' && (
                  <div className="bg-blue-50 rounded-lg p-4 space-y-4">
                    <div className="bg-white border border-blue-200 rounded p-3 mb-3">
                      <p className="text-sm text-gray-700">
                        <strong>⚠️ Important:</strong> Stock will be reduced when you approve this order. Customer will pay in-store.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add Note (Optional - e.g., VIP reward message)
                      </label>
                      <textarea
                        value={adminNotes[order.id] || ''}
                        onChange={(e) => setAdminNotes({ ...adminNotes, [order.id]: e.target.value })}
                        placeholder="Add a note for the customer..."
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      {order.user.vipNumber && order.user.vipApprovedOrders === 9 && (
                        <p className="text-sm text-accent-yellow font-semibold mt-2">
                          💡 Tip: This will be their 10th order! Add a VIP reward message.
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApprove(order.id)}
                        disabled={processingId === order.id}
                        className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiCheckCircle />
                        <span>Approve Order</span>
                      </button>
                      <button
                        onClick={() => handleDiscard(order.id)}
                        disabled={processingId === order.id}
                        className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiXCircle />
                        <span>Discard Order</span>
                      </button>
                    </div>
                  </div>
                )}

                {order.adminNote && (
                  <div className="bg-accent-yellow/20 border-l-4 border-accent-yellow p-4 rounded">
                    <p className="font-semibold text-gray-800 mb-1">📝 Admin Note:</p>
                    <p className="text-gray-700">{order.adminNote}</p>
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

