'use client';

import Image from 'next/image';
import React from 'react';

const VanDetails = () => {
  const schools = [
    'Good Shephard Convent - Watthala',
    "St. Lucia's Collage",
    "St. Benedict's Primary School",
    "St. Benedict's Upper School",
    'Good Shephard Convent - Kotahena',
    "Roman Catholic's Girl's School - Kotahena",
  ];

  const students = [
    { name: 'Ayanga Wethmini', time: '1:30 PM', image: '/Images/male_pro_pic_placeholder.png' },
    { name: 'Ayanga Wethmini', time: '1:30 PM', image: '/Images/male_pro_pic_placeholder.png' },
    { name: 'Ayanga Wethmini', time: '1:30 PM', image: '/Images/male_pro_pic_placeholder.png' },
  ];

  return (
    <div className=" grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Van Details */}
      <div className="bg-white rounded-2xl px-8 py-16 shadow-lg col-span-2">
        <h2 className="text-lg font-semibold mb-4">Toyota HIACE Spec 10</h2>
        <div className="rounded-xl border-border-bold-shade border p-4 mb-4 flex">
          <div>
            <Image
              src="/Images/vehicle_placeholder.png"
              alt="Van"
              width={250}
              height={150}
              className="rounded-lg mb-4"
            />
          </div>
          <div className='p-2.5 w-full gap-5'>
            <p className='text-sm'><span className="font-medium">Van ID:</span> <span className="text-active-text">V000245</span></p>
            <p className='text-sm'><span className="font-medium">Model:</span> Toyota HiAce</p>
            <div className="my-2">
              <div className="text-xs mb-1">Seats: 12 / 15</div>
              <div className='w-full flex justify-end'>
                <div className=" bg-gray-200 rounded-full h-1.5 w-9/10">
                  <div className="bg-primary h-1.5 rounded-full " style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>
            <p className='text-sm'><span className="font-medium">District:</span> Colombo</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2 text-active-text">Schools</h3>
          <ul className="">
            {schools.map((school, idx) => (
              <li key={idx} className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    idx < 4 ? 'bg-primary' : 'bg-gray-400'
                  }`}
                ></div>
                <span className="text-sm text-gray-800">{school}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='col-span-2 space-y-2'>
          {/* Driver & Assistant */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-base font-semibold mb-4">Driver</h2>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className=''> 
                    <Image src="/Images/male_pro_pic_placeholder.png" alt="Driver" width={50} height={50} className="rounded-full" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Duleepa Edirisinghe</p>
                    <p className="text-xs text-gray-500">Experience: 6 years</p>
                    <p className="text-yellow-500">⭐⭐⭐⭐⭐</p>
                  </div>
                </div>
                <button className="btn-small-primary ml-4">More Options</button>
              </div>
              <h2 className="text-base font-semibold mb-4">Assistant</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className=''> 
                    <Image src="/Images/male_pro_pic_placeholder.png" alt="Assistant" width={50} height={50} className="rounded-full" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Ayanga Wethmini</p>
                    <p className="text-xs text-gray-500">Experience: 7 years</p>
                    <p className="text-yellow-500">⭐⭐⭐⭐⭐</p>
                  </div>
                </div>
                <button className="btn-small-primary ml-4">More Options</button>
              </div>
            </div>
          <div className='w-full grid grid-cols-4 gap-4'>
            {/* Route & Safety */}
              <div className="bg-white rounded-2xl p-6 shadow-lg col-span-2">
                <h2 className="text-base font-semibold mb-4">Current Route</h2>
                <Image
                  src="/Images/routePlaceholder.png"
                  alt="Route"
                  width={200}
                  height={125}
                  className="rounded-lg"
                />
              </div>
                {/* Student List */}
              <div className="bg-white rounded-2xl p-6 shadow-lg col-span-2">
                <h2 className="text-base font-semibold mb-4">Student List</h2>
                <ul className="space-y-4">
                  {students.map((s, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={s.image}
                          alt={s.name}
                          width={36}
                          height={36}
                          className="rounded-full"
                        />
                        <span className="text-xs font-medium text-gray-700">{s.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 ml-1">pickup - {s.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
          </div>
      </div>
    </div>
  );
};

export default VanDetails;
