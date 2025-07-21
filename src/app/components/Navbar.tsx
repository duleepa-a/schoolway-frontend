'use client';

import Link from 'next/link';
import { useSession,signOut } from 'next-auth/react';
import Image from 'next/image';


export default function Navbar() {
  const {status, data: session} = useSession();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-900">
          <Link href="/"> <img src="/logo/Logo_light.svg" height={100} width={100} alt="" /></Link>
        </div>
        <ul className="hidden md:flex space-x-10 text-sm font-medium text-active-text ">
          <li><Link href="/" className='no-underline hover:text-primary'>Home</Link></li>
          <li>
            <button 
              onClick={() => scrollToSection('services')} 
              className='no-underline hover:text-primary bg-transparent border-none cursor-pointer text-sm font-semibold text-active-text'
            >
              Service
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('features')} 
              className='no-underline hover:text-primary bg-transparent border-none cursor-pointer text-sm font-semibold text-active-text'
            >
              Features
            </button>
          </li>
          <li><Link href="/contactus" className='no-underline hover:text-primary'>Contact us</Link></li>
          <li>
            <button 
              onClick={() => scrollToSection('testimonials')} 
              className='no-underline hover:text-primary bg-transparent border-none cursor-pointer text-sm font-semibold text-active-text'
            >
              Testimonial
            </button>
          </li>
          {/* <li><Link href="#faq" className='no-underline hover:text-primary'>FAQ</Link></li> */}
        </ul>
        {/* {
          JSON.parse(localStorage.getItem('user') || '{}').email
          }
         */}
        <div className="space-x-2">
          {status==="unauthenticated" && <>
          {
          JSON.parse(localStorage.getItem('user') || '{}').serviceName
          }
          <Link href="/login">
            <button className="cursor-pointer text-gray-700 px-4 py-2 text-sm">Login</button>
          </Link>
          <Link href="/signup">
            <button className="btn-small-primary">
              Sign up
            </button>
          </Link>
          </>
          }
            {/* <div>
              <pre>{JSON.stringify(session, null, 2)}</pre>
            </div> */}
          {
          status === "authenticated" 
          // && <Image src={session.user!.picture}/> 
          &&<> 
          {/* {
          JSON.parse(localStorage.getItem('user') || '{}').serviceName
          } */}
          <div className="flex justify-center align-middle">
            {(session.user?.role === "SERVICE" || session.user?.role === "ADMIN") ? (
              <Link href={session.user?.role === "SERVICE" ? "/vanowner" : "/admin"}>
                <div tabIndex={0} role="button" className="btn-ghost rounded-full mr-5"> 
                  {/* border-2 border-amber-400 class data for DP contrast */}
                  <Image
                    src={session.user?.image || "/Images/male_pro_pic_placeholder.png"}
                    width={40}
                    height={40}
                    alt="User image"
                    className="rounded-full"
                  />
                </div>
              </Link>
            ) : (
              <div tabIndex={0} role="button" className="btn-ghost rounded-full">
                <Image
                  src={session.user?.image || "/Images/male_pro_pic_placeholder.png"}
                  width={40}
                  height={40}
                  alt="User image"
                  className="rounded-full"
                />
              </div>
            )}
            
            <ul
              tabIndex={0}
              className="flex gap-2 ">
              
              {/* {session.user?.role === "SERVICE" ? (
                <li>
                  <Link href="/vanowner" className='no-underline hover:text-primary'>
                    <button className="cursor-pointer text-gray-700 px-4 py-2 text-sm">Dashboard</button>
                  </Link>
                </li>
              ) : session.user?.role === "ADMIN" ? (
                <li>
                  <Link href="/admin">
                    <button className='cursor-pointer'>
                      Dashboard
                    </button>
                  </Link>
                </li>
              ) : null} */}
              <li>
                <div className="flex items-center h-full">
                  <button
                  className="btn-small-primary"
                  onClick={() =>
                    signOut({ callbackUrl: "/" })
                  }
                  >
                  Log Out
                  </button>
                </div>
              </li>
            </ul>
          </div> </>
          // &&<>{session.user!.name}</>
          }
          
        </div>
      </div>
    </nav>
  );
}
