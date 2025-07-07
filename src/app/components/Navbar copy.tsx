'use client';

import Link from 'next/link';
import { useSession,signOut } from 'next-auth/react';
import Image from 'next/image';


export default function Navbar() {

  const {status, data: session} = useSession();


  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        <div className="text-xl font-bold text-blue-900">
          {/* <Link href="/">School<span className="text-yellow-500">Way</span></Link> */}
          <Link href="/"> <img src="/logo/Logo_light.svg" height={100} width={100} alt="" /></Link>

        </div>
        <ul className="hidden md:flex space-x-6 text-sm font-medium text-active-text ">
          <li><Link href="/" className='no-underline hover:text-primary'>Home</Link></li>
          <li><Link href="#services" className='no-underline hover:text-primary'>Service</Link></li>
          <li><Link href="#features" className='no-underline hover:text-primary'>Features</Link></li>
          <li><Link href="#contact" className='no-underline hover:text-primary'>Contact</Link></li>
          <li><Link href="#testimonials" className='no-underline hover:text-primary'>Testimonial</Link></li>
          <li><Link href="#faq" className='no-underline hover:text-primary'>FAQ</Link></li>
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
             <div tabIndex={0} role="button" className=" btn-ghost rounded-full">
              <Image
                src={ session.user?.image ||  "/illustrations/profile_d2.png"}
                width={40}
                height={40}
                alt="User image"
                className='rounded-full'
              />
            </div>
            
            <ul
              tabIndex={0}
              className="flex gap-2 ">
              
              {session.user?.role === "SERVICE" ? (
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
              ) : null}
              <li>
                <button className='btn-small-primary' onClick={() =>
                  signOut({ callbackUrl: "/" })  // Redirect to homepage or custom goodbye page
                }>
                  Log Out
                </button>
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
