'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiStar, FiAward, FiGift } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface UserData {
  vipNumber: string | null;
  vipApprovedOrders: number;
}

export default function VIPPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      if (session.user.role === 'admin') {
        router.push('/admin');
      } else {
        fetchUserData();
      }
    }
  }, [status, session, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/vip-status');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    setIsEnrolling(true);
    try {
      const response = await fetch('/api/vip/enroll', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enroll');
      }

      toast.success('Welcome to VIP Circle! 🌟', {
        duration: 5000,
      });

      // Update session
      await update();
      
      // Refresh user data
      fetchUserData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to enroll in VIP Circle');
    } finally {
      setIsEnrolling(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const progress = userData?.vipApprovedOrders || 0;
  const progressPercentage = (progress % 10) * 10;
  const rewardsEarned = Math.floor(progress / 10);
  const ordersUntilNextReward = 10 - (progress % 10);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block bg-gradient-to-r from-accent-yellow to-secondary-500 p-1 rounded-2xl mb-6">
          <div className="bg-white px-8 py-4 rounded-xl">
            <FiStar className="text-6xl text-accent-yellow mx-auto mb-2" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              VIP Circle
            </h1>
          </div>
        </div>
        <p className="text-xl text-gray-600">
          Exclusive rewards for our loyal customers
        </p>
      </div>

      {!userData?.vipNumber ? (
        /* Not Enrolled */
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Join VIP Circle Today!
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
              <FiStar className="text-5xl text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Exclusive Membership</h3>
              <p className="text-gray-600">Get your unique VIP number</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl">
              <FiAward className="text-5xl text-secondary-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your approved orders</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-accent-yellow/20 to-accent-yellow/30 rounded-xl">
              <FiGift className="text-5xl text-secondary-600 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">Earn Rewards</h3>
              <p className="text-gray-600">Get gifts every 10 orders</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white mb-6">
            <h3 className="text-2xl font-bold mb-3">How It Works</h3>
            <ol className="space-y-2">
              <li className="flex items-start">
                <span className="font-bold mr-2">1.</span>
                <span>Enroll in VIP Circle and get your unique number</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">2.</span>
                <span>Place orders and pick them up at our store</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">3.</span>
                <span>Each approved order counts toward your reward</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">4.</span>
                <span>After 10 approved orders, receive a special gift!</span>
              </li>
            </ol>
          </div>

          <button
            onClick={handleEnroll}
            disabled={isEnrolling}
            className="w-full bg-gradient-to-r from-accent-yellow to-secondary-500 text-white py-4 rounded-xl font-bold text-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEnrolling ? 'Enrolling...' : '✨ Join VIP Circle Now'}
          </button>
        </div>
      ) : (
        /* Enrolled */
        <div className="space-y-8">
          {/* VIP Card */}
          <div className="bg-gradient-to-r from-primary-600 via-accent-purple to-secondary-600 rounded-2xl shadow-2xl p-8 text-white transform hover:scale-105 transition">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm opacity-90 mb-1">Member Since</p>
                <p className="font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
              <FiStar className="text-4xl text-accent-yellow" />
            </div>
            <div className="mb-6">
              <p className="text-sm opacity-90 mb-2">VIP Number</p>
              <p className="text-3xl font-bold tracking-wider">{userData.vipNumber}</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Member Name</p>
                <p className="text-xl font-semibold">{session?.user.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Status</p>
                <p className="text-xl font-semibold">VIP Member</p>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Progress</h2>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Progress to next reward</span>
                <span className="font-bold text-primary-600">{progress % 10}/10 orders</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {ordersUntilNextReward === 10
                  ? 'Start shopping to earn your first reward!'
                  : `Only ${ordersUntilNextReward} more order${ordersUntilNextReward === 1 ? '' : 's'} until your next reward!`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-primary-50 rounded-xl">
                <p className="text-4xl font-bold text-primary-600 mb-2">{progress}</p>
                <p className="text-gray-600">Total Approved Orders</p>
              </div>

              <div className="text-center p-6 bg-secondary-50 rounded-xl">
                <p className="text-4xl font-bold text-secondary-600 mb-2">{rewardsEarned}</p>
                <p className="text-gray-600">Rewards Earned</p>
              </div>

              <div className="text-center p-6 bg-accent-yellow/20 rounded-xl">
                <p className="text-4xl font-bold text-secondary-600 mb-2">{ordersUntilNextReward}</p>
                <p className="text-gray-600">Orders to Next Reward</p>
              </div>
            </div>

            {progress % 10 === 0 && progress > 0 && (
              <div className="mt-6 bg-gradient-to-r from-accent-yellow/20 to-secondary-100 border-2 border-accent-yellow rounded-xl p-6 text-center">
                <FiGift className="text-5xl text-secondary-600 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">🎉 Reward Available!</h3>
                <p className="text-gray-700">
                  Visit our store to claim your reward. The admin will add a special note to your next order!
                </p>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your VIP Benefits</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary-500 text-white rounded-full p-2 flex-shrink-0">
                  <FiStar className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Exclusive Rewards</h3>
                  <p className="text-gray-600">Receive special gifts every 10 approved orders</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-secondary-500 text-white rounded-full p-2 flex-shrink-0">
                  <FiAward className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Progress Tracking</h3>
                  <p className="text-gray-600">Monitor your orders and rewards in real-time</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-accent-purple text-white rounded-full p-2 flex-shrink-0">
                  <FiGift className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Personalized Service</h3>
                  <p className="text-gray-600">Get special notes and offers from our team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

