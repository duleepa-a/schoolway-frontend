import { FaArrowRight } from "react-icons/fa";

export default function AppLink() {
  return (
      <div className="bg-[#F5F7FA] w-full justify-items-center text-center py-20 ">
        <h1 className="text-6xl">Get Our Mobile App from <br/> Play Store</h1>        
        <div className="flex gap-4">
            <button className="btn-primary px-3 flex items-center gap-2 mt-5">
               Get App
               <FaArrowRight className="w-5 h-5" />
            </button>
        </div>
      </div>
  );
}
