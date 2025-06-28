'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaUserFriends, FaCar, FaUserCircle, FaMoneyBill, FaSuitcase } from 'react-icons/fa';

const navItems = [
  { label: 'Dashboard', icon: <FaTachometerAlt />, href: '/vanowner' },
  { label: 'Students', icon: <FaUserFriends />, href: '/students' },
  { label: 'Vehicles', icon: <FaCar />, href: '/vehicles' },
  { label: 'Private hires', icon: <FaSuitcase />, href: '/private-hires' },
  { label: 'Profile', icon: <FaUserCircle />, href: '/profile' },
  { label: 'Revenue', icon: <FaMoneyBill />, href: '/revenue' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen bg-white flex flex-col p-6">
      
    </aside>
  );
}
