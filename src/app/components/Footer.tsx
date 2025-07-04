import Link from "next/link";
import { FaInstagram, FaTwitter, FaYoutube, FaDribbble } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className=" bg-swblue text-white py-30 px-15">  {/* bg-[#5D5E60] */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo and copyright */}
        <div>
          <Link href="/"> <img src="/logo/Logo_dark.svg" className="mb-3" height={150} width={150} alt="" /></Link>
          <p className="text-sm mb-2">Copyright © 2025 SchoolWay.<br />All rights reserved</p>
          <div className="flex space-x-3 mt-4">
            <FaInstagram className="text-xl hover:text-primary cursor-pointer" />
            <FaDribbble className="text-xl hover:text-primary cursor-pointer" />
            <FaTwitter className="text-xl hover:text-primary cursor-pointer" />
            <FaYoutube className="text-xl hover:text-primary cursor-pointer" />
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-primary no-underline">About us</Link></li>
            <li><Link href="#" className="hover:text-primary no-underline">Blog</Link></li>
            <li><Link href="#" className="hover:text-primary no-underline">Contact us</Link></li>
            <li><Link href="#" className="hover:text-primary no-underline">Pricing</Link></li>
            <li><Link href="#" className="hover:text-primary no-underline">Testimonials</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-primary no-underline">Help center</Link></li>
            <li><Link href="#" className="hover:text-primary no-underline">Terms of service</Link></li>
            <li><Link href="#" className="hover:text-primary no-underline">Legal</Link></li>
            <li><Link href="#" className="hover:text-primary no-underline">Privacy policy</Link></li>
            <li><Link href="#" className="hover:text-primary no-underline">Status</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Stay up to date</h3>
          {/* <div className="flex items-center bg-gray-700 rounded px-3 py-2"> */}
          <div className="flex items-center bg-swblue-600 border-1 rounded px-3 py-2">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-transparent outline-none w-full text-sm placeholder-gray-300 text-white"
            />
            <button className="text-white hover:text-primary ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M2.01 21L23 12 2.01 3v7l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
