import { FiMapPin, FiPhone, FiClock } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Location */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-400">Visit Us</h3>
            <div className="flex items-start space-x-3 mb-3">
              <FiMapPin className="text-2xl text-secondary-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">643 Prospect St</p>
                <p>Chicopee, MA 01020</p>
                <p>United States</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mb-3">
              <FiPhone className="text-2xl text-secondary-400" />
              <a href="tel:+15082505675" className="hover:text-primary-400 transition">
                +1 (508) 250-5675
              </a>
            </div>
            <div className="flex items-start space-x-3">
              <FiClock className="text-2xl text-secondary-400 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">Store Hours</p>
                <p className="text-sm text-gray-400">Mon-Sun: 7AM - 11PM</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4 text-primary-400">Find Us</h3>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2955.627720422787!2d-72.580952!3d42.2010268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e6dd81d61a20f1%3A0x1e0c50f321f20f43!2sstop%20n%20Go%20smoke%20shop!5e0!3m2!1sen!2s!4v1760208560971!5m2!1sen!2s" 
                width="100%" 
                height="250" 
                style={{border:0}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Stop N Go Smoke & Convenience Store. All rights reserved.</p>
          <p className="mt-2">Must be 21+ to purchase tobacco products</p>
        </div>
      </div>
    </footer>
  );
}

