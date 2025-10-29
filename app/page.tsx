import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingBag, FiStar, FiMapPin, FiClock } from 'react-icons/fi';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-500 via-accent-purple to-secondary-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Welcome to<br />
                <span className="text-accent-yellow">Stop N Go</span>
              </h1>
              <p className="text-xl text-gray-100">
                Your premier smoke & convenience store in Chicopee, MA
              </p>
              <p className="text-lg">
                Browse our extensive selection of products and book them online for in-store pickup!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/products"
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg inline-flex items-center justify-center"
                >
                  <FiShoppingBag className="mr-2" />
                  Shop Now
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-accent-yellow text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition shadow-lg inline-flex items-center justify-center"
                >
                  <FiStar className="mr-2" />
                  Join VIP Circle
                </Link>
              </div>
            </div>
            <div className="relative h-96 md:h-[500px] flex items-center justify-center">
              <Image
                src="/stopNgo.png"
                alt="Stop N Go Logo"
                width={500}
                height={500}
                className="object-contain drop-shadow-2xl animate-pulse"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Why Choose Stop N Go?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 hover:shadow-xl transition">
              <div className="bg-primary-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShoppingBag className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Wide Selection</h3>
              <p className="text-gray-600">
                Browse hundreds of products from top brands. Book online and pick up in store!
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-secondary-50 to-secondary-100 hover:shadow-xl transition">
              <div className="bg-secondary-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">VIP Circle Rewards</h3>
              <p className="text-gray-600">
                Join our exclusive VIP Circle and earn rewards after every 10 approved purchases!
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-accent-purple/10 to-accent-purple/20 hover:shadow-xl transition">
              <div className="bg-accent-purple text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Convenient Hours</h3>
              <p className="text-gray-600">
                Open 7 days a week with extended hours to serve you better!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Visit Our Store</h2>
            <div className="flex items-center justify-center space-x-2 text-xl text-gray-600">
              <FiMapPin className="text-primary-500" />
              <span>643 Prospect St, Chicopee, MA 01020</span>
            </div>
            <a 
              href="tel:+15082505675" 
              className="inline-block mt-4 text-2xl font-semibold text-primary-600 hover:text-primary-700 transition"
            >
              +1 (508) 250-5675
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Store Hours</h3>
              <div className="space-y-3 text-lg">
                <div className="flex justify-between">
                  <span className="font-semibold">Monday - Sunday</span>
                  <span className="text-primary-600">7:00 AM - 11:00 PM</span>
                </div>
              </div>
              <div className="mt-8 p-4 bg-accent-yellow/20 rounded-lg">
                <p className="text-center font-semibold text-gray-800">
                  📱 Book online, pay in store - No credit card required!
                </p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2955.627720422787!2d-72.580952!3d42.2010268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e6dd81d61a20f1%3A0x1e0c50f321f20f43!2sstop%20n%20Go%20smoke%20shop!5e0!3m2!1sen!2s!4v1760208560971!5m2!1sen!2s" 
                width="100%" 
                height="400" 
                style={{border:0}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 via-accent-purple to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Shop?</h2>
          <p className="text-xl mb-8">
            Explore our products and reserve yours today for quick in-store pickup!
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-primary-600 px-12 py-4 rounded-lg font-bold text-xl hover:bg-gray-100 transition shadow-lg"
          >
            Browse Products
          </Link>
        </div>
      </section>
    </div>
  );
}

