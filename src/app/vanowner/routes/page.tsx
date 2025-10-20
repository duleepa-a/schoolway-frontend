import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import RoutePage from "./routePage";

export default async function VehiclesPageServer() {
  const session = await getServerSession(authOptions);

  return <RoutePage serverSession={session} />;
}