'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { signOut} from 'next-auth/react';

export default function Navbar() {

  const {status, data: session} = useSession();


  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-900">
          {/* <Link href="/">School<span className="text-yellow-500">Way</span></Link> */}
          <Link href="/"> <img src="/illustrations/Logo_light.svg" height={100} width={100} alt="" /></Link>
        </div>
        <ul className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
          <li><Link href="/">Home</Link></li>
          <li><Link href="#services">Service</Link></li>
          <li><Link href="#features">Features</Link></li>
          <li><Link href="#contact">Contact</Link></li>
          <li><Link href="#testimonials">Testimonial</Link></li>
          <li><Link href="#faq">FAQ</Link></li>
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
            <button className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded text-sm">
              Sign up
            </button>
          </Link></>
          }
          {
          status === "authenticated" 
          // && <Image src={session.user!.picture}/> 
          &&<> 
          {/* {
          JSON.parse(localStorage.getItem('user') || '{}').serviceName
          } */}
          <div className="dropdown dropdown-end">
            
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
              className="menu dropdown-content text-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm">
              
              <li><a>Visit Dashboard</a></li>
              <li ><button onClick={() =>
                  signOut({ callbackUrl: "/" }) // Redirect to homepage or custom goodbye page
                }>Sign out</button>
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
