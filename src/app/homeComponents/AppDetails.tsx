import React from 'react';
import Image from 'next/image';
import { BiLogoPlayStore} from "react-icons/bi";

const AppDetails = () => {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Image */}
        <div className="flex justify-center">
          <Image src="/illustrations/heroimage1.png" alt="Van Tracking Illustration" width={400} height={400} />
        </div>

        {/* Right Text Section */}
        <div className="text-left">
          <h2 className="text-3xl font-bold text-gray-800 md:text-3xl mb-4">
            The safety of your child's journey,<br className="hidden md:block" /> tracked live!
          </h2>
            <p className="text-sm mb-6">
            With our advanced real-time tracking system, you can monitor your child's school journey every step of the way. Receive instant updates, route notifications, and peace of mind knowing exactly where your child is during transit. Safety and transparency are at the heart of our service, ensuring your child’s journey is secure and worry-free.
            </p>

          <div className="flex gap-4">
            <button className="btn-primary">
              Learn More
            </button>
            <button className="btn-secondary">
              Get Our App <BiLogoPlayStore className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDetails;
