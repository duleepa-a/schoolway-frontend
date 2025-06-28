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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.
          </p>

          <div className="flex gap-4">
            <button className="bg-primary hover:bg-gray-900 text-white px-8 py-4 text-sm font-semibold rounded cursor-pointer">
              Learn More
            </button>
            <button className="bg-black text-white hover:bg-gray-900 px-8 py-4 text-sm font-semibold rounded flex items-center gap-2 cursor-pointer">
              Get Our App <BiLogoPlayStore className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDetails;
