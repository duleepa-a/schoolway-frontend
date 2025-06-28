'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold ">
          <Link href="/"> <img src="/illustrations/Logo_light.svg" height={100} width={100} alt="" /></Link>
        </div>
        <ul className="hidden md:flex space-x-6 text-sm font-medium text-active-text ">
          <li><Link href="/" className='no-underline hover:text-primary'>Home</Link></li>
          <li><Link href="#services" className='no-underline hover:text-primary'>Service</Link></li>
          <li><Link href="#features" className='no-underline hover:text-primary'>Features</Link></li>
          <li><Link href="#contact" className='no-underline hover:text-primary'>Contact</Link></li>
          <li><Link href="#testimonials" className='no-underline hover:text-primary'>Testimonial</Link></li>
          <li><Link href="#faq" className='no-underline hover:text-primary'>FAQ</Link></li>
        </ul>
        <div className="space-x-2">
          <Link href="/login">
            <button className="cursor-pointer text-gray-700 px-4 py-2 text-sm">Login</button>
          </Link>
          <Link href="/signup">
            <button className="cursor-pointer bg-primary hover:bg-yellow-500 text-white px-4 py-2 rounded text-sm">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
