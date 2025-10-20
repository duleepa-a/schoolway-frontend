import Notifications from '@/app/notifications/notifications';
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';

 
export  default   async function NotificationsPage() {
    const session = await getServerSession(authOptions);
    
    return <Notifications  serverSession={session} />;
}