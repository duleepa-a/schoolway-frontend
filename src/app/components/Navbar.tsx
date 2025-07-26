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
    <nav className="w-full bg-white relative z-10 sticky top-0">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl no-underline text-inherit"> SchoolWay
            {/* <img src="/logo/Logo_light.svg" height={100} width={100} alt="" /> */}
            </Link>
          </div>
          <ul className="hidden md:flex items-center space-x-12 text-sm font-medium text-active-text ">
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
          <div className="flex items-center space-x-3">
            <div className="space-x-2 flex items-center">
              {status==="unauthenticated" && <>
                {
                  JSON.parse(localStorage.getItem('user') || '{}').serviceName
                }
                <Link href="/login">
                  <button className="cursor-pointer text-white px-7 h-9 rounded-full font-semibold text-sm shadow-md transition-all duration-200" style={{background: "linear-gradient(90deg, var(--color-cyan-400, #22d3ee) 0%, var(--color-blue-500, #2563eb) 100%)"}}>Login</button>
                </Link>
                <Link href="/signup">
                  <button className="btn-small-primary px-7 h-9 rounded-full font-semibold text-white text-sm shadow-md transition-all duration-200" style={{background: "#111"}}>Sign up</button>
                </Link>
              </>}
              {/* <div>
                <pre>{JSON.stringify(session, null, 2)}</pre>
              </div> */}
              {status === "authenticated" && <>
                <div className="flex justify-center align-middle">
                  {(session.user?.role === "SERVICE" || session.user?.role === "ADMIN") ? (
                    <Link href={session.user?.role === "SERVICE" ? "/vanowner" : "/admin"}>
                      <div tabIndex={0} role="button" className="btn-ghost rounded-full mr-5"> 
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
                  <ul tabIndex={0} className="flex gap-2 ">
                    <li>
                      <div className="flex items-center h-full">
                        <button
                          className="btn-small-primary px-7 h-9 rounded-full font-semibold text-white text-sm shadow-md transition-all duration-200"
                          style={{background: "#111"}}
                          onClick={() => signOut({ callbackUrl: "/" })}
                        >
                          Log Out
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
              </>}
            </div>
            
          </div>
        </div>
      </div>
    </nav>
  );
}
