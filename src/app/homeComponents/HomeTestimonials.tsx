import Image from 'next/image';

const hometestimonials = [
  {
    name: 'Mahinda Rajapakse',
    role: 'Driver',
    image: '/illustrations/avatar.png', 
    text: `“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”`
  },
  {
    name: 'Mahinda Rajapakse',
    role: 'Driver',
    image: '/illustrations/avatar.png',
    text: `“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”`
  },
  {
    name: 'Mahinda Rajapakse',
    role: 'Driver',
    image: '/illustrations/avatar.png',
    text: `“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”`
  }
];

export default function HomeTestimonials() {
  return (
    <section className="py-12 px-4 text-center bg-white">
      <h2 className="text-3xl font-semibold">
        <span className="text-primary font-bold">SchoolWay</span> The Future of School Transportation!
      </h2>
      <p className="mt-2 text-gray-600">
        Find out what our users think about our platform and how we made their life easier.
      </p>
      <div className="mt-10 grid grid-cols-3 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {hometestimonials.map((t, index) => (
          <div
            key={index}
            className="bg-gray-50 shadow-md rounded-lg p-6 text-left w-2xs"
          >
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={t.image}
                alt={t.name}
                width={100}
                height={100}
                className="rounded-full mb-2"
              />
              <div>
                <h4 className="font-semibold">{t.name}</h4>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm px-8">{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
