import { HiOutlineUsers,HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { HiOutlineMap} from "react-icons/hi";
import { MdOutlineAttachMoney,MdOutlineDirectionsCar,MdOutlineCases  } from "react-icons/md"

const offerings = [
  {
    title: "Find School Vans",
    description: "With hundreds of van services available, find the best suiting one made easier than ever with our platform.",
    icon: < HiOutlineUsers className="text-black text-2xl" />,
  },
  {
    title: "Live Track Your Child",
    description: "Never worry about your child’s safety on roads. We provide the facility to track the child location on every ride.",
    icon: <HiOutlineMap className="text-black text-2xl" />,
  },
  {
    title: "Monthly Payments",
    description: "Payment settlement is never a hassle with us. Few taps and you are all good to go!",
    icon: <MdOutlineAttachMoney className="text-black text-2xl" />,
  },
  {
    title: "Streamline your rides",
    description: "Join us to find the perfect driver and launch a rewarding school service together! Start a school service with us.",
    icon: <HiOutlineMagnifyingGlass className="text-black text-2xl" />,
  },
  {
    title: "Find a vehicle for yourself",
    description: "Have the driving skills but no vehicle? No problem. We’ve got you covered.",
    icon: <MdOutlineDirectionsCar className="text-black text-2xl" />,
  },
  {
    title: "Earn more with private trips",
    description: "Take the most out of your free days. Find private hires other than the school rides and earn more with us.",
    icon: <MdOutlineCases className="text-black text-2xl" />,
  },
];

export default function WhatWeOffer() {
  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-3xl font-bold mb-2">What We Offer</h2>
      <p className=" mb-12 max-w-2xl mx-auto">
        We've been joyfully linking school van services with parents nationwide for a safer, smoother ride!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-6xl mx-auto">
        {offerings.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
          >
            <div className="flex justify-center mb-4">
                <div className="bg-yellow-100 p-3 w-13 rounded-tr-md rounded-bl-md rounded-tl-2xl rounded-br-2xl">
                        {item.icon}
                </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className=" text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
