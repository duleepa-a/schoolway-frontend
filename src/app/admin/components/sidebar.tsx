'use client'

import { Home, User, BarChart, CreditCard, RotateCcw, HelpCircle, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', icon: <Home className="sidebar-icon" />, path: '/admin' },
  { name: 'Users', icon: <User className="sidebar-icon" />, path: '/admin/users' },
  { name: 'Applications', icon: <BarChart className="sidebar-icon" />, path: '/admin/applications' },
  { name: 'Payroll', icon: <CreditCard className="sidebar-icon" />, path: '/admin/payroll' },
  { name: 'Payments', icon: <RotateCcw className="sidebar-icon" />, path: '/admin/payments' },
  { name: 'Inquiries', icon: <HelpCircle className="sidebar-icon" />, path: '/admin/inquiries' },
  { name: 'Awareness', icon: <Award className="sidebar-icon" />, path: '/admin/awareness' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar-container">
      <div className="sidebar-logo">
        <Image src="/logo/Logo_light.svg" alt="Logo" width={120} height={60} className="object-contain" />
      </div>
      <nav className="sidebar-section">
        {navItems.map((item) => {
          const isActive =
            item.path === '/admin'
              ? pathname === '/admin'
              : pathname === item.path || pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
