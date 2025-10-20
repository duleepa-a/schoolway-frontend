'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface TopBarProps {
  heading: string;
}

const TopBar = ({ heading }: TopBarProps) => {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{heading}</h1>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              {session?.user?.name || 'Admin User'}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            <Image
              src={session?.user?.image || '/Images/male_pro_pic_placeholder.png'}
              alt="Profile"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;