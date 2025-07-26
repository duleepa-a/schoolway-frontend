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
    <section
      id="testimonials"
      className="py-12 px-4 text-center"
      style={{ background: 'var(--color-background)' }}
    >
      <h2 className="text-3xl font-semibold">
        <span
          style={{
            background: 'linear-gradient(90deg, var(--blue-shade-dark) 0%, var(--blue-shade-light) 60%, var(--green-shade-light) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 700
          }}
        >
          SchoolWay
        </span>{' '}
        <span style={{ color: 'var(--color-textblack)' }}>The Future of School Transportation!</span>
      </h2>
      <p className="mt-2" style={{ color: 'var(--color-textgreydark)' }}>
        Find out what our users think about our platform and how we made their life easier.
      </p>
      <div className="mt-10 grid grid-cols-3 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {hometestimonials.map((t, index) => (
          <div
            key={index}
            style={{
              background: 'var(--color-textwhite)',
              boxShadow: '0 2px 8px 0 rgba(0,188,212,0.10)',
              borderRadius: '0.75rem',
              color: 'var(--color-textblack)'
            }}
            className="p-6 text-left w-2xs"
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
                <h4 className="font-semibold" style={{ color: 'var(--blue-shade-dark)' }}>{t.name}</h4>
                <p className="text-sm" style={{ color: 'var(--green-shade-dark)' }}>{t.role}</p>
              </div>
            </div>
            <p className="text-sm px-8" style={{ color: 'var(--color-textgreydark)' }}>{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
