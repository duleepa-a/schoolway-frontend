'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

import { FaUser, FaUserAlt } from 'react-icons/fa';
import { HiHome } from "react-icons/hi";
import { FaChartSimple } from "react-icons/fa6";
import { TbBriefcase2Filled } from "react-icons/tb";
import { HiRectangleGroup } from "react-icons/hi2";
import { MdCreditCard, MdOutlinePayments } from "react-icons/md";
import { RiQuestionAnswerFill } from "react-icons/ri";
import { GiLaurelsTrophy } from "react-icons/gi";
import { PiStudentFill } from "react-icons/pi";

const navItems = [
  { label: 'Dashboard', icon: <HiHome />, href: '/admin' },
  { label: 'Users', icon: <FaUser />, href: '/admin/users' },
  { label: 'Applications', icon: <FaChartSimple />, href: '/admin/applications' },
  { label: 'Schools', icon: <PiStudentFill />, href: '/admin/school' },
  { label: 'Payroll', icon: <MdCreditCard />, href: '/admin/payroll' },
  { label: 'Payments', icon: <MdOutlinePayments />, href: '/admin/payments' },
  { label: 'Inquiries', icon: <RiQuestionAnswerFill />, href: '/admin/inquiries' },
  { label: 'Awareness', icon: <GiLaurelsTrophy />, href: '/admin/awareness' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen bg-white flex flex-col">
      <div className="flex justify-center border-b-border-light-shade border-b-1 p-10 mt-10">
        <Link href="/">
          <Image
            src="/logo/Logo_light.svg"
            alt="Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </Link>
      </div>

      <nav className="flex flex-col gap-4 py-10 pl-10">
        {navItems.map((item) => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-3 pl-3 pr-13 my-2 transition no-underline 
                ${isActive ? 'border-r-4 border-primary' : ''}
              `}
            >
              <span className={`text-lg mr-2 group-hover:text-primary group-hover:font-semibold 
                ${isActive ? 'text-primary font-semibold' : 'text-inactive-text'}        
              `}>
                {item.icon}
              </span>
              <span className={` group-hover:text-active-text group-hover:font-semibold group-hover:text-lg
                ${isActive ? 'text-lg font-semibold text-active-text' : 'text-inactive-text'}        
              `}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
