import VanDetails from './VanDetails';
import TopBar from '@/app/dashboardComponents/TopBar';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export default async function VanDetailsPage({ params }: Props) {
  const paras = await params;
  const id = parseInt(paras.id);

  if (isNaN(id)) return notFound();

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/vans/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) return notFound();

  const van = await res.json();

  return (
    <section className="p-6 md:p-10 min-h-screen w-full">
      <TopBar heading="My Vehicle" />
      <VanDetails van={van} />
    </section>
  );
}
