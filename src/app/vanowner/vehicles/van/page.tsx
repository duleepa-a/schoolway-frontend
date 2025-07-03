import React from 'react'
import {FaBell, FaMoon } from 'react-icons/fa';
import Image from 'next/image';

const VanDetailsPage = () => {
  
  return (
    <section className="p-6 md:p-10 min-h-screen w-full">
        <div className="flex justify-between items-center mt-10 mb-2.5">
            <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Vehicles</h2>
            </div>
            <div className='bg-white flex justify-end items-center gap-4 mb-6 py-1 px-6 rounded-4xl w-fit'>
              <FaBell className="text-gray-500 hover:text-gray-700 cursor-pointer ml-5" />
              <FaMoon className="text-gray-500 hover:text-gray-700 cursor-pointer" />
              <Image
                  src="/Images/male_pro_pic_placeholder.png"
                  alt="Profile"
                  width={50}
                  height={50}
                  className="rounded-full object-cover border ml-14"
              />
            </div>
        </div>
        

    </section>
  )
}

export default VanDetailsPage