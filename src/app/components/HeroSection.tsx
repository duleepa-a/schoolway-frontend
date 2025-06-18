import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gray-50 py-20 px-4 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to SchoolWay</h1>
          <p className="text-xl font-semibold text-gray-700">
            Secure, Tracked, and Smiling All the Way!
          </p>
          <p className="text-gray-600">
            Where to grow your business as a photographer: site or social media?
          </p>
          <Link href="/register">
            <button className="bg-yellow-400 text-white px-6 py-2 rounded font-semibold hover:bg-yellow-500">
              Register
            </button>
          </Link>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <Image
            src="/illustrations/heroimage.png" 
            alt="SchoolWay tracking"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-2">
        <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
        <span className="w-2 h-2 bg-yellow-200 rounded-full"></span>
        <span className="w-2 h-2 bg-yellow-200 rounded-full"></span>
      </div>
    </section>
  );
}
