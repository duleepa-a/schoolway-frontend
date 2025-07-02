import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function AppLink() {
  return (
      <div className="bg-[#F5F7FA] w-full justify-items-center text-center py-20 ">
        <h1 className="text-6xl">Get Our Mobile App from <br/> Play Store</h1>        
        <div className="flex gap-4">
            <button className="bg-primary text-white hover:bg-gray-900 px-8 py-4 text-sm font-semibold rounded flex items-center gap-2 cursor-pointer mt-10">
               Get App<FaArrowRight className="w-6 h-6" />
            </button>
        </div>
      </div>
  );
}
