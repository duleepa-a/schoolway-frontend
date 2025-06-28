'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser ,FaUserAlt } from 'react-icons/fa';
import { HiHome } from "react-icons/hi";
import { FaChartSimple } from "react-icons/fa6";
import { TbBriefcase2Filled } from "react-icons/tb";
import { HiRectangleGroup } from "react-icons/hi2";
import Image from "next/image";

const navItems = [
  { label: 'Dashboard', icon: <HiHome />, href: '/vanowner' },
  { label: 'Students', icon: <FaUser/>, href: '/students' },
  { label: 'Vehicles', icon: <FaChartSimple  />, href: '/vehicles' },
  { label: 'Private hires', icon: <HiRectangleGroup/>, href: '/private-hires' },
  { label: 'Profile', icon: <FaUserAlt />, href: '/profile' },
  { label: 'Revenue', icon: <TbBriefcase2Filled />, href: '/revenue' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen bg-white flex flex-col ">
      {/* Logo */}
      <div className="flex justify-center border-b-border-light-shade border-b-1 p-10 mt-10">
        <Image
          src="../illustrations/Logo_light.svg"
          alt="Hero Slide"
          width={120}
          height={120}
          className="object-contain "
        />
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-4 py-10 pl-10">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 pl-3 pr-13 my-2 transition  no-underline  
              ${pathname === item.href ? 'border-r-4 border-primary' : 'hover:text-active-text '}
              `}
          >
              <span className={`text-lg mr-2
                ${pathname === item.href ? ' text-primary font-semibold ' : 'text-inactive-text '}        
              `}>
                {item.icon}
              </span>
              <span className={`
                ${pathname === item.href ? ' text-lg font-semibold  text-active-text' : 'text-inactive-text'}        
              `}>
                {item.label}
              </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
