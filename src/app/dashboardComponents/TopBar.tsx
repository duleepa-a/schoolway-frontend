'use client';

import { useEffect } from 'react';
import { useSession,signOut } from 'next-auth/react';
import { FaBell, FaMoon } from 'react-icons/fa';
import { BiLogOut } from "react-icons/bi";
import Image from 'next/image';

interface Props{
  heading : string;
}

const TopBar = ({heading} : Props) => { //for future use
  
  const {status, data: session} = useSession();

  return (
    <>
      <div className="topBarWrapper sticky top-0 z-10 bg-[#F4F7FE]">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{heading}</h2>
        </div>
        <div className="topBarIcons">
          <FaBell className="topBarIcon ml-5" />
          <FaMoon className="topBarIcon" />
          
          <BiLogOut className='topBarIcon text-2xl' 
                  onClick={() =>
                            signOut({ callbackUrl: "/" })
                          }
          />
          <Image
            // src="/Images/male_pro_pic_placeholder.png"
            src={ session?.user?.image ||  "/Images/male_pro_pic_placeholder.png"}
            alt="Profile"
            width={50}
            height={50}
            className="topBarImage" 
          />

          </div>
      </div>
    </>
  );
};

export default TopBar;
