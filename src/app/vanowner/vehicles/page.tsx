import { getServerSession } from "next-auth";
import  {authOptions }from '../../api/auth/[...nextauth]/route';
import VehiclesPage from "./VehiclesPage"; 

export default async function VehiclesPageServer() {
  const session = await getServerSession(authOptions);

  return <VehiclesPage serverSession={session} />;
}