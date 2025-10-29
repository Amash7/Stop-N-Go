'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiUsers, FiStar } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Customer {
  id: string;
  name: string;
  email: string;
  vipNumber: string | null;
  vipApprovedOrders: number;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && session?.user.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user.role === 'admin') {
      fetchCustomers();
    }
  }, [session]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers');
      const data = await response.json();
      setCustomers(data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
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

  const vipCustomers = customers.filter(c => c.vipNumber);
  const regularCustomers = customers.filter(c => !c.vipNumber);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link
          href="/admin"
          className="text-gray-600 hover:text-gray-800 transition"
        >
          <FiArrowLeft className="text-2xl" />
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Customer Management</h1>
          <p className="text-gray-600 mt-1">View all customers and VIP members</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 mb-1">Total Customers</p>
              <p className="text-4xl font-bold">{customers.length}</p>
            </div>
            <FiUsers className="text-5xl text-primary-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent-yellow to-secondary-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 mb-1">VIP Members</p>
              <p className="text-4xl font-bold">{vipCustomers.length}</p>
            </div>
            <FiStar className="text-5xl text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-100 mb-1">Regular Customers</p>
              <p className="text-4xl font-bold">{regularCustomers.length}</p>
            </div>
            <FiUsers className="text-5xl text-secondary-200" />
          </div>
        </div>
      </div>

      {/* VIP Customers */}
      {vipCustomers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FiStar className="text-accent-yellow mr-2" />
            VIP Circle Members
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-accent-yellow/20 to-secondary-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">VIP Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Approved Orders</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Member Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vipCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="bg-accent-yellow/20 text-secondary-700 px-3 py-1 rounded-full font-semibold">
                          {customer.vipNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="text-primary-600 font-semibold">
                          {customer.vipApprovedOrders}
                        </span>
                        {customer.vipApprovedOrders >= 10 && (
                          <span className="ml-2 text-xs">🎁</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Regular Customers */}
      {regularCustomers.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FiUsers className="text-primary-600 mr-2" />
            Regular Customers
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {regularCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {customers.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FiUsers className="text-8xl text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Customers Yet</h2>
          <p className="text-gray-600">Customers will appear here once they sign up</p>
        </div>
      )}
    </div>
  );
}

