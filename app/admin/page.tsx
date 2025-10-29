'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiPackage, FiShoppingBag, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface AnalyticsData {
  month: string;
  approved: number;
  discarded: number;
  approvedCount: number;
  discardedCount: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user.role === 'admin') {
      fetchAnalytics();
      fetchStats();
    }
  }, [session]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      setAnalyticsData(data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();

      const pending = ordersData.orders.filter((o: any) => o.status === 'pending').length;
      const revenue = ordersData.orders
        .filter((o: any) => o.status === 'approved')
        .reduce((sum: number, o: any) => sum + parseFloat(o.totalAmount), 0);

      setStats({
        totalProducts: productsData.products.length,
        pendingOrders: pending,
        totalRevenue: revenue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {session?.user.name}!</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 mb-1">Total Products</p>
              <p className="text-4xl font-bold">{stats.totalProducts}</p>
            </div>
            <FiPackage className="text-5xl text-primary-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-100 mb-1">Pending Orders</p>
              <p className="text-4xl font-bold">{stats.pendingOrders}</p>
            </div>
            <FiShoppingBag className="text-5xl text-secondary-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent-purple to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 mb-1">Total Revenue</p>
              <p className="text-4xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <FiTrendingUp className="text-5xl text-purple-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/products"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition text-center"
        >
          <FiPackage className="text-5xl text-primary-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Manage Products</h3>
          <p className="text-gray-600">Add, edit, or remove products</p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition text-center"
        >
          <FiShoppingBag className="text-5xl text-secondary-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Manage Orders</h3>
          <p className="text-gray-600">Approve or discard orders</p>
        </Link>

        <Link
          href="/admin/customers"
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition text-center"
        >
          <FiUsers className="text-5xl text-accent-purple mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">View Customers</h3>
          <p className="text-gray-600">See VIP members and stats</p>
        </Link>
      </div>

      {/* Analytics Chart */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Sales Analytics</h2>
        <p className="text-gray-600 mb-6">
          Track approved vs discarded orders over the past year
        </p>
        
        {analyticsData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="approved" fill="#00bcd4" name="Approved Sales" />
              <Bar dataKey="discarded" fill="#ef4444" name="Discarded Sales" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No analytics data available yet</p>
            <p className="text-sm mt-2">Data will appear once orders are processed</p>
          </div>
        )}
      </div>
    </div>
  );
}

