'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

import { FaUser } from 'react-icons/fa';
import { HiHome } from 'react-icons/hi';
import { FaChartSimple } from 'react-icons/fa6';
import { TbBriefcase2Filled } from 'react-icons/tb';
import { HiRectangleGroup } from 'react-icons/hi2';
import { MdCreditCard, MdOutlinePayments } from 'react-icons/md';
import { RiQuestionAnswerFill } from 'react-icons/ri';
import { GiLaurelsTrophy } from 'react-icons/gi';
import { PiStudentFill } from 'react-icons/pi';
import { Bus } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: <HiHome />, href: '/admin' },
  { label: 'Users', icon: <FaUser />, href: '/admin/users' },
  { label: 'Admins', icon: <FaUser />, href: '/admin/admins' },
  { label: 'Applications', icon: <FaChartSimple />, href: '/admin/applications' },
  { label: 'Schools', icon: <PiStudentFill />, href: '/admin/school' },
  { label: 'Payroll', icon: <MdCreditCard />, href: '/admin/payroll' },
  { label: 'Payments', icon: <MdOutlinePayments />, href: '/admin/payments' },
  { label: 'Inquiries', icon: <RiQuestionAnswerFill />, href: '/admin/inquiries' },
  { label: 'Awareness', icon: <GiLaurelsTrophy />, href: '/admin/awareness' },
  { label: 'Routes', icon: <Bus />, href: '/admin/routes' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen bg-white flex flex-col justify-between border-r border-gray-100">
      {/* Gradient Header */}
      <div>
        <div className="relative w-full h-[120px] flex items-center justify-center">
          <svg
            viewBox="0 0 288 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 left-0 w-full h-full rotate-180"
          >
            <defs>
              <linearGradient id="adminGradient" x1="0" y1="0" x2="288" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0099cc" />
                <stop offset="60%" stopColor="#00bcd4" />
                <stop offset="100%" stopColor="#00d4aa" />
              </linearGradient>
            </defs>
            <path d="M0,0 Q72,60 144,30 Q216,0 288,60 L288,120 L0,120 Z" fill="url(#adminGradient)" />
          </svg>
          {/* <Image
            src="/logo/Logo_light.svg"
            alt="Logo"
            width={120}
            height={40}
            className="relative z-10 object-contain mt-6"
          /> */}
          <span className="relative z-10 text-white text-2xl font-semibold ">SchoolWay</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 mt-8">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group flex items-center gap-4 px-8 py-3 my-1 transition-colors no-underline relative
                  ${isActive ? '' : 'text-gray-500 hover:bg-gray-50'}
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 rounded-r bg-[#0099cc]" />
                )}
                <span className={`text-xl ${isActive ? 'text-[#0099cc]' : 'text-gray-400 group-hover:text-[#0099cc]'}`}>
                  {item.icon}
                </span>
                <span className={`text-base ${isActive ? 'font-semibold text-black' : 'group-hover:text-[#0099cc]'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="flex items-center gap-3 px-8 py-6 border-t border-gray-100">
        <div className="flex flex-col">
          <span className="text-xs text-gray-700">SchoolWay Admin</span>
          <span className="text-xs text-gray-400">All Rights Reserved</span>
        </div>
      </div>
    </aside>
  );
}
