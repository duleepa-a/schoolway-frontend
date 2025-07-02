import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function HomeInfoCards() {
  return (
    <div>
      <section className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="flex justify-center">
                <Image src="/illustrations/2man.png" alt="Van Tracking Illustration" width={400} height={400} />
              </div>
              <div className="text-left">
                <h2 className="text-3xl font-bold text-gray-800 md:text-3xl mb-4">
                  Find a reliable driver for your school service
                </h2>
                <p className="text-sm mb-6">
                  Whether you're running a school service by hiring out your vehicle with a driver or have a vehicle sitting idle at home and are eager to start a school van service, our platform is here to help. You can easily find reliable drivers to team up with, ensuring safe and efficient operations. With our tools, managing your fleet becomes simple, allowing you to connect, coordinate, and grow your school transport business with confidence.
                </p>
                <div className="flex gap-4">
                <Link href="/signup">
                  <button className="btn-primary">
                    Register
                  </button>
                </Link>
                </div>
              </div>
            </div>
      </section>
      <section className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="text-left">
                <h2 className="text-3xl font-bold text-gray-800 md:text-3xl mb-4">
                 Find vehicles for your private trips
                </h2>
                <p className="text-sm mb-6">
                  Van drivers can boost their earnings by finding private hires on our platform during free days like holidays and weekends, beyond their regular school service schedules. Additionally, if you're planning a trip and need a vehicle, our platform makes it easy to find the perfect option. Connect with reliable drivers and available vans, ensuring flexibility and extra income opportunities for drivers while meeting your travel needs seamlessly.
                </p>
                <div className="flex gap-4">
                  <button className="btn-primary">
                    Discover
                  </button>
                </div>
              </div>
              <div className="flex justify-center">
                <Image src="/illustrations/yellowvan.png" alt="Van Tracking Illustration" width={400} height={400} />
              </div>
            </div>
      </section>
    </div>
  );
}