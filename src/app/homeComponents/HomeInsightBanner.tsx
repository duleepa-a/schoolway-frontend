import React from 'react';
import Image from 'next/image';
import { ArrowRight, Users, User, Bus, School } from 'lucide-react';

const HomeInsightBanner = () => {
  return (
    <div>
        {/* Stats Section */}
        <section className="bg-[#F5F7FA] py-12">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Text */}
            <div>
              <h3 className="text-3xl font-semibold text-gray-800 mb-3">
                Connected Many
              </h3>
              <h4 className="text-3xl font-semibold text-primary mb-3">
                School Services and Parents
              </h4>
              <p className="text-sm text-gray-600">We reached here with our hard work and dedication</p>
            </div>

            {/* Right Stats Grid */}
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center gap-3">
                <Users className="w-10 h-10 mr-3 text-primary" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">2,245,341</p>
                  <p className="text-sm text-gray-600">Students</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-10 h-10 mr-3 text-primary" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">46,328</p>
                  <p className="text-sm text-gray-600">Drivers</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Bus className="w-10 h-10 mr-3 text-primary" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">828,867</p>
                  <p className="text-sm text-gray-600">Van Owners</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <School className="w-10 h-10 mr-3 text-primary" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">1,926,436</p>
                  <p className="text-sm text-gray-600">Schools</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default HomeInsightBanner;
