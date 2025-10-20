import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import TopBarContent from "./TopBarContent";

interface Props {
  heading: string;
}

export default async function TopBar({ heading }: Props) {
  const session = await getServerSession(authOptions);

  return (
    <div className="top-bar">
      <TopBarContent heading={heading} serverSession={session} />
    </div>
  );
}
