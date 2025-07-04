'use client';
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';


function VanOwnerSignUpDriver() {
  const [willingToDrive, setWillingToDrive] = useState<boolean | null>(null);

  return (
    <div
      className="pt-5 justify-center justify-items-center pb-13 bg-fixed"
      style={{
        backgroundImage: 'url("./../../illustrations/signupBackground.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '90vh',
      }}
    >
      <div className="mt-15 w-120 mx-auto bg-white shadow-lg rounded-xl border border-amber-50 relative px-10 py-12 ">
        <button
          // onClick={() => }
          className="absolute top-5 left-4 text-gray-600 hover:text-black"
        >
          <ArrowLeft />
        </button>
        <div className='p-5'>
        <h2 className="text-2xl font-semibold text-center mb-8">
          Driver Details
        </h2>

        {/* Added container for driving willingness */}
        <div className="mb-8">
          <h3 className="text-md block font-semibold text-active-text mb-2">Are you willing to drive?</h3>
            <button
              onClick={() => setWillingToDrive(true)}
              className={` mt-5 h-10 rounded-xl w-full  hover:border-yellow-400 border ${
                willingToDrive === true 
                  ? 'bg-amber-50 border-yellow-300 text-gray-500' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              Yes, I will
            </button>
            <button
              onClick={() => setWillingToDrive(false)}
              className={`mt-5 h-10 rounded-xl w-full  hover:border-yellow-400 border ${
                willingToDrive === false 
                  ? 'bg-amber-50 border-yellow-300 text-gray-500' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              No, I am looking for a driver
            </button>

        </div>
        </div>

      </div>
    </div>
  );
}

export default VanOwnerSignUpDriver;