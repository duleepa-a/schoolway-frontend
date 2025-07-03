'use client';
import { useEffect } from 'react';
import { FaBell, FaMoon, FaPowerOff } from 'react-icons/fa';
import Image from 'next/image';

interface Props{
  heading : string;
}

const TopBar = ({heading} : Props) => { //for future use
  
  useEffect(() => {
    
  }, []);

  return (
    <div className="topBarWrapper">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{heading}</h2>
      </div>
      <div className="topBarIcons">
        <FaBell className="topBarIcon ml-5" />
        <FaMoon className="topBarIcon" />
        <FaPowerOff className='topBarIcon' />
        <Image
          src="/Images/male_pro_pic_placeholder.png"
          alt="Profile"
          width={50}
          height={50}
          className="topBarImage"
        />
      </div>
    </div>
  );
};

export default TopBar;
