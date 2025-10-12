import TopBar from '@/app/dashboardComponents/TopBar';
import AwarenessPostCreator from './AwarenessPost';

const AdminDashboard = () => {
  return (
    <section className="p-4 md:p-8 min-h-screen w-full bg-gray-50">
      {/*Top bar with profile icon and the heading*/}
      <TopBar heading="Awareness Posts" />     

      {/* Main Content */}
      <AwarenessPostCreator />
    </section>
  )
}

export default AdminDashboard
